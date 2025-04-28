import { makeAssistantToolUI } from "@assistant-ui/react";

type PayBillArgs = {
  billId: string;
  accountId: string;
  amount: number;
  paymentDate?: string;
};

type PayBillResult = {
  success: boolean;
  transactionId: string;
  message: string;
  scheduledDate?: string;
};

export const PayBillUI = makeAssistantToolUI<PayBillArgs, PayBillResult>({
  toolName: "payBill",
  render: ({ args, status, result, addResult }) => {
    const handlePayBill = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/pay-bill`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        });

        if (!response.ok) {
          throw new Error("Bill payment failed");
        }

        const result = await response.json();
        addResult(result);
      } catch (error) {
        console.error("Bill payment error:", error);
      }
    };

    if (status.type === "running") {
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
          <p className="mt-2 text-sm text-gray-500">Transaction ID: {result.transactionId}</p>
          {result.scheduledDate && (
            <p className="mt-1 text-sm text-gray-500">Scheduled for: {result.scheduledDate}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">{result.message}</p>
        </div>
      );
    }

    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-sm text-gray-500">
          Preparing to pay bill {args.billId} from account {args.accountId}
          {args.amount && <span> (${args.amount})</span>}
        </p>
        <button
          onClick={handlePayBill}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Confirm Payment
        </button>
      </div>
    );

    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Pay Bill</h3>
        <p className="mt-2 text-sm text-gray-500">
          Paying {args?.amount} from account {args?.accountId} for bill {args?.billId}
          {args?.paymentDate && ` scheduled for ${args.paymentDate}`}
        </p>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            // TO DO: implement payment logic
          }}
        >
          Pay Bill
        </button>
      </div>
    );
  },
});
