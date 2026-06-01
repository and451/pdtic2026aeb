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

export default router;
