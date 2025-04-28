import { NextRequest, NextResponse } from "next/server";

interface BudgetAnalysis {
  month: number;
  year: number;
  spendingByCategory: {
    [key: string]: number;
  };
  recommendations: string[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const monthStr = searchParams.get("month");
    const yearStr = searchParams.get("year");

    if (!monthStr || !yearStr) {
      return NextResponse.json(
        { error: "Month and year are required parameters" },
        { status: 400 }
      );
    }

    const month = parseInt(monthStr);
    const year = parseInt(yearStr);

    if (isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Month must be a number between 1 and 12" },
        { status: 400 }
      );
    }

    if (isNaN(year) || year < 2020) {
      return NextResponse.json(
        { error: "Year must be 2020 or later" },
        { status: 400 }
      );
    }

    // Mock budget analysis - replace with actual calculation logic
    const budgetAnalysis: BudgetAnalysis = {
      month,
      year,
      spendingByCategory: {
        Food: 500.0,
        Transportation: 200.0,
        Entertainment: 150.0,
        Utilities: 300.0,
      },
      recommendations: [
        "Consider reducing entertainment spending",
        "Food expenses are within budget",
        "Transportation costs could be optimized",
      ],
    };

    return NextResponse.json(budgetAnalysis);
  } catch {
    return NextResponse.json(
      { error: "Failed to calculate budget insights" },
      { status: 500 }
    );
  }
}
