import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface BudgetAnalysis {
  month: number;
  year: number;
  spendingByCategory: {
    [key: string]: number;
  };
  recommendations: string[];
}

const getBudgetAnalysis = async (month: number, year: number) => {
  try {
    const params = new URLSearchParams({
      month: month.toString(),
      year: year.toString(),
    });

    const response = await fetch(`/api/budget/calculate?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to calculate budget");
    }

    return data as BudgetAnalysis;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Budget calculation failed: ${error.message}`);
    }
    throw new Error("Budget calculation failed: Unknown error");
  }
};

export const calculateBudget = createTool({
  id: "Calculate Budget",
  description: "Calculate budget insights based on spending patterns",
  inputSchema: z.object({
    month: z.number().min(1).max(12).describe("Month (1-12)"),
    year: z.number().min(2020).describe("Year (e.g., 2025)"),
  }),
  execute: async ({ context }) => {
    try {
      console.log(`Calculating budget for month: ${context.month}, year: ${context.year}`);
      const analysis = await getBudgetAnalysis(context.month, context.year);

      // Format the spending by category with dollar amounts
      const formattedSpending = Object.entries(analysis.spendingByCategory).map(
        ([category, amount]) => ({
          category,
          spent: `$${amount.toFixed(2)}`,
        })
      );

      return {
        month: context.month,
        year: context.year,
        spending: formattedSpending,
        recommendations: analysis.recommendations,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Budget calculation failed: ${message}`);
    }
  },
});
