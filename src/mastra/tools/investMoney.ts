import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const investMoney = createTool({
  id: "Invest Money",
  description:
    "Make an investment in a financial instrument (requires approval)",
  inputSchema: z.object({
    accountId: z.string().describe("Account ID to invest from"),
    instrumentId: z.string().describe("ID of the investment instrument"),
    amount: z.number().positive().describe("Amount to invest"),
    strategy: z
      .enum(["one-time", "recurring"])
      .default("one-time")
      .describe("Investment strategy"),
    recurringFrequency: z
      .enum(["weekly", "monthly", "quarterly"])
      .optional()
      .describe("Frequency for recurring investments"),
  }),
});
