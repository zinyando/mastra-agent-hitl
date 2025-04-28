import { NextRequest, NextResponse } from "next/server";

interface CompletedInvestment {
  id: string;
  previewId: string;
  status: "completed";
  confirmationNumber: string;
  executedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { investmentPreviewId, approvalToken } = body;

    if (!investmentPreviewId || !approvalToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock completed investment - replace with actual execution logic
    const completedInvestment: CompletedInvestment = {
      id: Math.random().toString(36).substring(7),
      previewId: investmentPreviewId,
      status: "completed",
      confirmationNumber: Math.random().toString(36).toUpperCase().substring(7),
      executedAt: new Date().toISOString(),
    };

    return NextResponse.json(completedInvestment);
  } catch {
    return NextResponse.json(
      { error: "Failed to execute investment" },
      { status: 500 }
    );
  }
}
