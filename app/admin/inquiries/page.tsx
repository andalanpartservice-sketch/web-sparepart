import React from 'react';
import { getEmergencyInquiries } from '@/lib/data-service';
import { InquiriesClient } from './InquiriesClient';

export default async function AdminInquiriesPage() {
  const inquiries = await getEmergencyInquiries();
  return <InquiriesClient initialInquiries={inquiries} />;
}
