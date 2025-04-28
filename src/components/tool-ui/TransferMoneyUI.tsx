import { makeAssistantToolUI } from "@assistant-ui/react";
import { useState } from "react";

type TransferArgs = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
};

type TransferPreview = {
  id: string;
};

type TransferResult = {
  id: string;
  previewId: string;
  status: "completed";
  confirmationNumber: string;
  executedAt: string;
  message?: string;
};

export const TransferMoneyUI = makeAssistantToolUI<
  TransferArgs,
  TransferResult
>({
  toolName: "transferMoney",
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
          `${baseUrl}/api/transfers/preview`,
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

        const previewResult: TransferPreview = await previewResponse.json();

        const executeResponse = await fetch(
          `${baseUrl}/api/transfers/execute`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transferPreviewId: previewResult.id,
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

        const finalResult: TransferResult = await executeResponse.json();
        if (!finalResult.message) {
          finalResult.message = `Transfer of $${args.amount} completed successfully. Confirmation: ${finalResult.confirmationNumber}`;
        }
        addResult(finalResult);
      } catch (err: any) {
        console.error("Transfer process error:", err);
        setError(
          err.message || "An unexpected error occurred during the transfer."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (status.type === "running" || isLoading) {
      return (
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">Processing transfer...</p>
        </div>
      );
    }

    if (result) {
      return (
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            Transfer Complete
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
          Preparing to transfer ${args.amount} from account {args.fromAccountId}{" "}
          to {args.toAccountId}
        </p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Confirm Transfer"}
        </button>
      </div>
    );
  },
});
