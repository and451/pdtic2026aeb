# PDTIC/AEB — Gestão MoSCoW, OKR e KPI

Sistema web de gestão do **Plano Diretor de Tecnologia da Informação e Comunicação (PDTIC 2024-2026)** da Agência Espacial Brasileira (AEB), desenvolvido pela equipe CTI/CGD-AEB.

Utiliza a metodologia **MoSCoW** para priorização das 61 necessidades de TIC mapeadas, com acompanhamento de OKRs, KPIs, execução orçamentária e fluxo de aprovação com governança.

---

## Funcionalidades

### Dashboard Executivo
- Painel com totais de necessidades por status (Atendida, Em andamento, Não atendida, Sem informação)
- Gráfico de distribuição MoSCoW (Must / Should / Could / Won't)
- Gráfico de distribuição por eixo estratégico
- Cards de orçamento planejado, valor contratado e execução orçamentária
- Resumo de OKRs e semáforo de KPIs

### Necessidades de TIC
- Tabela completa das 61 necessidades do PDTIC 2024-2026
- Filtros por eixo, classificação MoSCoW, status e workflow
- Campo de busca por título
- Cadastro de novas necessidades via formulário
- Página de detalhe com edição completa: título, eixo, MoSCoW, status, workflow, orçamento planejado, valor contratado, descrição, observações e número SEI
- **Edição inline** de MoSCoW, status e workflow diretamente na tabela
- **Histórico de alterações** (audit log) por necessidade

### Workflow de Aprovação
- 5 etapas do processo: Rascunho → Enviada → Aprovada Dir. → Revisão CTI → Finalizada
- Devolução para correções (status "Devolvida")
- **Regra de imutabilidade**: necessidades "Finalizadas" não podem ser editadas ou removidas
- Visualização do ciclo de processo em `/ciclo`

### OKRs
- 3 OKRs com 9 Key Results
- Barras de progresso por resultado-chave
- Edição inline de valores realizados e status

### KPIs
- 9 indicadores agrupados por categoria
- Semáforo visual (verde / amarelo / vermelho)
- Setas de tendência e edição inline de valores

### Autenticação e Governança
- Login com JWT (bcrypt + jose)
- Perfis de usuário com roles (`admin`, `user`, etc.)
- Sidebar exibe usuário logado com nome e role
- Logout integrado
- Rotas protegidas (redirecionamento automático para `/login`)

---

## Dados reais PDTIC/AEB 2024-2026

### Necessidades (61 itens)
Distribuídas em 4 eixos estratégicos:

| Eixo | Necessidades |
|------|-------------|
| Infraestrutura | N.01 – N.20 |
| Sistemas | N.21 – N.40 |
| Dados, Inovação e Segurança | N.41 – N.53 |
| Governança | N.54 – N.61 |

Cada necessidade registra:
- Classificação MoSCoW (`must` / `should` / `could` / `wont`)
- Status (`atendida` / `em_andamento` / `nao_atendida` / `sem_informacao`)
- **Workflow** (`rascunho` / `enviada` / `aprovada_dir` / `revisao_cti` / `finalizada` / `devolvida`)
- Orçamento planejado (R$) e valor efetivamente contratado (R$)
- Número SEI do processo administrativo (quando aplicável)
- Observações e referências cruzadas

Itens com contratos assinados incluem o valor real (ex.: Service Desk R$ 1.881.275,88; Nuvem/Backup R$ 4.161.589,00; M365 R$ 589.921,68; Firewall R$ 170.000,00).

### OKRs
| OKR | Foco |
|-----|------|
| OKR 1 | Modernização do Data Center |
| OKR 2 | Transparência na entrega de TIC |
| OKR 3 | Fortalecimento de parcerias estratégicas |

### KPIs
| Categoria | Indicadores |
|-----------|-------------|
| Infraestrutura | Uptime, Patching de segurança |
| Atendimento | NPS, Tempo médio de resolução |
| Projetos | Entrega no prazo, Satisfação dos usuários |
| Orçamento | Execução orçamentária |
| Governança | Conformidade, Capacitação |

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, shadcn/ui, React Query, Recharts, Wouter |
| Backend | Node.js 24, Express 5, TypeScript 5.9 |
| Banco de dados | PostgreSQL + Drizzle ORM |
| Validação | Zod v4, drizzle-zod |
| Codegen de API | Orval (OpenAPI → React Query hooks + Zod schemas) |
| Build | esbuild (bundle CJS) |
| Monorepo | pnpm workspaces |
| Auth | bcryptjs, jose (JWT) |

---

## Estrutura do projeto

```
.
├── artifacts/
│   ├── api-server/          # Servidor Express 5 (porta 8080, prefixo /api)
│   │   └── src/routes/      # Handlers REST: necessidades, okrs, kpis, auth
│   └── pdtic-moscow/        # Frontend React + Vite
│       └── src/
│           ├── pages/       # Dashboard, Necessidades, Detalhe, OKRs, KPIs, Sobre, Ciclo, Login
│           ├── components/  # Layout, sidebar, UI compartilhada
│           ├── hooks/       # useAuth, useToast
│           └── lib/         # Helpers MoSCoW, formatação
├── lib/
│   ├── api-spec/            # openapi.yaml — contrato central da API
│   ├── api-client-react/    # Hooks React Query (gerado — não editar)
│   ├── api-zod/             # Schemas Zod (gerado — não editar)
│   └── db/                  # Schema Drizzle ORM + seed de dados reais
└── scripts/                 # Utilitários de manutenção
```

---

## Como executar localmente

### Pré-requisitos
- Node.js 24+
- pnpm 9+
- PostgreSQL (ou `DATABASE_URL` apontando para uma instância)

### Instalação

```bash
pnpm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/pdtic
JWT_SECRET=sua_chave_secreta_jwt
```

### Banco de dados

```bash
# Aplicar schema e popular com dados reais do PDTIC/AEB
pnpm --filter @workspace/db run push
pnpm --filter @workspace/db run seed
```

### Executar

Em dois terminais separados:

```bash
# Terminal 1 — API (porta 8080)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend
pnpm --filter @workspace/pdtic-moscow run dev
```

Acesse: `http://localhost:<porta-do-frontend>`

---

## Deploy na Vercel

O projeto é configurado para deploy na **Vercel** como SPA estática com backend serverless.

### Configuração
- `vercel.json` na raiz define:
  - `installCommand`: `pnpm install --frozen-lockfile`
  - `buildCommand`: `sh vercel-build.sh`
- `vercel-build.sh` executa:
  1. Typecheck das libs (`pnpm -w run typecheck:libs`)
  2. Build do frontend (`pnpm --filter @workspace/pdtic-moscow run build`)
  3. Copia os assets para `.vercel/output/static/`
  4. Gera `config.json` com fallback SPA (`/*` → `index.html`)

### Variáveis de ambiente na Vercel
Configure no dashboard da Vercel:
- `DATABASE_URL` — URL do PostgreSQL
- `JWT_SECRET` — chave secreta para assinatura de tokens JWT

> **Nota**: o arquivo `vercel-build.sh` deve estar com permissão de execução no Git (`100755`). No Windows, execute:
> ```bash
> git update-index --chmod=+x vercel-build.sh
> git add vercel-build.sh
> git commit -m "fix: tornar vercel-build.sh executável"
> ```

---

## Workflow de desenvolvimento

### Após alterar o contrato de API (`openapi.yaml`)

```bash
pnpm --filter @workspace/api-spec run codegen
```

Isso regenera os hooks React Query e os schemas Zod automaticamente.

### Verificação de tipos

```bash
pnpm run typecheck
```

### Build completo

```bash
pnpm run build
```

---

## Decisões de arquitetura

- **API contract-first**: o `openapi.yaml` é a fonte de verdade. Qualquer mudança na API parte dele; os tipos propagam para o servidor e o cliente automaticamente via codegen.
- **Orçamentos como NUMERIC no PostgreSQL**: evita erros de ponto flutuante. O Drizzle retorna esses valores como `string` — sempre usar `parseFloat()` antes de operações matemáticas.
- **MoSCoW como enum string**: armazenado em lowercase (`must`, `should`, `could`, `wont`); os rótulos de exibição ficam em `moscow.ts` para manter o banco limpo.
- **Semáforo de KPI**: campo `semaforo` com valores `verde` / `amarelo` / `vermelho`, sem thresholds computados — simples e auditável.
- **Workflow status com regras de negócio no backend**: a regra de imutabilidade para status "finalizada" é aplicada nas rotas Express, garantindo consistência independente do frontend.
- **Audit log centralizado**: todas as alterações em necessidades são registradas automaticamente na tabela `audit_logs`, rastreando campo, valor anterior, valor novo e usuário.

---

## Equipe

**CTI/CGD-AEB** — Coordenação de Tecnologia da Informação  
Agência Espacial Brasileira  
PDTIC 2024-2026
