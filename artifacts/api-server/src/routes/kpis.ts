import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, kpisTable } from "@workspace/db";
import {
  UpdateKpiParams,
  DeleteKpiParams,
  CreateKpiBody,
  UpdateKpiBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/kpis", async (_req, res): Promise<void> => {
  const rows = await db.select().from(kpisTable).orderBy(kpisTable.id);
  res.json(rows);
});

router.post("/kpis", async (req, res): Promise<void> => {
  const parsed = CreateKpiBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(kpisTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/kpis/:id", async (req, res): Promise<void> => {
  const params = UpdateKpiParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateKpiBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.update(kpisTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(kpisTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "KPI não encontrado" });
    return;
  }
  res.json(row);
});

router.delete("/kpis/:id", async (req, res): Promise<void> => {
  const params = DeleteKpiParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.delete(kpisTable).where(eq(kpisTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "KPI não encontrado" });
    return;
  }
  res.sendStatus(204);
});

export default router;
