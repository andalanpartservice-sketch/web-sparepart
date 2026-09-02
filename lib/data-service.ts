import { Product, Order, EmergencyInquiry, OrderStatus, InquiryStatus } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_INQUIRIES } from './mock-data';
import { createClient as createBrowserClient } from './supabase/client';
import { createClient as createServerClient } from './supabase/server';

// Global in-memory storage for mock fallback mode during runtime
const mockProductsStore: Product[] = [...INITIAL_PRODUCTS];
const mockOrdersStore: Order[] = [...INITIAL_ORDERS];
const mockInquiriesStore: EmergencyInquiry[] = [...INITIAL_INQUIRIES];

async function getSupabaseInstance() {
  if (typeof window !== 'undefined') {
    return createBrowserClient();
  } else {
    return await createServerClient();
  }
}

export async function getProducts(
  searchQuery?: string,
  brandFilter?: string,
  categoryFilter?: string,
  fastMovingOnly?: boolean
): Promise<Product[]> {
  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      
      if (brandFilter && brandFilter !== 'ALL') {
        query = query.eq('brand', brandFilter);
      }
      if (categoryFilter && categoryFilter !== 'ALL') {
        query = query.eq('category', categoryFilter);
      }
      
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let results = data as Product[];
        if (fastMovingOnly) {
          results = results.filter((p) => p.is_fast_moving);
        }
        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          results = results.filter(
            (p) =>
              p.part_number.toLowerCase().includes(q) ||
              p.name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.compatible_models.some((m) => m.toLowerCase().includes(q))
          );
        }
        return results;
      }
    }
  } catch (e) {
    console.warn('Using mock products data:', e);
  }

  // Fallback / local filter
  let list = [...mockProductsStore];
  if (brandFilter && brandFilter !== 'ALL') {
    list = list.filter((p) => p.brand.toLowerCase() === brandFilter.toLowerCase());
  }
  if (categoryFilter && categoryFilter !== 'ALL') {
    list = list.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
  }
  if (fastMovingOnly) {
    list = list.filter((p) => p.is_fast_moving);
  }
  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.part_number.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.compatible_models.some((m) => m.toLowerCase().includes(q))
    );
  }
  return list;
}

export async function getProductByIdOrPartNumber(idOrPartNumber: string): Promise<Product | null> {
  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${idOrPartNumber},part_number.ilike.${idOrPartNumber}`)
        .single();
      if (data) return data as Product;
    }
  } catch {
    // fallback
  }

  const cleanQuery = idOrPartNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
  const product = mockProductsStore.find(
    (p) =>
      p.id === idOrPartNumber ||
      p.part_number.toLowerCase() === idOrPartNumber.toLowerCase() ||
      p.part_number.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanQuery
  );
  return product || null;
}

export async function getOrderByIdOrCode(idOrCode: string): Promise<Order | null> {
  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(*))')
        .or(`id.eq.${idOrCode},order_code.eq.${idOrCode}`)
        .single();
      if (data) return data as Order;
    }
  } catch {
    // fallback
  }

  const order = mockOrdersStore.find((o) => o.id === idOrCode || o.order_code === idOrCode);
  return order || null;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(*))')
        .order('created_at', { ascending: false });
      if (data) return data as Order[];
    }
  } catch {
    // fallback
  }
  return mockOrdersStore;
}

export async function getEmergencyInquiries(): Promise<EmergencyInquiry[]> {
  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      const { data } = await supabase
        .from('emergency_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) return data as EmergencyInquiry[];
    }
  } catch {
    // fallback
  }
  return mockInquiriesStore;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
      if (!error) return true;
    }
  } catch {
    // fallback
  }
  const idx = mockOrdersStore.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    mockOrdersStore[idx].order_status = status;
    return true;
  }
  return false;
}

export async function updateInquiryStatus(inquiryId: string, status: InquiryStatus): Promise<boolean> {
  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      const { error } = await supabase.from('emergency_inquiries').update({ status }).eq('id', inquiryId);
      if (!error) return true;
    }
  } catch {
    // fallback
  }
  const idx = mockInquiriesStore.findIndex((i) => i.id === inquiryId);
  if (idx !== -1) {
    mockInquiriesStore[idx].status = status;
    return true;
  }
  return false;
}

export async function saveOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
  const newId = `ord-${Date.now()}`;
  const fullOrder: Order = {
    ...orderData,
    id: newId,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      const { data: createdOrder, error } = await supabase
        .from('orders')
        .insert({
          order_code: orderData.order_code,
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          customer_email: orderData.customer_email || null,
          shipping_address: orderData.shipping_address,
          payment_method: orderData.payment_method,
          payment_proof_url: orderData.payment_proof_url || null,
          order_status: orderData.order_status,
          total_amount: orderData.total_amount,
        })
        .select()
        .single();

      if (!error && createdOrder) {
        if (orderData.items && orderData.items.length > 0) {
          const itemInserts = orderData.items.map((it) => ({
            order_id: createdOrder.id,
            product_id: it.product_id,
            quantity: it.quantity,
            price_at_purchase: it.price_at_purchase,
          }));
          await supabase.from('order_items').insert(itemInserts);
        }
        return {
          ...fullOrder,
          id: createdOrder.id,
        };
      }
    }
  } catch {
    // fallback
  }

  mockOrdersStore.unshift(fullOrder);
  return fullOrder;
}

export async function saveEmergencyInquiry(
  inquiry: Omit<EmergencyInquiry, 'id' | 'status' | 'created_at'>
): Promise<EmergencyInquiry> {
  const newInquiry: EmergencyInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    status: 'NEW',
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      const { data, error } = await supabase
        .from('emergency_inquiries')
        .insert({
          customer_name: inquiry.customer_name,
          whatsapp_number: inquiry.whatsapp_number,
          machine_model: inquiry.machine_model,
          description: inquiry.description,
          photo_urls: inquiry.photo_urls,
          status: 'NEW',
        })
        .select()
        .single();

      if (!error && data) {
        return data as EmergencyInquiry;
      }
    }
  } catch {
    // fallback
  }

  mockInquiriesStore.unshift(newInquiry);
  return newInquiry;
}

export async function saveProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      const { data, error } = await supabase.from('products').insert(product).select().single();
      if (!error && data) {
        return data as Product;
      }
    }
  } catch {
    // fallback
  }

  mockProductsStore.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  try {
    const supabase = await getSupabaseInstance();
    if (supabase) {
      const { error } = await supabase.from('products').update(updates).eq('id', id);
      if (!error) return true;
    }
  } catch {
    // fallback
  }

  const idx = mockProductsStore.findIndex((p) => p.id === id);
  if (idx !== -1) {
    mockProductsStore[idx] = { ...mockProductsStore[idx], ...updates };
    return true;
  }
  return false;
}
