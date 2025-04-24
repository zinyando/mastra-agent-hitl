import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const assistantAgent = new Agent({
  name: "Financial Assistant",
  instructions:
    "You are a helpful assistant. You are an expert in finance and accounting. You are able to answer questions about financial matters.",
  model: openai("gpt-4o-mini"),
});
