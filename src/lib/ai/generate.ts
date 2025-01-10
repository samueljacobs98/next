import { generateText } from "ai";
import { azure } from "./azure";
import { generateRefinedQueryPrompt } from "./prompts";

export async function refineQuery(query: string) {
  const { text } = await generateText({
    model: azure("gpt-4o"),
    prompt: generateRefinedQueryPrompt(query),
  });

  return text;
}
