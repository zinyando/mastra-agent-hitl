import { NextRequest, NextResponse } from "next/server";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  accountId: string;
}

// Mock data - replace with actual database integration
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-04-26",
    amount: -50.0,
    description: "Grocery Store",
    category: "Food",
    accountId: "1",
  },
  {
    id: "2",
    date: "2025-04-25",
    amount: -30.0,
    description: "Gas Station",
    category: "Transportation",
    accountId: "1",
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get("accountId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = searchParams.get("limit");

    let filteredTransactions = [...mockTransactions];

    if (accountId) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.accountId === accountId
      );
    }

    if (startDate) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.date >= startDate
      );
    }

    if (endDate) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.date <= endDate
      );
    }

    if (limit) {
      filteredTransactions = filteredTransactions.slice(0, parseInt(limit));
    }

    return NextResponse.json(filteredTransactions);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
