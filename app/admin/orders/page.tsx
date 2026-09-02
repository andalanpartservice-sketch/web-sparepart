import React from 'react';
import { getOrders } from '@/lib/data-service';
import { OrderManagementClient } from './OrderManagementClient';

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrderManagementClient initialOrders={orders} />;
}
