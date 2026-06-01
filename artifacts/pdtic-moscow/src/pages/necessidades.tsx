import { useState } from "react";
import { Link } from "wouter";
import {
  useListNecessidades,
  useCreateNecessidade,
  useUpdateNecessidade,
  useDeleteNecessidade,
  getListNecessidadesQueryKey,
  getGetNecessidadesStatsQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Trash2, ExternalLink, ChevronDown } from "lucide-react";
import { MOSCOW_LABELS, MOSCOW_COLORS, STATUS_LABELS, STATUS_COLORS, WORKFLOW_LABELS, WORKFLOW_COLORS, EIXO_LABELS, formatCurrency } from "@/lib/moscow";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
  orcamento_planejado: string;
  orcamento_realizado: string;
  ano: string;
  observacoes: string;
};

export default function Necessidades() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterEixo, setFilterEixo] = useState("all");
  const [filterMoscow, setFilterMoscow] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterWorkflow, setFilterWorkflow] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: number; field: "moscow" | "status" | "workflow" } | null>(null);
  const [editingNum, setEditingNum] = useState<{ id: number; field: "orc_planejado" | "orc_realizado"; value: string } | null>(null);

  const params = {
    ...(filterEixo !== "all" && { eixo: filterEixo }),
    ...(filterMoscow !== "all" && { classificacao_moscow: filterMoscow }),
    ...(filterStatus !== "all" && { status: filterStatus }),
  };

  const { data: necessidades = [], isLoading } = useListNecessidades(params, {
    query: { queryKey: getListNecessidadesQueryKey(params) },
  });

  const createMut = useCreateNecessidade();
  const updateMut = useUpdateNecessidade();
  const deleteMut = useDeleteNecessidade();

  const form = useForm<FormData>({
    defaultValues: {
      titulo: "", descricao: "", eixo: "infraestrutura", classificacao_moscow: "must",
      status: "pendente", orcamento_planejado: "", orcamento_realizado: "", ano: "2025", observacoes: "",
    },
  });

  const filtered = necessidades.filter((n) => {
    const matchesSearch = n.titulo.toLowerCase().includes(search.toLowerCase()) ||
      (n.descricao ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesWorkflow = filterWorkflow === "all" || n.workflow_status === filterWorkflow;
    return matchesSearch && matchesWorkflow;
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListNecessidadesQueryKey(params) });
    qc.invalidateQueries({ queryKey: getGetNecessidadesStatsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
  };

  const onSubmit = (data: FormData) => {
    createMut.mutate({
      data: {
        titulo: data.titulo,
        descricao: data.descricao || undefined,
        eixo: data.eixo,
        classificacao_moscow: data.classificacao_moscow,
        status: data.status,
        orcamento_planejado: data.orcamento_planejado ? parseFloat(data.orcamento_planejado) : undefined,
        orcamento_realizado: data.orcamento_realizado ? parseFloat(data.orcamento_realizado) : undefined,
        ano: data.ano ? parseInt(data.ano) : undefined,
        observacoes: data.observacoes || undefined,
      },
    }, {
      onSuccess: () => {
        toast({ title: "Necessidade criada com sucesso" });
        setShowCreate(false);
        form.reset();
        invalidate();
      },
    });
  };

  const handleDelete = (id: number, titulo: string) => {
    if (!confirm(`Remover "${titulo}"?`)) return;
    deleteMut.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Necessidade removida" });
        invalidate();
      },
    });
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Necessidades de TIC</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} necessidade(s) exibida(s)</p>
        </div>
        <Button data-testid="button-nova-necessidade" onClick={() => setShowCreate(true)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Nova Necessidade
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-testid="input-search-necessidades"
            placeholder="Buscar necessidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterEixo} onValueChange={setFilterEixo}>
          <SelectTrigger className="w-48" data-testid="select-filter-eixo">
            <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Eixo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os eixos</SelectItem>
            {EIXOS.map((e) => <SelectItem key={e} value={e}>{EIXO_LABELS[e]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterMoscow} onValueChange={setFilterMoscow}>
          <SelectTrigger className="w-40" data-testid="select-filter-moscow">
            <SelectValue placeholder="MoSCoW" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {MOSCOW_OPTIONS.map((m) => <SelectItem key={m} value={m}>{MOSCOW_LABELS[m]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40" data-testid="select-filter-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterWorkflow} onValueChange={setFilterWorkflow}>
          <SelectTrigger className="w-44" data-testid="select-filter-workflow">
            <SelectValue placeholder="Workflow" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {WORKFLOW_OPTIONS.map((w) => <SelectItem key={w} value={w}>{WORKFLOW_LABELS[w]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-medium">Nenhuma necessidade encontrada</p>
          <p className="text-sm mt-1">Ajuste os filtros ou adicione uma nova necessidade.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Necessidade</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Eixo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">MoSCoW</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workflow</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Orc. Planejado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">Valor Contratado</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((n) => (
                <tr key={n.id} className="hover:bg-muted/20 transition-colors" data-testid={`row-necessidade-${n.id}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground line-clamp-1">{n.titulo}</p>
                    {n.descricao && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{n.descricao}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">{EIXO_LABELS[n.eixo] ?? n.eixo}</span>
                  </td>
                  <td className="px-4 py-3">
                    {editingCell?.id === n.id && editingCell.field === "moscow" ? (
                      <Select
                        value={n.classificacao_moscow}
                        onValueChange={(v) => {
                          if (v !== n.classificacao_moscow) {
                            updateMut.mutate(
                              { id: n.id, data: { classificacao_moscow: v } },
                              {
                                onSuccess: () => {
                                  toast({ title: "MoSCoW atualizado" });
                                  invalidate();
                                },
                                onSettled: () => setEditingCell(null),
                              }
                            );
                          } else {
                            setEditingCell(null);
                          }
                        }}
                        open
                        onOpenChange={(open) => { if (!open) setEditingCell(null); }}
                      >
                        <SelectTrigger className="w-32 h-7 text-xs px-2 py-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MOSCOW_OPTIONS.map((m) => (
                            <SelectItem key={m} value={m} className="text-xs">{MOSCOW_LABELS[m]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <button
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium cursor-pointer hover:opacity-80 ${MOSCOW_COLORS[n.classificacao_moscow] ?? ""}`}
                        onClick={() => setEditingCell({ id: n.id, field: "moscow" })}
                      >
                        {MOSCOW_LABELS[n.classificacao_moscow] ?? n.classificacao_moscow}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingCell?.id === n.id && editingCell.field === "status" ? (
                      <Select
                        value={n.status}
                        onValueChange={(v) => {
                          if (v !== n.status) {
                            updateMut.mutate(
                              { id: n.id, data: { status: v } },
                              {
                                onSuccess: () => {
                                  toast({ title: "Status atualizado" });
                                  invalidate();
                                },
                                onSettled: () => setEditingCell(null),
                              }
                            );
                          } else {
                            setEditingCell(null);
                          }
                        }}
                        open
                        onOpenChange={(open) => { if (!open) setEditingCell(null); }}
                      >
                        <SelectTrigger className="w-36 h-7 text-xs px-2 py-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">{STATUS_LABELS[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <button
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium cursor-pointer hover:opacity-80 ${STATUS_COLORS[n.status] ?? ""}`}
                        onClick={() => setEditingCell({ id: n.id, field: "status" })}
                      >
                        {STATUS_LABELS[n.status] ?? n.status}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingCell?.id === n.id && editingCell.field === "workflow" ? (
                      <Select
                        value={n.workflow_status}
                        onValueChange={(v) => {
                          if (v !== n.workflow_status) {
                            updateMut.mutate(
                              { id: n.id, data: { workflow_status: v } },
                              {
                                onSuccess: () => {
                                  toast({ title: "Workflow atualizado" });
                                  invalidate();
                                },
                                onSettled: () => setEditingCell(null),
                              }
                            );
                          } else {
                            setEditingCell(null);
                          }
                        }}
                        open
                        onOpenChange={(open) => { if (!open) setEditingCell(null); }}
                      >
                        <SelectTrigger className="w-40 h-7 text-xs px-2 py-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {WORKFLOW_OPTIONS.map((w) => (
                            <SelectItem key={w} value={w} className="text-xs">{WORKFLOW_LABELS[w]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <button
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium cursor-pointer hover:opacity-80 ${WORKFLOW_COLORS[n.workflow_status ?? ""] ?? ""}`}
                        onClick={() => setEditingCell({ id: n.id, field: "workflow" })}
                      >
                        {WORKFLOW_LABELS[n.workflow_status ?? ""] ?? n.workflow_status}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {editingNum?.id === n.id && editingNum?.field === "orc_planejado" ? (
                      <Input
                        autoFocus
                        type="number"
                        step="0.01"
                        className="w-32 h-7 text-xs px-2 py-0"
                        value={editingNum.value}
                        onChange={(e) => setEditingNum({ ...editingNum, value: e.target.value })}
                        onBlur={() => {
                          const val = parseFloat(editingNum.value);
                          if (!isNaN(val) && val !== (n.orcamento_planejado ?? 0)) {
                            updateMut.mutate(
                              { id: n.id, data: { orcamento_planejado: val } },
                              { onSuccess: () => { toast({ title: "Orcamento atualizado" }); invalidate(); }, onSettled: () => setEditingNum(null) }
                            );
                          } else { setEditingNum(null); }
                        }}
                        onKeyDown={(e) => { if (e.key === "Escape") setEditingNum(null); }}
                      />
                    ) : (
                      <button
                        className="text-xs text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                        onClick={() => setEditingNum({ id: n.id, field: "orc_planejado", value: (n.orcamento_planejado ?? "").toString() })}
                      >
                        {formatCurrency(n.orcamento_planejado) || "—"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    {editingNum?.id === n.id && editingNum?.field === "orc_realizado" ? (
                      <Input
                        autoFocus
                        type="number"
                        step="0.01"
                        className="w-32 h-7 text-xs px-2 py-0"
                        value={editingNum.value}
                        onChange={(e) => setEditingNum({ ...editingNum, value: e.target.value })}
                        onBlur={() => {
                          const val = parseFloat(editingNum.value);
                          const current = n.orcamento_realizado ?? 0;
                          if (!isNaN(val) && val !== current) {
                            updateMut.mutate(
                              { id: n.id, data: { orcamento_realizado: val } },
                              { onSuccess: () => { toast({ title: "Valor atualizado" }); invalidate(); }, onSettled: () => setEditingNum(null) }
                            );
                          } else { setEditingNum(null); }
                        }}
                        onKeyDown={(e) => { if (e.key === "Escape") setEditingNum(null); }}
                      />
                    ) : (
                      <button
                        className="text-xs text-foreground font-medium hover:underline cursor-pointer"
                        onClick={() => setEditingNum({ id: n.id, field: "orc_realizado", value: (n.orcamento_realizado ?? "").toString() })}
                      >
                        {n.orcamento_realizado ? formatCurrency(n.orcamento_realizado) : <span className="text-muted-foreground">—</span>}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/necessidades/${n.id}`}
                        data-testid={`link-edit-necessidade-${n.id}`}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        data-testid={`button-delete-necessidade-${n.id}`}
                        onClick={() => handleDelete(n.id, n.titulo)}
                        className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Necessidade de TIC</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Titulo *</Label>
              <Input data-testid="input-titulo" {...form.register("titulo", { required: true })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Eixo *</Label>
                <Select defaultValue="infraestrutura" onValueChange={(v) => form.setValue("eixo", v)}>
                  <SelectTrigger className="mt-1" data-testid="select-eixo-form">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EIXOS.map((e) => <SelectItem key={e} value={e}>{EIXO_LABELS[e]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Classificacao MoSCoW *</Label>
                <Select defaultValue="must" onValueChange={(v) => form.setValue("classificacao_moscow", v)}>
                  <SelectTrigger className="mt-1" data-testid="select-moscow-form">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOSCOW_OPTIONS.map((m) => <SelectItem key={m} value={m}>{MOSCOW_LABELS[m]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status *</Label>
                <Select defaultValue="pendente" onValueChange={(v) => form.setValue("status", v)}>
                  <SelectTrigger className="mt-1" data-testid="select-status-form">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ano</Label>
                <Input data-testid="input-ano" type="number" {...form.register("ano")} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Orc. Planejado (R$)</Label>
                <Input data-testid="input-orc-planejado" type="number" step="0.01" {...form.register("orcamento_planejado")} className="mt-1" />
              </div>
              <div>
                <Label>Orc. Realizado (R$)</Label>
                <Input data-testid="input-orc-realizado" type="number" step="0.01" {...form.register("orcamento_realizado")} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Descricao</Label>
              <Textarea data-testid="textarea-descricao" {...form.register("descricao")} className="mt-1 resize-none" rows={2} />
            </div>
            <div>
              <Label>Observacoes</Label>
              <Textarea data-testid="textarea-observacoes" {...form.register("observacoes")} className="mt-1 resize-none" rows={2} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancelar</Button>
              <Button type="submit" data-testid="button-salvar-necessidade" disabled={createMut.isPending}>
                {createMut.isPending ? "Salvando..." : "Criar Necessidade"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
