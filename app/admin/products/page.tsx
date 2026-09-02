import React from 'react';
import { getProducts } from '@/lib/data-service';
import { ProductsClient } from './ProductsClient';

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <ProductsClient initialProducts={products} />;
}
