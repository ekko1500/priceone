import { NextRequest, NextResponse } from 'next/server';
import { extractPriceFromMessage } from '@/lib/gemini/extractor';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, wholesalerId } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    // Retrieve the wholesaler catalog to provide grounding context to Gemini
    const catalog = wholesalerId ? dbStore.getProductsByWholesaler(wholesalerId) : dbStore.getAllProducts();

    const draft = await extractPriceFromMessage(message.trim(), catalog);

    return NextResponse.json({ success: true, draft });
  } catch (error: any) {
    console.error('API Gemini extraction error:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract price' }, { status: 500 });
  }
}