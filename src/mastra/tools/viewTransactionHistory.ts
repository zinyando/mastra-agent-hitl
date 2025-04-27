import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  accountId: string;
}

const getTransactionHistory = async (params: URLSearchParams) => {
  const response = await fetch(`/api/transactions?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return response.json() as Promise<Transaction[]>;
};

export const viewTransactionHistory = createTool({
  id: "View Transaction History",
  description:
    "Get recent transactions with optional filtering by account and date range",
  inputSchema: z.object({
    accountId: z
      .string()
      .optional()
      .describe("Optional account ID to filter transactions"),
    startDate: z
      .string()
      .optional()
      .describe("Optional start date (YYYY-MM-DD)"),
    endDate: z.string().optional().describe("Optional end date (YYYY-MM-DD)"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit for number of transactions"),
  }),
  execute: async ({ context }) => {
    try {
      const params = new URLSearchParams();
      if (context.accountId) params.append("accountId", context.accountId);
      if (context.startDate) params.append("startDate", context.startDate);
      if (context.endDate) params.append("endDate", context.endDate);
      if (context.limit) params.append("limit", context.limit.toString());

      const transactions = await getTransactionHistory(params);

      // Format the transactions in a readable way
      const formattedTransactions = transactions.map((tx) => ({
        date: tx.date,
        description: tx.description,
        amount: `$${Math.abs(tx.amount).toFixed(2)}`,
        type: tx.amount < 0 ? "debit" : "credit",
        category: tx.category,
      }));

      return {
        transactions: formattedTransactions,
        count: formattedTransactions.length,
      };
    } catch {
      throw new Error("Unable to retrieve transaction history");
    }
  },
});
