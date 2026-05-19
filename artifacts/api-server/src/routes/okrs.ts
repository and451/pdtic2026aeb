import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, okrsTable, keyResultsTable } from "@workspace/db";
import {
  GetOkrParams,
  UpdateOkrParams,
  DeleteOkrParams,
  CreateOkrBody,
  UpdateOkrBody,
  CreateKeyResultParams,
  CreateKeyResultBody,
  UpdateKeyResultParams,
  UpdateKeyResultBody,
  DeleteKeyResultParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

async function getOkrWithKeyResults(id: number) {
  const [okr] = await db.select().from(okrsTable).where(eq(okrsTable.id, id));
  if (!okr) return null;
  const keyResults = await db.select().from(keyResultsTable).where(eq(keyResultsTable.okrId, id));
  return { ...okr, keyResults };
}

router.get("/okrs", async (_req, res): Promise<void> => {
  const okrs = await db.select().from(okrsTable).orderBy(okrsTable.id);
  const result = await Promise.all(okrs.map(async (okr) => {
    const keyResults = await db.select().from(keyResultsTable).where(eq(keyResultsTable.okrId, okr.id));
    return { ...okr, keyResults };
  }));
  res.json(result);
});

router.post("/okrs", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateOkrBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(okrsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.get("/okrs/:id", async (req, res): Promise<void> => {
  const params = GetOkrParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const result = await getOkrWithKeyResults(params.data.id);
  if (!result) {
    res.status(404).json({ error: "OKR não encontrado" });
    return;
  }
  res.json(result);
});

router.patch("/okrs/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateOkrParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateOkrBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.update(okrsTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(okrsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "OKR não encontrado" });
    return;
  }
  res.json(row);
});

router.delete("/okrs/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteOkrParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.delete(okrsTable).where(eq(okrsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "OKR não encontrado" });
    return;
  }
  res.sendStatus(204);
});

router.post("/okrs/:id/key-results", requireAuth, async (req, res): Promise<void> => {
  const params = CreateKeyResultParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = CreateKeyResultBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [okr] = await db.select().from(okrsTable).where(eq(okrsTable.id, params.data.id));
  if (!okr) {
    res.status(404).json({ error: "OKR não encontrado" });
    return;
  }
  const [row] = await db.insert(keyResultsTable).values({ ...parsed.data, okrId: params.data.id }).returning();
  res.status(201).json(row);
});

router.patch("/key-results/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateKeyResultParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateKeyResultBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.update(keyResultsTable).set(parsed.data).where(eq(keyResultsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Key Result não encontrado" });
    return;
  }
  res.json(row);
});

router.delete("/key-results/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteKeyResultParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.delete(keyResultsTable).where(eq(keyResultsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Key Result não encontrado" });
    return;
  }
  res.sendStatus(204);
});

export default router;
