import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const payBill = createTool({
  id: "Pay Bill",
  description: "Make a payment for an existing bill (requires approval)",
  inputSchema: z.object({
    billId: z.string().describe("ID of the bill to pay"),
    accountId: z.string().describe("Account ID to pay the bill from"),
    amount: z.number().positive().describe("Amount to pay"),
    paymentDate: z
      .string()
      .optional()
      .describe("Date to schedule payment (ISO format)"),
  }),
});
