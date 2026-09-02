import React from 'react';
import { notFound } from 'next/navigation';
import { getProductByIdOrPartNumber } from '@/lib/data-service';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const product = await getProductByIdOrPartNumber(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient initialProduct={product} id={resolvedParams.id} />;
}
