import { makeAssistantToolUI } from "@assistant-ui/react";
import { useState } from "react";

type InvestArgs = {
  accountId: string;
  instrumentId: string;
  amount: number;
  strategy: "one-time" | "recurring";
  recurringFrequency?: "weekly" | "monthly" | "quarterly";
};

type InvestmentPreview = {
  id: string;
};

type InvestResult = {
  id: string;
  previewId: string;
  status: "completed";
  confirmationNumber: string;
  executedAt: string;
  message?: string;
};

export const InvestMoneyUI = makeAssistantToolUI<InvestArgs, InvestResult>({
  toolName: "investMoney",
  render: ({ args, status, result, addResult }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
      setIsLoading(true);
      setError(null);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      try {
        const previewResponse = await fetch(
          `${baseUrl}/api/investments/preview`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          }
        );

        if (!previewResponse.ok) {
          const errorData = await previewResponse.json().catch(() => ({}));
          throw new Error(
            `Preview failed: ${errorData?.error || previewResponse.statusText}`
          );
        }

        const previewResult: InvestmentPreview = await previewResponse.json();

        const executeResponse = await fetch(
          `${baseUrl}/api/investments/execute`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              investmentPreviewId: previewResult.id,
              approvalToken: "mockApprovalToken",
            }),
          }
        );

        if (!executeResponse.ok) {
          const errorData = await executeResponse.json().catch(() => ({}));
          throw new Error(
            `Execution failed: ${errorData?.error || executeResponse.statusText}`
          );
        }

        const finalResult: InvestResult = await executeResponse.json();
        if (!finalResult.message) {
          finalResult.message = `Investment of $${args.amount} in ${args.instrumentId} completed successfully. Confirmation: ${finalResult.confirmationNumber}`;
        }
        addResult(finalResult);
      } catch (err: any) {
        console.error("Investment process error:", err);
        setError(
          err.message || "An unexpected error occurred during the investment."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (status.type === "running" || isLoading) {
      return (
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">Processing investment...</p>
        </div>
      );
    }

    if (result) {
      return (
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            Investment Complete
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Confirmation: {result.confirmationNumber}
          </p>
          <p className="mt-1 text-sm text-gray-500">{result.message}</p>
        </div>
      );
    }

    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-sm text-gray-500">
          Preparing to invest ${args.amount} from account {args.accountId} in{" "}
          {args.instrumentId}
          {args.strategy === "recurring" &&
            args.recurringFrequency &&
            ` (${args.strategy} - ${args.recurringFrequency})`}
        </p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Confirm Investment"}
        </button>
      </div>
    );
  },
});
