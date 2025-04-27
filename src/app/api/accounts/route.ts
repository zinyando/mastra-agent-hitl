import { NextResponse } from "next/server";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

// Mock data - replace with actual database integration
const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Main Checking",
    type: "checking",
    balance: 5000.0,
  },
  {
    id: "2",
    name: "Savings",
    type: "savings",
    balance: 10000.0,
  },
];

export async function GET() {
  try {
    return NextResponse.json(mockAccounts);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}
