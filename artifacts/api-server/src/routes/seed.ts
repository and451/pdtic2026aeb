import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  db,
  necessidadesTable,
  okrsTable,
  keyResultsTable,
  kpisTable,
  usersTable,
  ciclosTable,
} from "@workspace/db";

const router: IRouter = Router();

router.post("/seed", async (_req, res): Promise<void> => {
  const results = { necessidades: 0, okrs: 0, key_results: 0, kpis: 0, users: 0, ciclos: 0 };

  try {
    // --- Necessidades ---
    const existingNecs = await db.select().from(necessidadesTable);
    if (existingNecs.length === 0) {
      const necessidades = [
        { titulo: "Servicos de Service Desk", descricao: "Suporte tecnico de TI centralizado para atendimento aos servidores da AEB. Contrato 150164/275897 (GlobalWeb).", eixo: "infraestrutura", classificacao_moscow: "must", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "1725256.01", orcamento_realizado: "1725256.01", ano: 2025, observacoes: "Contrato GlobalWeb vigencia renovada ate 2027" },
        { titulo: "Software Microsoft Office 365", descricao: "Licenciamento de suite de produtividade Microsoft 365 para os servidores. Contrato 19.", eixo: "sistemas", classificacao_moscow: "must", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "589921.68", orcamento_realizado: "589921.68", ano: 2025, observacoes: null },
        { titulo: "Evolucao de solucao de nuvem da AEB", descricao: "Migracao e evolucao da infraestrutura de nuvem. Contrato 28 (mesmo contrato da N.07).", eixo: "infraestrutura", classificacao_moscow: "must", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "4161589.00", orcamento_realizado: "4161589.00", ano: 2025, observacoes: "Contrato 28 — compartilhado com N.07" },
        { titulo: "Fornecimento de equipamentos de protecao de rede firewall", descricao: "Firewall de borda para protecao da rede corporativa. Contrato 130518/303177 (ARVVO).", eixo: "dados_inovacao_seguranca", classificacao_moscow: "must", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "85000.00", orcamento_realizado: "85000.00", ano: 2025, observacoes: "PDTIC Tab.16 — valor do Word era 170.000,00" },
        { titulo: "Solucao de Backup", descricao: "Solucao de backup corporativo com garantia Veritas. Contrato 53481/260583.", eixo: "dados_inovacao_seguranca", classificacao_moscow: "must", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "186768.00", orcamento_realizado: "186768.00", ano: 2025, observacoes: "Garantia Backup Veritas" },
        { titulo: "Suporte e Garantia de telefonia fixa e central telefonica", descricao: "Manutencao e suporte do sistema Avaya IP Office Server Edition. Contrato 297804.", eixo: "infraestrutura", classificacao_moscow: "should", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "241920.00", orcamento_realizado: "241920.00", ano: 2025, observacoes: "PDTIC Tab.14 — valor do Word era 604.800,00" },
        { titulo: "Projeto de Inteligencia e Analise de Dados", descricao: "Implementacao de plataforma de BI e analytics. Contrato 37.", eixo: "dados_inovacao_seguranca", classificacao_moscow: "must", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "4153700.00", orcamento_realizado: "4153700.00", ano: 2025, observacoes: null },
        { titulo: "Modernizacao das salas de reuniao e auditorio", descricao: "Modernizacao audiovisual — som, videoconferencia e projecao. Contratos 4 + 24 + 3.", eixo: "infraestrutura", classificacao_moscow: "should", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "80382.32", orcamento_realizado: "80382.32", ano: 2025, observacoes: "Soma: 14.823,50 + 22.319,82 + 43.239,00" },
        { titulo: "AutoDesk", descricao: "Licenciamento de software Autodesk (AutoCAD, Revit, etc.). Contrato 27.", eixo: "sistemas", classificacao_moscow: "should", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "432290.69", orcamento_realizado: "432290.69", ano: 2025, observacoes: null },
        { titulo: "Ferramentas Adobe", descricao: "Licenciamento Adobe Creative Cloud. Contrato 27.", eixo: "sistemas", classificacao_moscow: "should", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "516960.00", orcamento_realizado: "516960.00", ano: 2025, observacoes: null },
        { titulo: "Manutencao preventiva da sala segura", descricao: "Manutencao da sala-cofre/sala segura de TI. Contrato 124948/301241 (GLS Engenharia).", eixo: "dados_inovacao_seguranca", classificacao_moscow: "must", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "390112.75", orcamento_realizado: "390112.75", ano: 2025, observacoes: "PDTIC Tab.16 — valor do Word era 763.426,40" },
        { titulo: "Suporte e garantia dos servidores do DataCenter", descricao: "Manutencao preventiva e corretiva dos servidores. Contrato 16.", eixo: "infraestrutura", classificacao_moscow: "must", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "238710.90", orcamento_realizado: "238710.90", ano: 2025, observacoes: null },
        { titulo: "Certificados Digitais SERPRO", descricao: "Servico DaaS SERPRO para certificados digitais. Contrato 71121/282263.", eixo: "dados_inovacao_seguranca", classificacao_moscow: "must", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "382624.32", orcamento_realizado: "382624.32", ano: 2025, observacoes: "PDTIC Tab.16 — valor do Word era 296.801,56" },
        { titulo: "Singular", descricao: "Sistema Singular — gestao de processos. Contrato 6/2022.", eixo: "sistemas", classificacao_moscow: "should", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "574668.00", orcamento_realizado: "574668.00", ano: 2025, observacoes: null },
        { titulo: "Licenca do sistema Banco de Precos", descricao: "Licenca de uso do sistema Banco de Precos. Contrato 10.", eixo: "sistemas", classificacao_moscow: "could", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "43460.00", orcamento_realizado: "43460.00", ano: 2025, observacoes: null },
        { titulo: "Sistema de Gestao por Competencias", descricao: "Plataforma de gestao de competencias. Contrato 20.", eixo: "sistemas", classificacao_moscow: "could", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "43680.00", orcamento_realizado: "43680.00", ano: 2025, observacoes: null },
        { titulo: "Evolucao da Intranet/Extranet", descricao: "Modernizacao da plataforma de Intranet/Extranet. Contrato 293242.", eixo: "sistemas", classificacao_moscow: "should", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "39466.93", orcamento_realizado: "39466.93", ano: 2025, observacoes: "PDTIC Tab.15 — valor do Word era 41.586,10" },
        { titulo: "Monitor Curvo UHD 4K", descricao: "Aquisicao de monitores curvos UHD 4K. Contrato 23.", eixo: "infraestrutura", classificacao_moscow: "could", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "179900.00", orcamento_realizado: "179900.00", ano: 2025, observacoes: null },
        { titulo: "Power BI", descricao: "Licenciamento Microsoft Power BI. Contrato 12/2024.", eixo: "dados_inovacao_seguranca", classificacao_moscow: "should", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "28864.00", orcamento_realizado: "28864.00", ano: 2025, observacoes: "Ha um 2 contrato (19, R$ 27.762,00 / 50 licencas ate 2028)" },
        { titulo: "Desenvolvimento e manutencao de banco de dados", descricao: "Servico DaaS SERPRO para banco de dados. Contrato 71121/282263.", eixo: "dados_inovacao_seguranca", classificacao_moscow: "should", status: "em_andamento", workflow_status: "revisao_cti", orcamento_planejado: "382624.32", orcamento_realizado: null, ano: 2025, observacoes: "PDTIC Tab.16 — valor do Word era 296.801,56" },
        { titulo: "Notebook com placa de video", descricao: "Aquisicao de notebooks com placa de video dedicada. Contrato 23.", eixo: "infraestrutura", classificacao_moscow: "could", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "659900.00", orcamento_realizado: "659900.00", ano: 2025, observacoes: null },
        { titulo: "Solucao para Gestao de Riscos missao espacial", descricao: "Plataforma RSA Archer Suite para gestao de riscos. Contrato 0096237.", eixo: "dados_inovacao_seguranca", classificacao_moscow: "must", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "2425000.00", orcamento_realizado: "2425000.00", ano: 2025, observacoes: "Vigencia encerra em 29/07/2025 (sem prorrogacao)" },
        { titulo: "Software conversor de arquivos e editor de midias digitais", descricao: "StreamYard — conversao e edicao de midia. Contrato 302731.", eixo: "sistemas", classificacao_moscow: "could", status: "atendida", workflow_status: "finalizada", orcamento_planejado: "5250.00", orcamento_realizado: "5250.00", ano: 2025, observacoes: null },
      ];
      const inserted = await db.insert(necessidadesTable).values(necessidades).returning();
      results.necessidades = inserted.length;
    } else {
      results.necessidades = existingNecs.length;
    }

    // --- OKRs ---
    const existingOkrs = await db.select().from(okrsTable);
    if (existingOkrs.length === 0) {
      const okrs = [
        { objetivo: "Modernizar a infraestrutura do Data Center da AEB", descricao: "Garantir disponibilidade, seguranca e escalabilidade da infraestrutura de TI critica para as missoes espaciais.", trimestre: "Q4", ano: 2025, status: "ativo", progresso: 65 },
        { objetivo: "Assegurar transparencia e rastreabilidade na entrega de TI", descricao: "Implementar governanca e visibilidade em todos os processos de entrega de TI, do rascunho a finalizacao.", trimestre: "Q4", ano: 2025, status: "ativo", progresso: 40 },
        { objetivo: "Fortalecer parceria estrategica entre CTI e unidades de negocio", descricao: "Estabelecer canais formais de comunicacao e colaboracao entre a CTI e as areas finalisticas da AEB.", trimestre: "Q1", ano: 2026, status: "ativo", progresso: 25 },
      ];
      const insertedOkrs = await db.insert(okrsTable).values(okrs).returning();

      // --- Key Results ---
      const keyResults = [
        { okrId: insertedOkrs[0].id, descricao: "Uptime do Data Center acima de 99,5%", meta: "99.5", unidade: "%", valor_atual: "99.2", status: "em_andamento" },
        { okrId: insertedOkrs[0].id, descricao: "Migrar 100% dos servidores legados para nuvem", meta: "100", unidade: "%", valor_atual: "60", status: "em_andamento" },
        { okrId: insertedOkrs[0].id, descricao: "Implementar monitoramento automatizado em todos os servidores", meta: "100", unidade: "%", valor_atual: "80", status: "em_andamento" },
        { okrId: insertedOkrs[1].id, descricao: "100% das necessidades com rastreabilidade de workflow no sistema", meta: "100", unidade: "%", valor_atual: "85", status: "em_andamento" },
        { okrId: insertedOkrs[1].id, descricao: "Reduzir tempo medio de aprovacao de demandas para menos de 5 dias", meta: "5", unidade: "dias", valor_atual: "8", status: "em_andamento" },
        { okrId: insertedOkrs[1].id, descricao: "Implementar dashboard executivo com indicadores em tempo real", meta: "100", unidade: "%", valor_atual: "100", status: "concluido" },
        { okrId: insertedOkrs[2].id, descricao: "Realizar 4 reunioes trimestrais com todas as unidades", meta: "4", unidade: "reunioes", valor_atual: "1", status: "em_andamento" },
        { okrId: insertedOkrs[2].id, descricao: "NPS de satisfacao dos usuarios acima de 7", meta: "7", unidade: "pontos", valor_atual: "6.2", status: "em_andamento" },
        { okrId: insertedOkrs[2].id, descricao: "Criar 2 canais formais de comunicacao CTI-unidades", meta: "2", unidade: "canais", valor_atual: "1", status: "em_andamento" },
      ];
      const insertedKrs = await db.insert(keyResultsTable).values(keyResults).returning();
      results.okrs = insertedOkrs.length;
      results.key_results = insertedKrs.length;
    } else {
      results.okrs = existingOkrs.length;
      const existingKrs = await db.select().from(keyResultsTable);
      results.key_results = existingKrs.length;
    }

    // --- KPIs ---
    const existingKpis = await db.select().from(kpisTable);
    if (existingKpis.length === 0) {
      const kpis = [
        { nome: "Uptime do Data Center", descricao: "Disponibilidade dos servidores e servicos do Data Center", categoria: "infraestrutura", meta: "99.5%", valor_atual: "99.2%", unidade: "%", tendencia: "up", semaforo: "amarelo" },
        { nome: "Aplicacao de Patches de Seguranca", descricao: "Percentual de patches criticos aplicados dentro do prazo", categoria: "seguranca", meta: "95%", valor_atual: "88%", unidade: "%", tendencia: "up", semaforo: "amarelo" },
        { nome: "NPS dos Usuarios", descricao: "Net Promoter Score — satisfacao dos servidores com TI", categoria: "satisfacao", meta: "7", valor_atual: "6.2", unidade: "pontos", tendencia: "stable", semaforo: "amarelo" },
        { nome: "Execucao Orcamentaria", descricao: "Percentual do orcamento de TI executado no exercicio", categoria: "entrega", meta: "90%", valor_atual: "72%", unidade: "%", tendencia: "up", semaforo: "verde" },
        { nome: "Entregas no Prazo", descricao: "Percentual de entregas de TI concluidas dentro do cronograma", categoria: "entrega", meta: "85%", valor_atual: "78%", unidade: "%", tendencia: "up", semaforo: "amarelo" },
        { nome: "Disponibilidade de Rede", descricao: "Uptime da rede corporativa e links de internet", categoria: "infraestrutura", meta: "99.9%", valor_atual: "99.7%", unidade: "%", tendencia: "stable", semaforo: "verde" },
        { nome: "Tempo de Resposta do Service Desk", descricao: "Tempo medio de resolucao de chamados (SLA)", categoria: "satisfacao", meta: "4", valor_atual: "5.2", unidade: "horas", tendencia: "down", semaforo: "vermelho" },
        { nome: "Cobertura de Backup", descricao: "Percentual de sistemas criticos com backup operacional", categoria: "seguranca", meta: "100%", valor_atual: "95%", unidade: "%", tendencia: "up", semaforo: "amarelo" },
        { nome: "Taxa de Resolucao de Incidentes", descricao: "Percentual de incidentes resolvidos no primeiro contato", categoria: "entrega", meta: "70%", valor_atual: "62%", unidade: "%", tendencia: "stable", semaforo: "amarelo" },
      ];
      const inserted = await db.insert(kpisTable).values(kpis).returning();
      results.kpis = inserted.length;
    } else {
      results.kpis = existingKpis.length;
    }

    // --- User admin ---
    const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, "admin@aeb.gov.br"));
    if (existingUsers.length === 0) {
      const senha_hash = await bcrypt.hash("admin123", 10);
      await db.insert(usersTable).values({
        nome: "Administrador CTI",
        email: "admin@aeb.gov.br",
        senha_hash,
        role: "admin",
        unidade: "CTI",
      });
      results.users = 1;
    } else {
      results.users = existingUsers.length;
    }

    // --- Ciclo PDTIC ---
    const existingCiclos = await db.select().from(ciclosTable);
    if (existingCiclos.length === 0) {
      await db.insert(ciclosTable).values({
        numero_sei: "SEI 12345/2024",
        titulo: "PDTIC AEB 2024-2026",
        descricao: "Plano Diretor de Tecnologia da Informacao e Comunicacao da Agencia Espacial Brasileira — Bienio 2024-2026",
        data_inicio: new Date("2024-01-01T00:00:00Z"),
        data_conclusao: null,
        periodo_referencia: "2024-2026",
        status: "ativo",
        ativo: true,
      });
      results.ciclos = 1;
    } else {
      results.ciclos = existingCiclos.length;
    }

    res.json({ message: "Seed concluido com sucesso", ...results });
  } catch (err) {
    res.status(500).json({ error: "Erro ao executar seed", detail: String(err) });
  }
});

export default router;
