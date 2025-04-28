import { makeAssistantToolUI } from "@assistant-ui/react";

type TransferArgs = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
};

type TransferResult = {
  success: boolean;
  transactionId: string;
  message: string;
};

export const TransferMoneyUI = makeAssistantToolUI<
  TransferArgs,
  TransferResult
>({
  toolName: "transferMoney",
  render: ({ args, status, result, addResult }) => {
    const handleTransfer = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/transfer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        });

        if (!response.ok) {
          throw new Error("Transfer failed");
        }

        const result = await response.json();
        addResult(result);
      } catch (error) {
        console.error("Transfer error:", error);
      }
    };

    if (status.type === "running") {
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
            Transaction ID: {result.transactionId}
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
        <button
          onClick={handleTransfer}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Confirm Transfer
        </button>
      </div>
    );
  },
});
