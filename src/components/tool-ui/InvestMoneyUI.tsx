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
  render: ({ args, status, result, addResult }) => {
    const handleInvest = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/invest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        });

        if (!response.ok) {
          throw new Error("Investment failed");
        }

        const result = await response.json();
        addResult(result);
      } catch (error) {
        console.error("Investment error:", error);
      }
    };

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
        <p className="text-sm text-gray-500">
          Preparing to invest ${args.amount} from account {args.accountId} in {args.instrumentId}
          {args.strategy === "recurring" && args.recurringFrequency && ` (${args.strategy} - ${args.recurringFrequency})`}
        </p>
        <button
          onClick={handleInvest}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Confirm Investment
        </button>
      </div>
    );
  },
});
