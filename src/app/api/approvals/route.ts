import { NextRequest, NextResponse } from "next/server";

interface ApprovalResponse {
  actionId: string;
  approved: boolean;
  approvalToken?: string;
  timestamp: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actionId, approved, notes } = body;

    if (!actionId || approved === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock approval response - replace with actual approval logic
    const response: ApprovalResponse = {
      actionId,
      approved,
      timestamp: new Date().toISOString(),
      notes: notes || undefined,
    };

    if (approved) {
      // Generate a mock approval token when action is approved
      response.approvalToken = Math.random().toString(36).substring(7);
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to process approval" },
      { status: 500 }
    );
  }
}
