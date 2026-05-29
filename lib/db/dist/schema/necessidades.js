import { pgTable, text, serial, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const necessidadesTable = pgTable("necessidades", {
    id: serial("id").primaryKey(),
    titulo: text("titulo").notNull(),
    descricao: text("descricao"),
    eixo: text("eixo").notNull(),
    classificacao_moscow: text("classificacao_moscow").notNull().default("pendente"),
    status: text("status").notNull().default("pendente"),
    workflow_status: text("workflow_status").notNull().default("rascunho"),
    orcamento_planejado: numeric("orcamento_planejado", { precision: 15, scale: 2 }),
    orcamento_realizado: numeric("orcamento_realizado", { precision: 15, scale: 2 }),
    ano: integer("ano"),
    observacoes: text("observacoes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export const insertNecessidadeSchema = createInsertSchema(necessidadesTable).omit({ id: true, createdAt: true, updatedAt: true });
