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

      ALTER TABLE necessidades ADD COLUMN IF NOT EXISTS unidade_requisitante TEXT;

      -- Recriar okrs/kpis/key_results com schema correto se colunas estiverem erradas
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='okrs' AND column_name='titulo') THEN
          DROP TABLE IF EXISTS key_results CASCADE;
          DROP TABLE IF EXISTS okrs CASCADE;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='kpis' AND column_name='titulo') THEN
          DROP TABLE IF EXISTS kpis CASCADE;
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS okrs (
        id SERIAL PRIMARY KEY,
        objetivo TEXT NOT NULL,
        descricao TEXT,
        trimestre TEXT,
        ano INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'ativo',
        progresso INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS kpis (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT,
        categoria TEXT NOT NULL,
        meta TEXT NOT NULL,
        valor_atual TEXT NOT NULL DEFAULT '0',
        unidade TEXT NOT NULL,
        tendencia TEXT NOT NULL DEFAULT 'stable',
        semaforo TEXT NOT NULL DEFAULT 'verde',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS key_results (
        id SERIAL PRIMARY KEY,
        okr_id INTEGER NOT NULL REFERENCES okrs(id) ON DELETE CASCADE,
        descricao TEXT NOT NULL,
        meta TEXT NOT NULL,
        unidade TEXT NOT NULL,
        valor_atual TEXT NOT NULL DEFAULT '0',
        status TEXT NOT NULL DEFAULT 'nao_iniciado'
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

      CREATE TABLE IF NOT EXISTS pdtic_ciclos (
        id SERIAL PRIMARY KEY,
        numero_sei TEXT NOT NULL,
        titulo TEXT NOT NULL,
        descricao TEXT,
        data_inicio TIMESTAMPTZ NOT NULL,
        data_conclusao TIMESTAMPTZ,
        periodo_referencia TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ativo',
        ativo BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
