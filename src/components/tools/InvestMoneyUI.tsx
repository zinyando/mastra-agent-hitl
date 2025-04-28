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
  status: "completed" | "rejected";
  confirmationNumber?: string;
  executedAt: string;
  message?: string;
};

type InvestMoneyComponentProps = {
  args: InvestArgs;
  status: { type: string };
  result?: InvestResult;
  addResult: (result: InvestResult) => void;
};

const InvestMoneyComponent = ({
  args,
  status,
  result,
  addResult,
}: InvestMoneyComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReject = () => {
    const finalResult: InvestResult = {
      id: `rejected-${Date.now()}`,
      previewId: "",
      status: "rejected",
      executedAt: new Date().toISOString(),
      message: `Investment of $${args.amount} in ${args.instrumentId} was cancelled.`
    };
    addResult(finalResult);
  };

    const handleConfirm = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const previewResponse = await fetch("/api/investments/preview",
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

        const executeResponse = await fetch("/api/investments/execute",
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
      } catch (err: Error | unknown) {
        console.error("Investment process error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during the investment."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (status.type === "running" || isLoading) {
      return (
        <div className="p-4 mb-6 mt-6 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">Processing investment...</p>
        </div>
      );
    }

    if (result) {
      if (result.status === "rejected") {
        return (
        <div className="p-4 mb-6 mt-6 mx-4 bg-white rounded-lg shadow border border-red-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Investment Cancelled</h3>
            </div>
            <p className="mt-2 text-sm text-gray-500">{result.message}</p>
          </div>
        );
      }

      return (
        <div className="p-4 mb-6 mt-6 bg-white rounded-lg shadow border border-green-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Investment Complete</h3>
          </div>
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
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Confirm Investment
          </button>
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    );
};

export const InvestMoneyUI = makeAssistantToolUI<InvestArgs, InvestResult>({
  toolName: "investMoney",
  render: (props) => <InvestMoneyComponent {...props} />,
});
