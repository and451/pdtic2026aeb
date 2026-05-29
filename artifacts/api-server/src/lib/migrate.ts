import { pool } from "@workspace/db";
import { logger } from "./logger";

export async function ensureTables(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS necessidades (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT,
        eixo TEXT NOT NULL,
        classificacao_moscow TEXT NOT NULL DEFAULT 'pendente',
        status TEXT NOT NULL DEFAULT 'pendente',
        workflow_status TEXT NOT NULL DEFAULT 'rascunho',
        orcamento_planejado NUMERIC(15,2),
        orcamento_realizado NUMERIC(15,2),
        ano INTEGER,
        observacoes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS okrs (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT,
        ano INTEGER,
        status TEXT NOT NULL DEFAULT 'ativo',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS kpis (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT,
        meta NUMERIC(15,2),
        realizado NUMERIC(15,2),
        unidade TEXT,
        ano INTEGER,
        status TEXT NOT NULL DEFAULT 'ativo',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS key_results (
        id SERIAL PRIMARY KEY,
        okr_id INTEGER NOT NULL REFERENCES okrs(id) ON DELETE CASCADE,
        titulo TEXT NOT NULL,
        meta NUMERIC(15,2),
        realizado NUMERIC(15,2),
        unidade TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        unidade TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        entidade TEXT NOT NULL,
        entidade_id INTEGER NOT NULL,
        acao TEXT NOT NULL,
        campo TEXT,
        valor_anterior TEXT,
        valor_novo TEXT,
        usuario_id INTEGER,
        usuario_nome TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    logger.info("Tabelas verificadas/criadas com sucesso");
  } catch (err) {
    logger.error({ err }, "Erro ao criar tabelas");
    throw err;
  } finally {
    client.release();
  }
}
