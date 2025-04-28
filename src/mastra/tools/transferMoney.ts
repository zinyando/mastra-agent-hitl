import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const transferMoney = createTool({
  id: "Transfer Money",
  description:
    "Create a money transfer between two accounts (requires approval)",
  inputSchema: z.object({
    fromAccountId: z.string().describe("Source account ID"),
    toAccountId: z.string().describe("Destination account ID"),
    amount: z.number().positive().describe("Amount to transfer"),
    description: z.string().optional().describe("Description for the transfer"),
  }),
});
