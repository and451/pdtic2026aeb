import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const okrsTable = pgTable("okrs", {
  id: serial("id").primaryKey(),
  objetivo: text("objetivo").notNull(),
  descricao: text("descricao"),
  trimestre: text("trimestre"),
  ano: integer("ano").notNull(),
  status: text("status").notNull().default("ativo"),
  progresso: integer("progresso").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const keyResultsTable = pgTable("key_results", {
  id: serial("id").primaryKey(),
  okrId: integer("okr_id").notNull().references(() => okrsTable.id, { onDelete: "cascade" }),
  descricao: text("descricao").notNull(),
  meta: text("meta").notNull(),
  unidade: text("unidade").notNull(),
  valor_atual: text("valor_atual").notNull().default("0"),
  status: text("status").notNull().default("nao_iniciado"),
});

export const insertOkrSchema = createInsertSchema(okrsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOkr = z.infer<typeof insertOkrSchema>;
export type Okr = typeof okrsTable.$inferSelect;

export const insertKeyResultSchema = createInsertSchema(keyResultsTable).omit({ id: true });
export type InsertKeyResult = z.infer<typeof insertKeyResultSchema>;
export type KeyResult = typeof keyResultsTable.$inferSelect;
