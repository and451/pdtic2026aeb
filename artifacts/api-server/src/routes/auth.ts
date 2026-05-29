import { Router, type IRouter } from "express";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { env } from "../lib/env";

const router: IRouter = Router();

const JWT_SECRET = env.JWT_SECRET ?? "dev-secret-change-in-prod";
const secret = new TextEncoder().encode(JWT_SECRET);

async function signToken(user: { id: number; email: string; nome: string; role: string }): Promise<string> {
  return new SignJWT({ email: user.email, nome: user.nome, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const { nome, email, senha, role, unidade } = req.body;
  if (!nome || !email || !senha) {
    res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    return;
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Email já cadastrado" });
    return;
  }

  const senha_hash = await bcrypt.hash(senha, 10);
  const [user] = await db.insert(usersTable).values({
    nome,
    email,
    senha_hash,
    role: role ?? "user",
    unidade: unidade ?? null,
  }).returning();

  const token = await signToken(user);
  res.status(201).json({ user: { id: user.id, nome: user.nome, email: user.email, role: user.role, unidade: user.unidade }, token });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    res.status(400).json({ error: "Email e senha são obrigatórios" });
    return;
  }

  const rows = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (rows.length === 0) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const user = rows[0];
  const valid = await bcrypt.compare(senha, user.senha_hash);
  if (!valid) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const token = await signToken(user);
  res.json({ user: { id: user.id, nome: user.nome, email: user.email, role: user.role, unidade: user.unidade }, token });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  try {
    const token = authHeader.slice(7);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 60 });
    const userId = Number(payload.sub ?? 0);
    const rows = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }
    const user = rows[0];
    res.json({ id: user.id, nome: user.nome, email: user.email, role: user.role, unidade: user.unidade });
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

export default router;
