import { z } from "zod";

const schema = z.object({
  apiKey: z.string(),
  apiResource: z.string(),
});

const config = schema.parse({
  apiKey: process.env.OPENAI_API_KEY,
  apiResource: process.env.OPENAI_API_RESOURCE,
});

export default config;
