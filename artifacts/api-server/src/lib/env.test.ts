import { describe, it, expect } from "vitest";
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

describe("env schema validation", () => {
  it("validates correct env", () => {
    const result = envSchema.safeParse({
      PORT: "8080",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/pdtic",
      JWT_SECRET: "secret",
      NODE_ENV: "production",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(8080);
      expect(result.data.NODE_ENV).toBe("production");
      expect(result.data.CORS_ORIGIN).toBeUndefined();
    }
  });

  it("rejects invalid PORT", () => {
    const result = envSchema.safeParse({
      PORT: "abc",
      DATABASE_URL: "postgresql://localhost/db",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing DATABASE_URL", () => {
    const result = envSchema.safeParse({
      PORT: "8080",
    });
    expect(result.success).toBe(false);
  });

  it("defaults NODE_ENV to development", () => {
    const result = envSchema.safeParse({
      PORT: "8080",
      DATABASE_URL: "postgresql://localhost/db",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NODE_ENV).toBe("development");
    }
  });
});
