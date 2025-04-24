import { assistantAgent } from "@/mastra/agents/assistant";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await assistantAgent.stream(messages);

  return result.toDataStreamResponse();
}
