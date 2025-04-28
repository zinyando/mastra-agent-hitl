import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

const getAccountBalances = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/accounts`);
  if (!response.ok) {
    throw new Error("Failed to fetch account balances");
  }
  return response.json() as Promise<Account[]>;
};

export const checkBalance = createTool({
  id: "Check Account Balances",
  description: "View current balances for all accounts",
  inputSchema: z.object({}), // No input required
  execute: async () => {
    try {
      const accounts = await getAccountBalances();

      // Format the response in a readable way
      const formattedBalances = accounts.map((account) => ({
        account: account.name,
        type: account.type,
        balance: `$${account.balance.toFixed(2)}`,
      }));

      return {
        balances: formattedBalances,
      };
    } catch {
      throw new Error("Unable to retrieve account balances");
    }
  },
});
