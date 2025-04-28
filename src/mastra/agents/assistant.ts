import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import {
  checkBalance,
  viewTransactionHistory,
  calculateBudget,
  payBill,
  transferMoney,
  investMoney,
} from "../tools";

export const assistantAgent = new Agent({
  name: "Financial Assistant",
  instructions: `
    You are a helpful financial assistant that provides information about accounts, transactions, and budgets.
    
    You can:
    - Check account balances using the checkBalance tool
    - View transaction history using the viewTransactionHistory tool
    - Calculate budget insights using the calculateBudget tool
    - Pay bill using the payBill tool
    - Transfer money using the transferMoney tool
    - Invest money using the investMoney tool
    
    Always use the appropriate tool when asked about financial information.
    Format currency values with proper dollar signs and decimal places.
  `,
  model: openai("gpt-4o-mini"),
  tools: {
    checkBalance,
    viewTransactionHistory,
    calculateBudget,
    payBill,
    transferMoney,
    investMoney,
  },
});
