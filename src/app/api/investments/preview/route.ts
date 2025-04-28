import { NextRequest, NextResponse } from "next/server";

interface InvestmentPreview {
  id: string;
  accountId: string;
  instrumentId: string;
  amount: number;
  projectedReturns: {
    oneYear: number;
    fiveYear: number;
    tenYear: number;
  };
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, instrumentId, amount } = body;

    if (!accountId || !instrumentId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock investment preview - replace with actual logic
    const investmentPreview: InvestmentPreview = {
      id: Math.random().toString(36).substring(7),
      accountId,
      instrumentId,
      amount,
      projectedReturns: {
        oneYear: amount * 1.07, // Mock 7% annual return
        fiveYear: amount * Math.pow(1.07, 5),
        tenYear: amount * Math.pow(1.07, 10),
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(investmentPreview);
  } catch {
    return NextResponse.json(
      { error: "Failed to create investment preview" },
      { status: 500 }
    );
  }
}
