import { describe, it, expect } from "vitest";
import rateLimit from "express-rate-limit";
import { apiRateLimiter } from "./rate-limit";

describe("apiRateLimiter", () => {
  it("is an express middleware function", () => {
    expect(typeof apiRateLimiter).toBe("function");
  });
});
