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
  status: "completed" | "rejected";
  confirmationNumber?: string;
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

  const handleReject = () => {
    const finalResult: PayBillResult = {
      id: `rejected-${Date.now()}`,
      previewId: "",
      status: "rejected",
      executedAt: new Date().toISOString(),
      message: `Bill payment for ${args.billId} of $${args.amount} was cancelled.`
    };
    addResult(finalResult);
  };

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
      <div className="p-4 mb-6 mt-6 bg-white rounded-lg shadow">
        <p className="text-sm text-gray-500">Processing bill payment...</p>
      </div>
    );
  }

  if (result) {
    if (result.status === "rejected") {
      return (
        <div className="p-4 mb-6 mt-6 bg-white rounded-lg shadow border border-red-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Payment Cancelled</h3>
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
          <h3 className="text-lg font-medium text-gray-900">Payment Complete</h3>
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
        Preparing to pay bill {args.billId} from account {args.accountId}
        {args.amount && <span> (${args.amount})</span>}
        {args.paymentDate && <span> scheduled for {args.paymentDate}</span>}
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Confirm Payment
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

export const PayBillUI = makeAssistantToolUI<PayBillArgs, PayBillResult>({
  toolName: "payBill",
  render: (props) => <PayBillComponent {...props} />,
});
