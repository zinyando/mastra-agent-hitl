import { NextRequest, NextResponse } from 'next/server';

interface BillPaymentPreview {
  id: string;
  billId: string;
  accountId: string;
  amount: number;
  payee: string;
  dueDate: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billId, accountId, amount } = body;

    if (!billId || !accountId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock bill payment preview - replace with actual logic
    const billPaymentPreview: BillPaymentPreview = {
      id: Math.random().toString(36).substring(7),
      billId,
      accountId,
      amount,
      payee: 'Mock Utility Company',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(billPaymentPreview);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create bill payment preview' },
      { status: 500 }
    );
  }
}
