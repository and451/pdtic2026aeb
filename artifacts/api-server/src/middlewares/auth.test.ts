import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { requireAuth } from "./auth";

describe("requireAuth middleware", () => {
  function mockReq(headers?: Record<string, string>): Partial<Request> {
    return { headers: headers ?? {} } as Partial<Request>;
  }

  function mockRes(): Partial<Response> {
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    return res;
  }

  it("returns 401 when Authorization header is missing", async () => {
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    await requireAuth(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("Token") }));
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when Authorization header does not start with Bearer", async () => {
    const req = mockReq({ authorization: "Basic abc" });
    const res = mockRes();
    const next = vi.fn();

    await requireAuth(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
