import { useState } from "react";
import {
  useListKpis, useCreateKpi, useUpdateKpi, useDeleteKpi,
  getListKpisQueryKey, getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, TrendingUp, TrendingDown, Minus, Trash2, Edit2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SEMAFORO_COLORS, SEMAFORO_LABELS } from "@/lib/moscow";

const CATEGORIA_LABELS: Record<string, string> = {
  infraestrutura: "Infraestrutura",
  seguranca: "Seguranca",
  satisfacao: "Satisfacao",
  entrega: "Entrega",
};

const TENDENCIA_ICONS: Record<string, React.ElementType> = {
  up: TrendingUp, down: TrendingDown, stable: Minus,
};

const TENDENCIA_COLORS: Record<string, string> = {
  up: "text-green-600", down: "text-red-600", stable: "text-muted-foreground",
};

type KpiFormData = {
  nome: string;
  descricao: string;
  categoria: string;
  meta: string;
  valor_atual: string;
  unidade: string;
  tendencia: string;
  semaforo: string;
};

export default function Kpis() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: kpis = [], isLoading } = useListKpis({ query: { queryKey: getListKpisQueryKey() } });
  const createMut = useCreateKpi();
  const updateMut = useUpdateKpi();
  const deleteMut = useDeleteKpi();

  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<KpiFormData>({
    defaultValues: { nome: "", descricao: "", categoria: "infraestrutura", meta: "", valor_atual: "", unidade: "", tendencia: "stable", semaforo: "verde" },
  });

  const editForm = useForm<KpiFormData>();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListKpisQueryKey() });
    qc.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
  };

  const onCreateSubmit = (data: KpiFormData) => {
    createMut.mutate({ data }, {
      onSuccess: () => { toast({ title: "KPI criado" }); setShowCreate(false); form.reset(); invalidate(); },
    });
  };

  const onStartEdit = (kpi: typeof kpis[0]) => {
    editForm.reset({
      nome: kpi.nome, descricao: kpi.descricao ?? "", categoria: kpi.categoria,
      meta: kpi.meta, valor_atual: kpi.valor_atual, unidade: kpi.unidade,
      tendencia: kpi.tendencia, semaforo: kpi.semaforo,
    });
    setEditingId(kpi.id);
  };

  const onEditSubmit = (data: KpiFormData) => {
    if (!editingId) return;
    updateMut.mutate({ id: editingId, data }, {
      onSuccess: () => { toast({ title: "KPI atualizado" }); setEditingId(null); invalidate(); },
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Remover este KPI?")) return;
    deleteMut.mutate({ id }, { onSuccess: () => { toast({ title: "KPI removido" }); invalidate(); } });
  };

  if (isLoading) return <div className="p-6 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />)}</div>;

  const byCategory = kpis.reduce<Record<string, typeof kpis>>((acc, k) => {
    const cat = k.categoria;
    acc[cat] = acc[cat] ?? [];
    acc[cat].push(k);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">KPIs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Indicadores-Chave de Desempenho da CTI/AEB</p>
        </div>
        <Button data-testid="button-novo-kpi" onClick={() => setShowCreate(true)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Novo KPI
        </Button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {["verde", "amarelo", "vermelho"].map((s) => {
          const count = kpis.filter((k) => k.semaforo === s).length;
          return (
            <div key={s} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${SEMAFORO_COLORS[s]}`} />
              <div>
                <p className="text-xs text-muted-foreground">{SEMAFORO_LABELS[s]}</p>
                <p className="text-xl font-bold text-foreground">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {kpis.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><p>Nenhum KPI cadastrado.</p></div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byCategory).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{CATEGORIA_LABELS[cat] ?? cat}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((kpi) => {
                  const TrendIcon = TENDENCIA_ICONS[kpi.tendencia] ?? Minus;
                  return (
                    <div key={kpi.id} className="bg-card border border-border rounded-lg p-4" data-testid={`card-kpi-${kpi.id}`}>
                      {editingId === kpi.id ? (
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Meta</Label>
                              <Input data-testid={`input-kpi-meta-${kpi.id}`} {...editForm.register("meta")} className="mt-1 h-7 text-xs" />
                            </div>
                            <div>
                              <Label className="text-xs">Valor Atual</Label>
                              <Input data-testid={`input-kpi-valor-${kpi.id}`} {...editForm.register("valor_atual")} className="mt-1 h-7 text-xs" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Semaforo</Label>
                              <Controller name="semaforo" control={editForm.control} render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="mt-1 h-7 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="verde">Verde - Adequado</SelectItem>
                                    <SelectItem value="amarelo">Amarelo - Atencao</SelectItem>
                                    <SelectItem value="vermelho">Vermelho - Critico</SelectItem>
                                  </SelectContent>
                                </Select>
                              )} />
                            </div>
                            <div>
                              <Label className="text-xs">Tendencia</Label>
                              <Controller name="tendencia" control={editForm.control} render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="mt-1 h-7 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="up">Em alta</SelectItem>
                                    <SelectItem value="down">Em queda</SelectItem>
                                    <SelectItem value="stable">Estavel</SelectItem>
                                  </SelectContent>
                                </Select>
                              )} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" size="sm" className="h-7 text-xs" data-testid={`button-salvar-kpi-${kpi.id}`} disabled={updateMut.isPending}>Salvar</Button>
                            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setEditingId(null)}>Cancelar</Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${SEMAFORO_COLORS[kpi.semaforo]}`} />
                              <h3 className="text-sm font-semibold text-foreground">{kpi.nome}</h3>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button data-testid={`button-edit-kpi-${kpi.id}`} onClick={() => onStartEdit(kpi)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button data-testid={`button-delete-kpi-${kpi.id}`} onClick={() => handleDelete(kpi.id)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          {kpi.descricao && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{kpi.descricao}</p>}
                          <div className="mt-3 flex items-end justify-between gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Atual</p>
                              <p className="text-lg font-bold text-foreground">{kpi.valor_atual} <span className="text-xs font-normal text-muted-foreground">{kpi.unidade}</span></p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Meta</p>
                              <p className="text-sm font-semibold text-foreground">{kpi.meta}</p>
                            </div>
                            <TrendIcon className={`w-5 h-5 ${TENDENCIA_COLORS[kpi.tendencia] ?? ""}`} />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Novo KPI</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-3">
            <div>
              <Label>Nome *</Label>
              <Input data-testid="input-kpi-nome" {...form.register("nome", { required: true })} className="mt-1" />
            </div>
            <div>
              <Label>Descricao</Label>
              <Textarea {...form.register("descricao")} className="mt-1 resize-none" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoria</Label>
                <Controller name="categoria" control={form.control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORIA_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div>
                <Label>Unidade</Label>
                <Input data-testid="input-kpi-unidade" {...form.register("unidade")} className="mt-1" placeholder="%, horas, pontos..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Meta</Label>
                <Input data-testid="input-kpi-meta-create" {...form.register("meta")} className="mt-1" placeholder="> 95%" />
              </div>
              <div>
                <Label>Valor Atual</Label>
                <Input data-testid="input-kpi-valor-create" {...form.register("valor_atual")} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Semaforo</Label>
                <Controller name="semaforo" control={form.control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verde">Verde - Adequado</SelectItem>
                      <SelectItem value="amarelo">Amarelo - Atencao</SelectItem>
                      <SelectItem value="vermelho">Vermelho - Critico</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div>
                <Label>Tendencia</Label>
                <Controller name="tendencia" control={form.control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="up">Em alta</SelectItem>
                      <SelectItem value="down">Em queda</SelectItem>
                      <SelectItem value="stable">Estavel</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancelar</Button>
              <Button type="submit" data-testid="button-salvar-kpi-create" disabled={createMut.isPending}>{createMut.isPending ? "Salvando..." : "Criar KPI"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
