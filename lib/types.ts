export type StockStatus = 'READY' | 'INDENT';

export type PaymentMethod = 'BANK_TRANSFER' | 'COD' | 'CBD';

export type OrderStatus = 'PENDING' | 'VERIFIED' | 'PROCESSING' | 'SHIPPED' | 'CANCELLED';

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'SOLVED';

export interface Product {
  id: string;
  part_number: string;
  name: string;
  brand: string;
  category: string;
  compatible_models: string[];
  price: number;
  stock_status: StockStatus;
  image_url: string;
  description: string;
  is_fast_moving?: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product?: Product;
}

export interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  payment_method: PaymentMethod;
  payment_proof_url?: string;
  order_status: OrderStatus;
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}

export interface EmergencyInquiry {
  id: string;
  customer_name: string;
  whatsapp_number: string;
  machine_model: string;
  description: string;
  photo_urls: string[];
  status: InquiryStatus;
  created_at: string;
}
