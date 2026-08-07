import { NextResponse } from 'next/server';

import { getSearchDocuments } from '@/lib/search/documents';

export const dynamic = 'force-static';

export async function GET() {
  const documents = await getSearchDocuments();

  return NextResponse.json(documents);
}
