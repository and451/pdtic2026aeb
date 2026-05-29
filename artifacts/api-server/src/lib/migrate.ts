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

      -- Garantir colunas corretas em okrs
      ALTER TABLE okrs ADD COLUMN IF NOT EXISTS objetivo TEXT;
      ALTER TABLE okrs ADD COLUMN IF NOT EXISTS progresso INTEGER DEFAULT 0;
      ALTER TABLE okrs ADD COLUMN IF NOT EXISTS trimestre TEXT;
      UPDATE okrs SET objetivo = COALESCE(objetivo, 'Objetivo não definido') WHERE objetivo IS NULL;

      -- Garantir colunas corretas em kpis
      ALTER TABLE kpis ADD COLUMN IF NOT EXISTS nome TEXT;
      ALTER TABLE kpis ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'geral';
      ALTER TABLE kpis ADD COLUMN IF NOT EXISTS valor_atual TEXT DEFAULT '0';
      ALTER TABLE kpis ADD COLUMN IF NOT EXISTS tendencia TEXT DEFAULT 'stable';
      ALTER TABLE kpis ADD COLUMN IF NOT EXISTS semaforo TEXT DEFAULT 'verde';
      ALTER TABLE kpis ADD COLUMN IF NOT EXISTS unidade TEXT DEFAULT '';
      ALTER TABLE kpis ADD COLUMN IF NOT EXISTS meta TEXT DEFAULT '0';
      UPDATE kpis SET nome = COALESCE(nome, 'KPI') WHERE nome IS NULL;
      UPDATE kpis SET categoria = COALESCE(categoria, 'geral') WHERE categoria IS NULL;
      UPDATE kpis SET meta = COALESCE(meta, '0') WHERE meta IS NULL;
      UPDATE kpis SET unidade = COALESCE(unidade, '') WHERE unidade IS NULL;

      -- Garantir colunas corretas em key_results
      ALTER TABLE key_results ADD COLUMN IF NOT EXISTS descricao TEXT;
      ALTER TABLE key_results ADD COLUMN IF NOT EXISTS valor_atual TEXT DEFAULT '0';
      ALTER TABLE key_results ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'nao_iniciado';
      ALTER TABLE key_results ADD COLUMN IF NOT EXISTS meta TEXT DEFAULT '0';
      ALTER TABLE key_results ADD COLUMN IF NOT EXISTS unidade TEXT DEFAULT '';
      UPDATE key_results SET descricao = COALESCE(descricao, 'Key Result') WHERE descricao IS NULL;
      UPDATE key_results SET meta = COALESCE(meta, '0') WHERE meta IS NULL;
      UPDATE key_results SET unidade = COALESCE(unidade, '') WHERE unidade IS NULL;

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
