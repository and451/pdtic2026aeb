import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const kpisTable = pgTable("kpis", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  categoria: text("categoria").notNull(),
  meta: text("meta").notNull(),
  valor_atual: text("valor_atual").notNull(),
  unidade: text("unidade").notNull(),
  tendencia: text("tendencia").notNull().default("stable"),
  semaforo: text("semaforo").notNull().default("verde"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertKpiSchema = createInsertSchema(kpisTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertKpi = z.infer<typeof insertKpiSchema>;
export type Kpi = typeof kpisTable.$inferSelect;
