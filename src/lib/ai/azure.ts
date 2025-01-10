import config from "../config";
import { createAzure } from "@ai-sdk/azure";

export const azure = createAzure({
  resourceName: config.openai.apiResource,
  apiKey: config.openai.apiKey,
});
