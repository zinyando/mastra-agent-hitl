import { NextRequest, NextResponse } from 'next/server';

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
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json(
        { error: 'Month and year are required parameters' },
        { status: 400 }
      );
    }

    // Mock budget analysis - replace with actual calculation logic
    const budgetAnalysis: BudgetAnalysis = {
      month: parseInt(month),
      year: parseInt(year),
      spendingByCategory: {
        'Food': 500.00,
        'Transportation': 200.00,
        'Entertainment': 150.00,
        'Utilities': 300.00
      },
      recommendations: [
        'Consider reducing entertainment spending',
        'Food expenses are within budget',
        'Transportation costs could be optimized'
      ]
    };

    return NextResponse.json(budgetAnalysis);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to calculate budget insights' },
      { status: 500 }
    );
  }
}
