-- =============================================================================
-- Atualização dos orçamentos das Necessidades de TIC
-- Fontes (em ordem de precedência):
--   1) PDTIC_AEB_2024_2025.pdf — Anexo I, Tabelas 14/15/16 (valores de contrato).
--      PREPONDERANTE sobre as demais fontes.
--   2) "Planilhas 25 02 2026.docx" — Tabela 1, coluna VALOR.
--   3) Imagem da tela atual.
-- Onde o PDTIC traz valor, ele prevalece; nos demais casos usa-se o Word.
-- Conflitos de mapeamento resolvidos: N.05/N.07 (backup) e N.22/N.43 (DaaS SERPRO).
--
-- Regra acordada:
--   * Necessidade ATENDIDA (contrato firmado)  -> Orc. Planejado (orcamento_planejado)
--                                                  E Valor Contratado (orcamento_realizado)
--                                                  recebem o VALOR do documento.
--   * Necessidade EM ANDAMENTO / não atendida   -> apenas Orc. Planejado recebe o VALOR;
--                                                  Valor Contratado fica vazio (NULL).
--   * Necessidade sem VALOR numérico no documento (em branco ou "R$ -")
--                                                  -> NÃO é alterada (mantém o que já existe).
--
-- Como executar (PowerShell / bash, com DATABASE_URL apontando para o Postgres):
--   psql "$DATABASE_URL" -f scripts/atualizar-orcamentos.sql
--
-- O script roda dentro de uma transação. Revise o SELECT final antes do COMMIT
-- se quiser conferir; para abortar tudo, troque COMMIT por ROLLBACK.
-- O casamento é feito por trecho distintivo do título (ILIKE), portanto é
-- idempotente: rodar mais de uma vez produz o mesmo resultado.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- ATENDIDAS  ->  Orc. Planejado = Valor Contratado = VALOR
-- ---------------------------------------------------------------------------

-- N.01 Serviços de Service Desk — PDTIC Tab.16 (GlobalWeb, contrato 150164/275897)
--      [PDTIC preponderante; valor do Word era 1.881.275,88 (vigência renovada até 2027)]
UPDATE necessidades SET orcamento_planejado = 1725256.01, orcamento_realizado = 1725256.01
  WHERE titulo ILIKE '%Service Desk%';

-- N.04 Software Microsoft Office 365 — Contrato 19
UPDATE necessidades SET orcamento_planejado = 589921.68, orcamento_realizado = 589921.68
  WHERE titulo ILIKE '%Office 365%';

-- N.05 Evolução de solução de nuvem da AEB — Contrato 28 (mesmo contrato da N.07)
UPDATE necessidades SET orcamento_planejado = 4161589.00, orcamento_realizado = 4161589.00
  WHERE titulo ILIKE '%solução de nuvem%';

-- N.06 Fornecimento de equipamentos de proteção de rede firewall
--      PDTIC Tab.16 (ARVVO, contrato 130518/303177)
--      [PDTIC preponderante; valor do Word era 170.000,00]
UPDATE necessidades SET orcamento_planejado = 85000.00, orcamento_realizado = 85000.00
  WHERE titulo ILIKE '%proteção de rede firewall%';

-- N.07 Solução de Backup — PDTIC Tab.16 (Garantia Backup Veritas, contrato 53481/260583)
--      [decisão: PDTIC preponderante no backup; valor do Word (Contrato 28, 4.161.589,00)
--       foi mantido apenas na N.05]
UPDATE necessidades SET orcamento_planejado = 186768.00, orcamento_realizado = 186768.00
  WHERE titulo ILIKE '%Solução de Backup%';

-- N.08 Suporte e Garantia de telefonia fixa e central telefônica
--      PDTIC Tab.14 (Avaya IP Office Server Edition, contrato 297804)
--      [PDTIC preponderante; valor do Word era 604.800,00]
UPDATE necessidades SET orcamento_planejado = 241920.00, orcamento_realizado = 241920.00
  WHERE titulo ILIKE '%telefonia fixa%';

-- N.10 Projeto de Inteligência e Análise de Dados — Contrato 37
UPDATE necessidades SET orcamento_planejado = 4153700.00, orcamento_realizado = 4153700.00
  WHERE titulo ILIKE '%Inteligência e Análise de Dados%';

-- N.11 Modernização das salas de reunião e auditório — Contratos 4 + 24 + 3
--       Valor = soma dos três contratos (14.823,50 + 22.319,82 + 43.239,00)
UPDATE necessidades SET orcamento_planejado = 80382.32, orcamento_realizado = 80382.32
  WHERE titulo ILIKE '%salas de reunião%';

-- N.13 AutoDesk — Contrato 27
UPDATE necessidades SET orcamento_planejado = 432290.69, orcamento_realizado = 432290.69
  WHERE titulo ILIKE '%autodesk%';

-- N.14 Ferramentas Adobe — Contrato 27
UPDATE necessidades SET orcamento_planejado = 516960.00, orcamento_realizado = 516960.00
  WHERE titulo ILIKE '%Ferramentas Adobe%';

-- N.17 Manutenção preventiva da sala segura
--      PDTIC Tab.16 (GLS Engenharia, contrato 124948/301241)
--      [PDTIC preponderante; valor do Word era 763.426,40 (TA2+TA3)]
UPDATE necessidades SET orcamento_planejado = 390112.75, orcamento_realizado = 390112.75
  WHERE titulo ILIKE '%sala segura%';

-- N.18 Suporte e garantia dos servidores do DataCenter — Contrato 16
UPDATE necessidades SET orcamento_planejado = 238710.90, orcamento_realizado = 238710.90
  WHERE titulo ILIKE '%servidores do DataCenter%';

-- N.22 Certificados Digitais SERPRO — PDTIC Tab.16 (Serviço DaaS SERPRO, contrato 71121/282263)
--      [decisão: PDTIC preponderante; valor do Word era 296.801,56 (Contrato 13/2025)]
UPDATE necessidades SET orcamento_planejado = 382624.32, orcamento_realizado = 382624.32
  WHERE titulo ILIKE '%Certificados Digitais%';

-- N.26 Singular — Contrato nº 6/2022
UPDATE necessidades SET orcamento_planejado = 574668.00, orcamento_realizado = 574668.00
  WHERE titulo ILIKE 'Singular';

-- N.28 Licença do sistema Banco de Preços — Contrato 10
UPDATE necessidades SET orcamento_planejado = 43460.00, orcamento_realizado = 43460.00
  WHERE titulo ILIKE '%Banco de Preços%';

-- N.29 Sistema de Gestão por Competências — Contrato 20
UPDATE necessidades SET orcamento_planejado = 43680.00, orcamento_realizado = 43680.00
  WHERE titulo ILIKE '%Gestão por Competências%';

-- N.31 Evolução da Intranet/Extranet — PDTIC Tab.15 (Solução para Intranet, contrato 293242)
--      [PDTIC preponderante; valor do Word era 41.586,10]
UPDATE necessidades SET orcamento_planejado = 39466.93, orcamento_realizado = 39466.93
  WHERE titulo ILIKE '%Intranet%';

-- N.36 Monitor Curvo UHD 4K — Contrato 23
UPDATE necessidades SET orcamento_planejado = 179900.00, orcamento_realizado = 179900.00
  WHERE titulo ILIKE '%Monitor Curvo%';

-- N.40 Power BI — Contrato 12/2024 (28.864,00). Obs.: há um 2º contrato (Contrato 19,
--       R$ 27.762,00 / 50 licenças até 2028) no documento; ajuste manualmente se quiser somar.
UPDATE necessidades SET orcamento_planejado = 28864.00, orcamento_realizado = 28864.00
  WHERE titulo ILIKE '%Power BI%';

-- N.45 Notebook com placa de vídeo — Contrato 23
UPDATE necessidades SET orcamento_planejado = 659900.00, orcamento_realizado = 659900.00
  WHERE titulo ILIKE '%Notebook com placa%';

-- N.52 Software conversor de arquivos e editor de mídias digitais
--      PDTIC Tab.15 (StreamYard, contrato 302731) — mesmo valor do Word
UPDATE necessidades SET orcamento_planejado = 5250.00, orcamento_realizado = 5250.00
  WHERE titulo ILIKE '%conversor de arquivos%';

-- N.51 Solução para Gestão de Riscos missão espacial — PDTIC Tab.15 (RSA Archer Suite,
--      contrato 0096237). Sem valor no Word; status ATENDIDO (obs. Word: "ARCHER").
--      Obs.: vigência do contrato Archer encerra em 29/07/2025 (sem prorrogação).
UPDATE necessidades SET orcamento_planejado = 2425000.00, orcamento_realizado = 2425000.00
  WHERE titulo ILIKE '%Gestão de Riscos%';

-- ---------------------------------------------------------------------------
-- EM ANDAMENTO  ->  apenas Orc. Planejado; Valor Contratado fica vazio
-- ---------------------------------------------------------------------------

-- N.43 Desenvolvimento e manutenção de banco de dados (em andamento)
--      PDTIC Tab.16 (Serviço DaaS SERPRO, contrato 71121/282263)
--      [decisão: PDTIC preponderante; valor do Word era 296.801,56]
UPDATE necessidades SET orcamento_planejado = 382624.32, orcamento_realizado = NULL
  WHERE titulo ILIKE '%manutenção de banco de dados%';

-- ---------------------------------------------------------------------------
-- Itens SEM valor em nenhuma das fontes -> NÃO são tocados:
--   N.02, N.03, N.09, N.12, N.15, N.16, N.19 (VALOR="SINGULAR"), N.20, N.21,
--   N.23, N.24, N.25, N.27, N.30, N.32, N.33, N.34, N.35, N.37, N.38, N.39,
--   N.41, N.44, N.46, N.47, N.48, N.49, N.50, N.53, N.54, N.55, N.56, N.57,
--   N.58, N.59, N.60, N.61
-- ---------------------------------------------------------------------------

-- Conferência: revise os valores antes de confirmar.
SELECT id, titulo, orcamento_planejado, orcamento_realizado, status
  FROM necessidades
  ORDER BY id;

COMMIT;
-- Para descartar tudo, comente o COMMIT acima e use:  ROLLBACK;
