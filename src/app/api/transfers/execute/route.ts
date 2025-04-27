import { NextRequest, NextResponse } from 'next/server';

interface CompletedTransfer {
  id: string;
  previewId: string;
  status: 'completed';
  confirmationNumber: string;
  executedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transferPreviewId, approvalToken } = body;

    if (!transferPreviewId || !approvalToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock completed transfer - replace with actual execution logic
    const completedTransfer: CompletedTransfer = {
      id: Math.random().toString(36).substring(7),
      previewId: transferPreviewId,
      status: 'completed',
      confirmationNumber: Math.random().toString(36).toUpperCase().substring(7),
      executedAt: new Date().toISOString()
    };

    return NextResponse.json(completedTransfer);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to execute transfer' },
      { status: 500 }
    );
  }
}
