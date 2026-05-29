import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  entidade: text("entidade").notNull(),
  entidadeId: integer("entidade_id").notNull(),
  acao: text("acao").notNull(),
  campo: text("campo"),
  valor_anterior: text("valor_anterior"),
  valor_novo: text("valor_novo"),
  usuarioId: integer("usuario_id"),
  usuarioNome: text("usuario_nome"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogsTable).omit({ id: true, createdAt: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogsTable.$inferSelect;
