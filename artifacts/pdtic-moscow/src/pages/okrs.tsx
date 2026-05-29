import { useState } from "react";
import {
  useListOkrs, useCreateOkr, useUpdateOkr, useDeleteOkr,
  useCreateKeyResult, useUpdateKeyResult, useDeleteKeyResult,
  getListOkrsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, ChevronDown, ChevronRight, Trash2, Edit2, CheckCircle2, Circle, Clock } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const OKR_STATUS_LABELS: Record<string, string> = { ativo: "Ativo", concluido: "Concluido", cancelado: "Cancelado" };
const OKR_STATUS_COLORS: Record<string, string> = {
  ativo: "bg-blue-100 text-blue-800 border border-blue-200",
  concluido: "bg-green-100 text-green-800 border border-green-200",
  cancelado: "bg-gray-100 text-gray-600 border border-gray-200",
};
const KR_STATUS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  nao_iniciado: { label: "Nao iniciado", icon: Circle, color: "text-muted-foreground" },
  em_andamento: { label: "Em andamento", icon: Clock, color: "text-blue-600" },
  concluido: { label: "Concluido", icon: CheckCircle2, color: "text-green-600" },
  cancelado: { label: "Cancelado", icon: Circle, color: "text-gray-400" },
};

export default function Okrs() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: okrs = [], isLoading } = useListOkrs({ query: { queryKey: getListOkrsQueryKey() } });
  const createOkrMut = useCreateOkr();
  const updateOkrMut = useUpdateOkr();
  const deleteOkrMut = useDeleteOkr();
  const createKrMut = useCreateKeyResult();
  const updateKrMut = useUpdateKeyResult();
  const deleteKrMut = useDeleteKeyResult();

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [showOkrCreate, setShowOkrCreate] = useState(false);
  const [showKrCreate, setShowKrCreate] = useState<number | null>(null);
  const [editingKr, setEditingKr] = useState<number | null>(null);
  const [editingKrOkrId, setEditingKrOkrId] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListOkrsQueryKey() });

  const okrForm = useForm({
    defaultValues: { objetivo: "", descricao: "", trimestre: "Q2", ano: "2026", status: "ativo", progresso: "0" },
  });

  const krForm = useForm({
    defaultValues: { descricao: "", meta: "", unidade: "", valor_atual: "0", status: "nao_iniciado" },
  });

  const toggleExpand = (id: number) => {
    const s = new Set(expanded);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpanded(s);
  };

  const onCreateOkr = (data: Record<string, string>) => {
    createOkrMut.mutate({
      data: { objetivo: data.objetivo, descricao: data.descricao || undefined, trimestre: data.trimestre, ano: parseInt(data.ano), status: data.status, progresso: parseInt(data.progresso || "0") },
    }, {
      onSuccess: () => { toast({ title: "OKR criado" }); setShowOkrCreate(false); okrForm.reset(); invalidate(); },
    });
  };

  const onCreateKr = (okrId: number, data: Record<string, string>) => {
    createKrMut.mutate({
      id: okrId,
      data: { descricao: data.descricao, meta: data.meta, unidade: data.unidade, valor_atual: data.valor_atual || "0", status: data.status },
    }, {
      onSuccess: () => { toast({ title: "Key Result adicionado" }); setShowKrCreate(null); krForm.reset(); invalidate(); },
    });
  };

  const onUpdateProgress = (okrId: number, progresso: number) => {
    updateOkrMut.mutate({ id: okrId, data: { progresso } }, { onSuccess: invalidate });
  };

  const onDeleteOkr = (id: number) => {
    if (!confirm("Remover este OKR e todos os seus Key Results?")) return;
    deleteOkrMut.mutate({ id }, { onSuccess: () => { toast({ title: "OKR removido" }); invalidate(); } });
  };

  const onUpdateKr = (krId: number, data: Record<string, string>) => {
    updateKrMut.mutate({ id: krId, data: { valor_atual: data.valor_atual, status: data.status } }, {
      onSuccess: () => { toast({ title: "Key Result atualizado" }); setEditingKr(null); invalidate(); },
    });
  };

  const onDeleteKr = (krId: number) => {
    if (!confirm("Remover este Key Result?")) return;
    deleteKrMut.mutate({ id: krId }, { onSuccess: () => { toast({ title: "Key Result removido" }); invalidate(); } });
  };

  if (isLoading) return <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />)}</div>;

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">OKRs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Objetivos e Resultados-Chave da CTI/AEB</p>
        </div>
        <Button data-testid="button-novo-okr" onClick={() => setShowOkrCreate(true)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Novo OKR
        </Button>
      </div>

      {okrs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><p className="font-medium">Nenhum OKR cadastrado.</p></div>
      ) : (
        <div className="space-y-4">
          {okrs.map((okr) => {
            const open = expanded.has(okr.id);
            return (
              <div key={okr.id} className="bg-card border border-border rounded-lg overflow-hidden" data-testid={`card-okr-${okr.id}`}>
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => toggleExpand(okr.id)}
                >
                  {open ? <ChevronDown className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="font-semibold text-foreground text-sm flex-1 min-w-0">{okr.objetivo}</p>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${OKR_STATUS_COLORS[okr.status] ?? ""}`}>{OKR_STATUS_LABELS[okr.status] ?? okr.status}</span>
                      {okr.trimestre && <span className="text-xs text-muted-foreground">{okr.trimestre}/{okr.ano}</span>}
                    </div>
                    {okr.descricao && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{okr.descricao}</p>}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${okr.progresso}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground w-8 text-right">{okr.progresso}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{okr.keyResults?.length ?? 0} Key Results</p>
                  </div>
                  <button
                    data-testid={`button-delete-okr-${okr.id}`}
                    onClick={(e) => { e.stopPropagation(); onDeleteOkr(okr.id); }}
                    className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 shrink-0"
                  ><Trash2 className="w-3.5 h-3.5" /></button>
                </div>

                {open && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                    {/* Progress editor */}
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="text-xs shrink-0">Progresso (%)</Label>
                      <Input
                        type="number" min={0} max={100}
                        defaultValue={okr.progresso}
                        className="w-20 h-7 text-xs"
                        onBlur={(e) => onUpdateProgress(okr.id, parseInt(e.target.value) || 0)}
                      />
                    </div>

                    {/* Key results */}
                    {okr.keyResults?.length === 0 && <p className="text-xs text-muted-foreground">Nenhum Key Result ainda.</p>}
                    {okr.keyResults?.map((kr) => {
                      const krSt = KR_STATUS[kr.status] ?? KR_STATUS.nao_iniciado;
                      const Icon = krSt.icon;
                      return (
                        <div key={kr.id} className="flex items-start gap-2 text-sm border border-border rounded-lg p-3" data-testid={`card-kr-${kr.id}`}>
                          <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${krSt.color}`} />
                          <div className="flex-1 min-w-0">
                            {editingKr === kr.id ? (
                              <EditKrForm
                                kr={kr}
                                onSave={(data) => onUpdateKr(kr.id, data)}
                                onCancel={() => setEditingKr(null)}
                              />
                            ) : (
                              <>
                                <p className="font-medium text-foreground text-xs">{kr.descricao}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Meta: {kr.meta} {kr.unidade} &mdash; Atual: <strong>{kr.valor_atual}</strong> {kr.unidade}
                                </p>
                                <span className="text-xs text-muted-foreground">{krSt.label}</span>
                              </>
                            )}
                          </div>
                          {editingKr !== kr.id && (
                            <div className="flex gap-1 shrink-0">
                              <button data-testid={`button-edit-kr-${kr.id}`} onClick={() => setEditingKr(kr.id)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button data-testid={`button-delete-kr-${kr.id}`} onClick={() => onDeleteKr(kr.id)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <button
                      data-testid={`button-add-kr-${okr.id}`}
                      onClick={() => setShowKrCreate(okr.id)}
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Key Result
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create OKR dialog */}
      <Dialog open={showOkrCreate} onOpenChange={setShowOkrCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Novo OKR</DialogTitle></DialogHeader>
          <form onSubmit={okrForm.handleSubmit(onCreateOkr as Parameters<typeof okrForm.handleSubmit>[0])} className="space-y-3">
            <div>
              <Label>Objetivo *</Label>
              <Textarea data-testid="input-objetivo" {...okrForm.register("objetivo", { required: true })} className="mt-1 resize-none" rows={2} />
            </div>
            <div>
              <Label>Descricao</Label>
              <Textarea {...okrForm.register("descricao")} className="mt-1 resize-none" rows={2} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Trimestre</Label>
                <Input {...okrForm.register("trimestre")} className="mt-1" placeholder="Q2" />
              </div>
              <div>
                <Label>Ano</Label>
                <Input type="number" {...okrForm.register("ano")} className="mt-1" />
              </div>
              <div>
                <Label>Status</Label>
                <Controller name="status" control={okrForm.control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="concluido">Concluido</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowOkrCreate(false)}>Cancelar</Button>
              <Button type="submit" data-testid="button-salvar-okr" disabled={createOkrMut.isPending}>{createOkrMut.isPending ? "Salvando..." : "Criar OKR"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create KR dialog */}
      <Dialog open={showKrCreate !== null} onOpenChange={() => setShowKrCreate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Adicionar Key Result</DialogTitle></DialogHeader>
          <form onSubmit={krForm.handleSubmit((data) => showKrCreate && onCreateKr(showKrCreate, data as Record<string, string>))} className="space-y-3">
            <div>
              <Label>Descricao *</Label>
              <Textarea data-testid="input-kr-descricao" {...krForm.register("descricao", { required: true })} className="mt-1 resize-none" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Meta</Label>
                <Input data-testid="input-kr-meta" {...krForm.register("meta")} className="mt-1" />
              </div>
              <div>
                <Label>Unidade</Label>
                <Input data-testid="input-kr-unidade" {...krForm.register("unidade")} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Valor Atual</Label>
                <Input data-testid="input-kr-valor-atual" {...krForm.register("valor_atual")} className="mt-1" />
              </div>
              <div>
                <Label>Status</Label>
                <Controller name="status" control={krForm.control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nao_iniciado">Nao iniciado</SelectItem>
                      <SelectItem value="em_andamento">Em andamento</SelectItem>
                      <SelectItem value="concluido">Concluido</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowKrCreate(null)}>Cancelar</Button>
              <Button type="submit" data-testid="button-salvar-kr" disabled={createKrMut.isPending}>{createKrMut.isPending ? "Salvando..." : "Adicionar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditKrForm({ kr, onSave, onCancel }: { kr: { id: number; valor_atual: string; status: string }; onSave: (data: Record<string, string>) => void; onCancel: () => void }) {
  const form = useForm({ defaultValues: { valor_atual: kr.valor_atual, status: kr.status } });
  return (
    <form onSubmit={form.handleSubmit(onSave as Parameters<typeof form.handleSubmit>[0])} className="flex gap-2 items-center flex-wrap">
      <Input data-testid="input-kr-edit-valor" {...form.register("valor_atual")} className="h-7 w-24 text-xs" />
      <Controller name="status" control={form.control} render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="nao_iniciado">Nao iniciado</SelectItem>
            <SelectItem value="em_andamento">Em andamento</SelectItem>
            <SelectItem value="concluido">Concluido</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      )} />
      <Button type="submit" size="sm" className="h-7 text-xs" data-testid="button-salvar-kr-edit">Salvar</Button>
      <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={onCancel}>Cancelar</Button>
    </form>
  );
}
