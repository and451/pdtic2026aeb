import { z } from "zod/v4";

const envSchema = z.object({
  PORT: z.string().transform((val) => {
    const num = Number(val);
    if (Number.isNaN(num) || num <= 0) {
      throw new Error(`PORT inválido: "${val}"`);
    }
    return num;
  }),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET é obrigatória").optional(),
  CORS_ORIGIN: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);
