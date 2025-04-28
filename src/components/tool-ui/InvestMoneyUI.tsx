import { makeAssistantToolUI } from "@assistant-ui/react";

type InvestArgs = {
  accountId: string;
  instrumentId: string;
  amount: number;
  strategy: "one-time" | "recurring";
  recurringFrequency?: "weekly" | "monthly" | "quarterly";
};

type InvestResult = {
  success: boolean;
  transactionId: string;
  message: string;
  investmentDetails: {
    instrumentName: string;
    shares: number;
    pricePerShare: number;
  };
};

export const InvestMoneyUI = makeAssistantToolUI<InvestArgs, InvestResult>({
  toolName: "invest_money",
  render: ({ args, status, result }) => {
    if (status.type === "running") {
      return (
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">Processing investment...</p>
        </div>
      );
    }

    if (result) {
      return (
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Investment Complete</h3>
          <p className="mt-2 text-sm text-gray-500">Transaction ID: {result.transactionId}</p>
          <div className="mt-2">
            <h4 className="text-md font-medium text-gray-800">Investment Details</h4>
            <p className="text-sm text-gray-500">Instrument: {result.investmentDetails.instrumentName}</p>
            <p className="text-sm text-gray-500">Shares: {result.investmentDetails.shares}</p>
            <p className="text-sm text-gray-500">Price per Share: ${result.investmentDetails.pricePerShare}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{result.message}</p>
        </div>
      );
    }

    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Invest Money</h3>
        <p className="mt-2 text-sm text-gray-500">
          Investing {args?.amount} from account {args?.accountId} in {args?.instrumentId}
          {args?.strategy === "recurring" && args?.recurringFrequency && ` (${args.strategy} - ${args.recurringFrequency})`}
        </p>
      </div>
    );
  },
});
