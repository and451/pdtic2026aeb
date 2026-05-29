import * as React from "react";
import {
  BookOpen, ClipboardList, Target, Users, ShieldCheck, BarChart3,
  FileText, CheckCircle, AlertTriangle, Lock, ArrowRight,
  Lightbulb, TrendingUp, Wallet, ListChecks
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function StepCard({ number, title, actor, description }: { number: string; title: string; actor: string; description: string }) {
  return (
    <div className="relative pl-8 pb-8 border-l border-border last:pb-0 last:border-l-0">
      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
        {number}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{actor}</p>
        <h4 className="text-sm font-semibold text-foreground mt-0.5">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ContentCard({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
      <div className="p-2 rounded-md bg-primary/10 text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-foreground">{title}</span>
    </div>
  );
}

export default function Sobre() {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center space-y-4 py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto">
          <Target className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">PDTIC AEB</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Instrumento de diagnóstico, planejamento e gestão para alinhar a tecnologia às
          estratégias da Agência Espacial Brasileira.
        </p>
        <Badge variant="secondary" className="text-xs">Sistema de Gestão v1.0</Badge>
      </div>

      {/* O que é o PDTIC? */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">O que é o PDTIC?</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Definição e Propósito</p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            O <strong className="text-foreground">Plano Diretor de Tecnologia da Informação e Comunicação</strong> é um instrumento estratégico que
            orienta como os recursos de TI serão aplicados para atender às necessidades finalísticas da AEB
            durante um determinado período (biênio).
          </p>
          <p>
            Ele funciona como a <em>"ponte"</em> entre a estratégia organizacional e a execução tecnológica, garantindo
            que cada centavo investido em TI traga retorno direto para a missão da Agência.
          </p>
        </CardContent>
      </Card>

      {/* Manual da Plataforma */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Manual da Plataforma</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Como funciona o sistema de gestão</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esta plataforma desenvolvida pela Coordenação de Tecnologia da Informação (CTI) da AEB centraliza
            todo o ciclo de vida das demandas, eliminando o uso de planilhas e e-mails descentralizados.
            Abaixo, entenda as regras e perfis.
          </p>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Perfis de Acesso</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">User</span>
                </div>
                <p className="text-xs text-muted-foreground">Servidor da unidade. Cria rascunhos e visualiza demandas da área.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Focal Point</span>
                </div>
                <p className="text-xs text-muted-foreground">Responsável oficial indicado pela unidade. Cria e edita as demandas.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-green-600">Director</span>
                </div>
                <p className="text-xs text-muted-foreground">Chefe da unidade. Aprova (assina) ou devolve as demandas para correção.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600">CTI / Admin</span>
                </div>
                <p className="text-xs text-muted-foreground">Coordenação de TI. Realiza análise técnica, orçamentação e consolidação.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ciclo de Elaboração */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Ciclo de Elaboração</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Passo a passo do processo de negócio</p>
        </CardHeader>
        <CardContent>
          <StepCard
            number="01"
            title="Inventário de necessidades"
            actor="Área de TIC / Unidades"
            description="As unidades cadastram suas demandas no sistema dentro do prazo estipulado."
          />
          <StepCard
            number="02"
            title="Validação e Priorização"
            actor="Diretorias"
            description="Os diretores avaliam as demandas cadastradas, garantindo o alinhamento estratégico."
          />
          <StepCard
            number="03"
            title="Análise Técnica"
            actor="Área de TIC (CTI)"
            description="A CTI avalia a viabilidade, estima custos e consolida as demandas aprovadas."
          />
          <StepCard
            number="04"
            title="Aprovação Formal"
            actor="Comitê de Governança (CGB)"
            description="O PDTIC consolidado é submetido ao comitê para aprovação formal."
          />
          <StepCard
            number="05"
            title="Publicação"
            actor="Transparência"
            description="O PDTIC aprovado é publicado no portal institucional e no sistema."
          />
        </CardContent>
      </Card>

      {/* Conteúdo do Plano */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Conteúdo do Plano</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">O que compõe o documento final</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ContentCard icon={ClipboardList} title="Inventário de necessidades priorizado" />
            <ContentCard icon={Target} title="Plano de Metas e Ações" />
            <ContentCard icon={Users} title="Plano de Gestão de Pessoas" />
            <ContentCard icon={Wallet} title="Plano Orçamentário" />
            <ContentCard icon={AlertTriangle} title="Plano de Gestão de Riscos" />
            <ContentCard icon={ListChecks} title="Processo de acompanhamento formalizado" />
          </div>
        </CardContent>
      </Card>

      {/* Regras de Ouro e Fluxo de Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Regras de Ouro e Fluxo de Status</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Governança e controle do ciclo de vida das demandas</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Prazos:</strong> O sistema bloqueia automaticamente novas demandas após a data limite definida no ciclo vigente.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Edit2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Edição:</strong> Uma demanda só pode ser editada enquanto estiver no status <em>Rascunho</em> ou <em>Devolvida</em>. Após enviada, ela tranca.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Imutabilidade:</strong> Após a finalização pelo CTI, a demanda recebe um selo criptográfico e não pode mais ser alterada por ninguém.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <BarChart3 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Auditoria:</strong> Todas as alterações de campo e mudanças de status ficam gravadas no histórico.</span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 text-center">Fluxo de Tramitação</h4>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <Badge variant="outline" className="px-3 py-1">RASCUNHO</Badge>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <Badge variant="outline" className="px-3 py-1 text-blue-600 border-blue-200 bg-blue-50">ENVIADA</Badge>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <Badge variant="outline" className="px-3 py-1 text-green-600 border-green-200 bg-green-50">APROVADA DIR.</Badge>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <Badge variant="outline" className="px-3 py-1 text-purple-600 border-purple-200 bg-purple-50">EM REVISÃO CTI</Badge>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <Badge variant="outline" className="px-3 py-1 text-foreground border-foreground/20 bg-muted/50">FINALIZADA</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground pb-4">AEB • CTI</p>
    </div>
  );
}
