import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ciclosTable = pgTable("pdtic_ciclos", {
  id: serial("id").primaryKey(),
  numero_sei: text("numero_sei").notNull(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  data_inicio: timestamp("data_inicio", { withTimezone: true }).notNull(),
  data_conclusao: timestamp("data_conclusao", { withTimezone: true }),
  periodo_referencia: text("periodo_referencia").notNull(),
  status: text("status").notNull().default("ativo"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCicloSchema = createInsertSchema(ciclosTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCiclo = z.infer<typeof insertCicloSchema>;
export type Ciclo = typeof ciclosTable.$inferSelect;
