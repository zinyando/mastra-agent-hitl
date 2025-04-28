import { makeAssistantToolUI } from "@assistant-ui/react";
import { useState } from "react";

type PayBillArgs = {
  billId: string;
  accountId: string;
  amount: number;
  paymentDate?: string;
};

type BillPaymentPreview = {
  id: string;
};

type PayBillResult = {
  id: string;
  previewId: string;
  status: "completed";
  confirmationNumber: string;
  executedAt: string;
  message?: string;
};

type PayBillComponentProps = {
  args: PayBillArgs;
  status: { type: string };
  result?: PayBillResult;
  addResult: (result: PayBillResult) => void;
};

const PayBillComponent = ({
  args,
  status,
  result,
  addResult,
}: PayBillComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const previewResponse = await fetch(`${baseUrl}/api/bills/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });

      if (!previewResponse.ok) {
        const errorData = await previewResponse.json().catch(() => ({}));
        throw new Error(
          `Preview failed: ${errorData?.error || previewResponse.statusText}`
        );
      }

      const previewResult: BillPaymentPreview = await previewResponse.json();

      const executeResponse = await fetch(`${baseUrl}/api/bills/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billPaymentPreviewId: previewResult.id,
          approvalToken: "mockApprovalToken",
        }),
      });

      if (!executeResponse.ok) {
        const errorData = await executeResponse.json().catch(() => ({}));
        throw new Error(
          `Execution failed: ${errorData?.error || executeResponse.statusText}`
        );
      }

      const finalResult: PayBillResult = await executeResponse.json();
      if (!finalResult.message) {
        finalResult.message = `Bill payment for ${args.billId} of $${args.amount} completed successfully. Confirmation: ${finalResult.confirmationNumber}`;
      }
      addResult(finalResult);
    } catch (err: Error | unknown) {
      console.error("Bill payment process error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during bill payment."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (status.type === "running" || isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-sm text-gray-500">Processing bill payment...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Payment Complete</h3>
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
        Preparing to pay bill {args.billId} from account {args.accountId}
        {args.amount && <span> (${args.amount})</span>}
        {args.paymentDate && <span> scheduled for {args.paymentDate}</span>}
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        onClick={handleConfirm}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Confirm Payment"}
      </button>
    </div>
  );
};

export const PayBillUI = makeAssistantToolUI<PayBillArgs, PayBillResult>({
  toolName: "payBill",
  render: (props) => <PayBillComponent {...props} />,
});
