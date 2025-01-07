import { z } from "zod";

const schema = z.object({
  secret: z.string().optional(),
});

const config = schema.parse({
  secret: process.env.SECRET,
});

export default config;
