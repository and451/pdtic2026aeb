import { useRoute, useLocation } from "wouter";
import { useGetNecessidade, useUpdateNecessidade, getGetNecessidadeQueryKey, getListNecessidadesQueryKey, getGetNecessidadesStatsQueryKey, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, History } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MOSCOW_LABELS, MOSCOW_COLORS, STATUS_LABELS, STATUS_COLORS, WORKFLOW_LABELS, WORKFLOW_COLORS, EIXO_LABELS, formatCurrency } from "@/lib/moscow";

const EIXOS = ["infraestrutura", "sistemas", "dados_inovacao_seguranca", "governanca"];
const MOSCOW_OPTIONS = ["must", "should", "could", "wont"];
const STATUS_OPTIONS = ["atendida", "em_andamento", "nao_atendida", "cancelada", "pendente"];
const WORKFLOW_OPTIONS = ["rascunho", "enviada", "aprovada_dir", "revisao_cti", "finalizada", "devolvida"];

type FormData = {
  titulo: string;
  descricao: string;
  eixo: string;
  classificacao_moscow: string;
  status: string;
  workflow_status: string;
  orcamento_planejado: string;
  orcamento_realizado: string;
  ano: string;
  observacoes: string;
};

type Necessidade = NonNullable<ReturnType<typeof useGetNecessidade>["data"]>;

function NecessidadeForm({ n, id }: { n: Necessidade; id: number }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const updateMut = useUpdateNecessidade();

  const form = useForm<FormData>({
    defaultValues: {
      titulo: n.titulo,
      descricao: n.descricao ?? "",
      eixo: n.eixo,
      classificacao_moscow: n.classificacao_moscow,
      status: n.status,
      workflow_status: n.workflow_status,
      orcamento_planejado: n.orcamento_planejado != null ? String(n.orcamento_planejado) : "",
      orcamento_realizado: n.orcamento_realizado != null ? String(n.orcamento_realizado) : "",
      ano: n.ano != null ? String(n.ano) : "",
      observacoes: n.observacoes ?? "",
    },
  });

  const onSubmit = (data: FormData) => {
    updateMut.mutate({
      id,
      data: {
        titulo: data.titulo,
        descricao: data.descricao || undefined,
        eixo: data.eixo,
        classificacao_moscow: data.classificacao_moscow,
        status: data.status,
        workflow_status: data.workflow_status,
        orcamento_planejado: data.orcamento_planejado ? parseFloat(data.orcamento_planejado) : undefined,
        orcamento_realizado: data.orcamento_realizado ? parseFloat(data.orcamento_realizado) : undefined,
        ano: data.ano ? parseInt(data.ano) : undefined,
        observacoes: data.observacoes || undefined,
      },
    }, {
      onSuccess: () => {
        toast({ title: "Necessidade atualizada" });
        qc.invalidateQueries({ queryKey: getGetNecessidadeQueryKey(id) });
        qc.invalidateQueries({ queryKey: getListNecessidadesQueryKey() });
        qc.invalidateQueries({ queryKey: getGetNecessidadesStatsQueryKey() });
        qc.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card border border-border rounded-lg p-5 space-y-4">
      <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Editar Necessidade</h2>
      <div>
        <Label>Titulo *</Label>
        <Input data-testid="input-titulo-edit" {...form.register("titulo", { required: true })} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Eixo *</Label>
          <Controller
            name="eixo"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1" data-testid="select-eixo-edit"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EIXOS.map((e) => <SelectItem key={e} value={e}>{EIXO_LABELS[e]}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label>Classificacao MoSCoW *</Label>
          <Controller
            name="classificacao_moscow"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1" data-testid="select-moscow-edit"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOSCOW_OPTIONS.map((m) => <SelectItem key={m} value={m}>{MOSCOW_LABELS[m]}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Status *</Label>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1" data-testid="select-status-edit"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label>Workflow *</Label>
          <Controller
            name="workflow_status"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1" data-testid="select-workflow-edit"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WORKFLOW_OPTIONS.map((w) => <SelectItem key={w} value={w}>{WORKFLOW_LABELS[w]}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Orc. Planejado (R$)</Label>
          <Input data-testid="input-orc-planejado-edit" type="number" step="0.01" {...form.register("orcamento_planejado")} className="mt-1" />
        </div>
        <div>
          <Label>Valor Contratado (R$)</Label>
          <Input data-testid="input-orc-realizado-edit" type="number" step="0.01" {...form.register("orcamento_realizado")} className="mt-1" />
        </div>
      </div>
      <div>
        <Label>Descricao</Label>
        <Textarea data-testid="textarea-descricao-edit" {...form.register("descricao")} className="mt-1 resize-none" rows={3} />
      </div>
      <div>
        <Label>Observacoes</Label>
        <Textarea data-testid="textarea-observacoes-edit" {...form.register("observacoes")} className="mt-1 resize-none" rows={2} />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" data-testid="button-salvar-edicao" disabled={updateMut.isPending} className="gap-2">
          <Save className="w-4 h-4" />
          {updateMut.isPending ? "Salvando..." : "Salvar Alteracoes"}
        </Button>
      </div>
    </form>
  );
}

export default function NecessidadeDetail() {
  const [, params] = useRoute("/necessidades/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: n, isLoading } = useGetNecessidade(id, {
    query: { enabled: !!id, queryKey: getGetNecessidadeQueryKey(id) },
  });

  if (isLoading) return (
    <div className="p-6 space-y-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}
    </div>
  );
  if (!n) return <div className="p-6 text-muted-foreground">Necessidade nao encontrada.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          data-testid="button-voltar"
          onClick={() => setLocation("/necessidades")}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Detalhe da Necessidade</h1>
          <p className="text-xs text-muted-foreground">ID #{n.id}</p>
        </div>
        <div className="ml-auto flex gap-2 flex-wrap justify-end">
          <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${MOSCOW_COLORS[n.classificacao_moscow] ?? ""}`}>
            {MOSCOW_LABELS[n.classificacao_moscow] ?? n.classificacao_moscow}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${STATUS_COLORS[n.status] ?? ""}`}>
            {STATUS_LABELS[n.status] ?? n.status}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${WORKFLOW_COLORS[n.workflow_status] ?? ""}`}>
            {WORKFLOW_LABELS[n.workflow_status] ?? n.workflow_status}
          </span>
        </div>
      </div>

      {/* Budget summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Orc. Planejado</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {n.orcamento_planejado != null ? formatCurrency(n.orcamento_planejado) : <span className="text-muted-foreground">—</span>}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Valor Contratado</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {n.orcamento_realizado != null ? formatCurrency(n.orcamento_realizado) : <span className="text-muted-foreground">—</span>}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Execucao Orcamentaria</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {n.orcamento_planejado && n.orcamento_realizado
              ? `${Math.round((parseFloat(String(n.orcamento_realizado)) / parseFloat(String(n.orcamento_planejado))) * 100)}%`
              : "—"}
          </p>
        </div>
      </div>

      {/* key={n.id} ensures the form fully remounts when navigating between necessidades */}
      <NecessidadeForm key={n.id} n={n} id={id} />

      {/* Audit Log */}
      <AuditLogSection id={id} />
    </div>
  );
}

type AuditLog = {
  id: number;
  entidade: string;
  entidadeId: number;
  acao: string;
  campo: string | null;
  valor_anterior: string | null;
  valor_novo: string | null;
  usuarioNome: string | null;
  createdAt: string;
};

function AuditLogSection({ id }: { id: number }) {
  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ["necessidade", id, "audit"],
    queryFn: async () => {
      const res = await fetch(`/api/necessidades/${id}/audit`);
      if (!res.ok) throw new Error("Erro ao buscar audit log");
      return res.json();
    },
    enabled: !!id,
  });

  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-3">
      <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
        <History className="w-4 h-4 text-muted-foreground" />
        Historico de Alteracoes
      </h2>
      {isLoading ? (
        <div className="h-20 bg-muted animate-pulse rounded" />
      ) : logs.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhuma alteracao registrada.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="text-xs border-l-2 border-muted pl-3 py-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium text-foreground capitalize">{log.acao}</span>
                <span>&bull;</span>
                <span>{new Date(log.createdAt).toLocaleString("pt-BR")}</span>
                {log.usuarioNome && <span>&bull; {log.usuarioNome}</span>}
              </div>
              {log.campo && (
                <p className="text-muted-foreground mt-0.5">
                  <span className="font-medium">{log.campo}:</span>{" "}
                  <span className="line-through">{log.valor_anterior ?? "—"}</span>{" "}
                  &rarr; <span>{log.valor_novo ?? "—"}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
