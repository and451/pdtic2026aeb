import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, ciclosTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/ciclos", async (_req, res): Promise<void> => {
  const rows = await db.select().from(ciclosTable).orderBy(desc(ciclosTable.data_inicio));
  res.json(rows);
});

router.get("/ciclos/atual", async (_req, res): Promise<void> => {
  const rows = await db.select().from(ciclosTable).where(eq(ciclosTable.ativo, true)).limit(1);
  if (rows.length === 0) {
    res.status(404).json({ error: "Nenhum ciclo ativo encontrado" });
    return;
  }
  res.json(rows[0]);
});

router.post("/ciclos", async (req, res): Promise<void> => {
  const { numero_sei, titulo, descricao, data_inicio, data_conclusao, periodo_referencia, status, ativo } = req.body;
  const rows = await db.insert(ciclosTable).values({
    numero_sei, titulo, descricao,
    data_inicio: new Date(data_inicio),
    data_conclusao: data_conclusao ? new Date(data_conclusao) : null,
    periodo_referencia, status, ativo
  }).returning();
  res.status(201).json(rows[0]);
});

export default router;
