import { NextRequest, NextResponse } from "next/server";

interface TransferPreview {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  fees: number;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromAccountId, toAccountId, amount, description } = body;

    if (!fromAccountId || !toAccountId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock transfer preview - replace with actual logic
    const transferPreview: TransferPreview = {
      id: Math.random().toString(36).substring(7),
      fromAccountId,
      toAccountId,
      amount,
      description: description || "",
      fees: amount * 0.01, // Mock 1% fee
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(transferPreview);
  } catch {
    return NextResponse.json(
      { error: "Failed to create transfer preview" },
      { status: 500 }
    );
  }
}
