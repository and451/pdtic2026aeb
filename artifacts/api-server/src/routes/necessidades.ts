import { Router, type IRouter } from "express";
import { sql, eq, and } from "drizzle-orm";
import { db, necessidadesTable } from "@workspace/db";
import {
  ListNecessidadesQueryParams,
  GetNecessidadeParams,
  UpdateNecessidadeParams,
  DeleteNecessidadeParams,
  CreateNecessidadeBody,
  UpdateNecessidadeBody,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/necessidades/stats", async (_req, res): Promise<void> => {
  const all = await db.select().from(necessidadesTable);

  const por_status: Record<string, number> = {};
  const por_moscow: Record<string, number> = {};
  const por_eixo: Record<string, number> = {};
  let orcamento_total_planejado = 0;
  let orcamento_total_realizado = 0;

  for (const n of all) {
    por_status[n.status] = (por_status[n.status] ?? 0) + 1;
    por_moscow[n.classificacao_moscow] = (por_moscow[n.classificacao_moscow] ?? 0) + 1;
    por_eixo[n.eixo] = (por_eixo[n.eixo] ?? 0) + 1;
    if (n.orcamento_planejado) orcamento_total_planejado += parseFloat(n.orcamento_planejado);
    if (n.orcamento_realizado) orcamento_total_realizado += parseFloat(n.orcamento_realizado);
  }

  res.json({
    total: all.length,
    por_status,
    por_moscow,
    por_eixo,
    orcamento_total_planejado,
    orcamento_total_realizado,
  });
});

router.get("/necessidades", async (req, res): Promise<void> => {
  const parsed = ListNecessidadesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const conditions = [];
  if (parsed.data.eixo) conditions.push(eq(necessidadesTable.eixo, parsed.data.eixo));
  if (parsed.data.classificacao_moscow) conditions.push(eq(necessidadesTable.classificacao_moscow, parsed.data.classificacao_moscow));
  if (parsed.data.status) conditions.push(eq(necessidadesTable.status, parsed.data.status));

  const rows = conditions.length > 0
    ? await db.select().from(necessidadesTable).where(and(...conditions)).orderBy(necessidadesTable.id)
    : await db.select().from(necessidadesTable).orderBy(necessidadesTable.id);

  res.json(rows);
});

router.post("/necessidades", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateNecessidadeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(necessidadesTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.get("/necessidades/:id", async (req, res): Promise<void> => {
  const params = GetNecessidadeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(necessidadesTable).where(eq(necessidadesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Necessidade não encontrada" });
    return;
  }
  res.json(row);
});

router.patch("/necessidades/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateNecessidadeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateNecessidadeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.update(necessidadesTable).set({
    ...parsed.data,
    updatedAt: new Date(),
  }).where(eq(necessidadesTable.id, params.data.id)).returning();

  if (!row) {
    res.status(404).json({ error: "Necessidade não encontrada" });
    return;
  }
  res.json(row);
});

router.delete("/necessidades/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteNecessidadeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.delete(necessidadesTable).where(eq(necessidadesTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Necessidade não encontrada" });
    return;
  }
  res.sendStatus(204);
});

export default router;
