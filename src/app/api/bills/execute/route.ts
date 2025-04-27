import { NextRequest, NextResponse } from 'next/server';

interface CompletedBillPayment {
  id: string;
  previewId: string;
  status: 'completed';
  confirmationNumber: string;
  executedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billPaymentPreviewId, approvalToken } = body;

    if (!billPaymentPreviewId || !approvalToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock completed bill payment - replace with actual execution logic
    const completedBillPayment: CompletedBillPayment = {
      id: Math.random().toString(36).substring(7),
      previewId: billPaymentPreviewId,
      status: 'completed',
      confirmationNumber: Math.random().toString(36).toUpperCase().substring(7),
      executedAt: new Date().toISOString()
    };

    return NextResponse.json(completedBillPayment);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to execute bill payment' },
      { status: 500 }
    );
  }
}
