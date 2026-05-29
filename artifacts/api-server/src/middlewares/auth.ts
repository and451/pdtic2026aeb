import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import { env } from "../lib/env";
import { logger } from "../lib/logger";

export interface AuthUser {
  id: number;
  email: string;
  nome: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!env.JWT_SECRET) {
    if (env.NODE_ENV === "development") {
      logger.warn("JWT_SECRET não configurado — permitindo requisição em modo desenvolvimento");
      next();
      return;
    }
    res.status(401).json({ error: "Autenticação não configurada" });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token de autenticação não fornecido" });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 60 });
    req.user = {
      id: Number(payload.sub ?? 0),
      email: String(payload.email ?? ""),
      nome: String(payload.nome ?? ""),
      role: String(payload.role ?? "user"),
    };
    next();
  } catch (err) {
    logger.warn({ err }, "Token JWT inválido");
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
