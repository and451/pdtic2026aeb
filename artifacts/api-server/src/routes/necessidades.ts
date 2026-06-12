import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, necessidadesTable, auditLogsTable } from "@workspace/db";
import {
  ListNecessidadesQueryParams,
  GetNecessidadeParams,
  UpdateNecessidadeParams,
  DeleteNecessidadeParams,
  CreateNecessidadeBody,
  UpdateNecessidadeBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const WORKFLOW_FINALIZADA = "finalizada";

async function logAudit(
  entidade: string,
  entidadeId: number,
  acao: string,
  campo: string | null,
  valorAnterior: string | null,
  valorNovo: string | null,
  usuario?: { id: number; nome: string }
): Promise<void> {
  await db.insert(auditLogsTable).values({
    entidade,
    entidadeId,
    acao,
    campo,
    valor_anterior: valorAnterior,
    valor_novo: valorNovo,
    usuarioId: usuario?.id ?? null,
    usuarioNome: usuario?.nome ?? null,
  });
}

router.get("/necessidades/stats", async (_req, res): Promise<void> => {
  const all = await db.select().from(necessidadesTable);

  const por_status: Record<string, number> = {};
  const por_moscow: Record<string, number> = {};
  const por_eixo: Record<string, number> = {};
  const por_workflow: Record<string, number> = {};
  let orcamento_total_planejado = 0;
  let orcamento_total_realizado = 0;

  for (const n of all) {
    por_status[n.status] = (por_status[n.status] ?? 0) + 1;
    por_moscow[n.classificacao_moscow] = (por_moscow[n.classificacao_moscow] ?? 0) + 1;
    por_eixo[n.eixo] = (por_eixo[n.eixo] ?? 0) + 1;
    por_workflow[n.workflow_status] = (por_workflow[n.workflow_status] ?? 0) + 1;
    if (n.orcamento_planejado) orcamento_total_planejado += parseFloat(n.orcamento_planejado);
    if (n.orcamento_realizado) orcamento_total_realizado += parseFloat(n.orcamento_realizado);
  }

  res.json({
    total: all.length,
    por_status,
    por_moscow,
    por_eixo,
    por_workflow,
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

router.post("/necessidades", async (req, res): Promise<void> => {
  const parsed = CreateNecessidadeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const insertData = {
    ...parsed.data,
    workflow_status: "rascunho" as const,
    orcamento_planejado: parsed.data.orcamento_planejado?.toString() ?? null,
    orcamento_realizado: parsed.data.orcamento_realizado?.toString() ?? null,
  };
  const [row] = await db.insert(necessidadesTable).values(insertData).returning();

  await logAudit("necessidade", row.id, "create", null, null, null, req.user);
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

router.get("/necessidades/:id/audit", async (req, res): Promise<void> => {
  const params = GetNecessidadeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const logs = await db.select()
    .from(auditLogsTable)
    .where(
      and(
        eq(auditLogsTable.entidade, "necessidade"),
        eq(auditLogsTable.entidadeId, params.data.id)
      )
    )
    .orderBy(desc(auditLogsTable.createdAt));

  res.json(logs);
});

router.patch("/necessidades/:id", async (req, res): Promise<void> => {
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

  const [existing] = await db.select().from(necessidadesTable).where(eq(necessidadesTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Necessidade não encontrada" });
    return;
  }

  if (existing.workflow_status === WORKFLOW_FINALIZADA) {
    res.status(403).json({ error: "Necessidade finalizada não pode ser alterada" });
    return;
  }

  const updateData = {
    ...parsed.data,
    orcamento_planejado: parsed.data.orcamento_planejado?.toString() ?? undefined,
    orcamento_realizado: parsed.data.orcamento_realizado?.toString() ?? undefined,
    updatedAt: new Date(),
  };
  const [row] = await db.update(necessidadesTable).set(updateData).where(eq(necessidadesTable.id, params.data.id)).returning();

  const user = req.user;
  const fieldsToAudit = ["titulo", "descricao", "eixo", "classificacao_moscow", "status", "workflow_status", "unidade_requisitante", "orcamento_planejado", "orcamento_realizado", "ano", "observacoes"] as const;
  for (const field of fieldsToAudit) {
    const key = field as keyof typeof parsed.data;
    if (key in parsed.data && parsed.data[key] !== undefined) {
      const oldVal = String((existing as Record<string, unknown>)[field] ?? "");
      const newVal = String(parsed.data[key] ?? "");
      if (oldVal !== newVal) {
        await logAudit("necessidade", row.id, "update", field, oldVal, newVal, user);
      }
    }
  }

  res.json(row);
});

router.delete("/necessidades/:id", async (req, res): Promise<void> => {
  const params = DeleteNecessidadeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db.select().from(necessidadesTable).where(eq(necessidadesTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Necessidade não encontrada" });
    return;
  }

  if (existing.workflow_status === WORKFLOW_FINALIZADA) {
    res.status(403).json({ error: "Necessidade finalizada não pode ser removida" });
    return;
  }

  const [row] = await db.delete(necessidadesTable).where(eq(necessidadesTable.id, params.data.id)).returning();
  await logAudit("necessidade", row.id, "delete", null, null, null, req.user);
  res.sendStatus(204);
});

export default router;
