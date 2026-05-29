import { Router, type IRouter } from "express";
import { db, necessidadesTable, okrsTable, kpisTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [necessidades, okrs, kpis] = await Promise.all([
    db.select().from(necessidadesTable),
    db.select().from(okrsTable),
    db.select().from(kpisTable),
  ]);

  const necessidades_por_status: Record<string, number> = {};
  const necessidades_por_moscow: Record<string, number> = {};
  let orcamento_planejado_total = 0;
  let orcamento_realizado_total = 0;

  for (const n of necessidades) {
    necessidades_por_status[n.status] = (necessidades_por_status[n.status] ?? 0) + 1;
    necessidades_por_moscow[n.classificacao_moscow] = (necessidades_por_moscow[n.classificacao_moscow] ?? 0) + 1;
    if (n.orcamento_planejado) orcamento_planejado_total += parseFloat(n.orcamento_planejado);
    if (n.orcamento_realizado) orcamento_realizado_total += parseFloat(n.orcamento_realizado);
  }

  const orcamento_execucao_pct = orcamento_planejado_total > 0
    ? Math.round((orcamento_realizado_total / orcamento_planejado_total) * 100 * 10) / 10
    : 0;

  const okrs_por_status: Record<string, number> = {};
  for (const o of okrs) {
    okrs_por_status[o.status] = (okrs_por_status[o.status] ?? 0) + 1;
  }

  const kpis_por_semaforo: Record<string, number> = {};
  for (const k of kpis) {
    kpis_por_semaforo[k.semaforo] = (kpis_por_semaforo[k.semaforo] ?? 0) + 1;
  }

  res.json({
    necessidades_total: necessidades.length,
    necessidades_por_status,
    necessidades_por_moscow,
    orcamento_planejado_total,
    orcamento_realizado_total,
    orcamento_execucao_pct,
    okrs_total: okrs.length,
    okrs_por_status,
    kpis_total: kpis.length,
    kpis_por_semaforo,
  });
});

export default router;
