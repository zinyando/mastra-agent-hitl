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

export const TransferMoneyUI = makeAssistantToolUI<TransferArgs, TransferResult>({
  toolName: "transfer_money",
  render: ({ args, status, result }) => {
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
          <h3 className="text-lg font-medium text-gray-900">Transfer Complete</h3>
          <p className="mt-2 text-sm text-gray-500">Transaction ID: {result.transactionId}</p>
          <p className="mt-1 text-sm text-gray-500">{result.message}</p>
        </div>
      );
    }

    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Transfer Money</h3>
        <p className="mt-2 text-sm text-gray-500">
          Transferring {args?.amount} from account {args?.fromAccountId} to {args?.toAccountId}
        </p>
      </div>
    );
  },
});
