export const MOSCOW_LABELS: Record<string, string> = {
  must: "Must Have",
  should: "Should Have",
  could: "Could Have",
  wont: "Won't Have",
};

export const MOSCOW_COLORS: Record<string, string> = {
  must: "bg-red-100 text-red-800 border border-red-200",
  should: "bg-orange-100 text-orange-800 border border-orange-200",
  could: "bg-blue-100 text-blue-800 border border-blue-200",
  wont: "bg-gray-100 text-gray-600 border border-gray-200",
};

export const STATUS_LABELS: Record<string, string> = {
  atendida: "Atendida",
  em_andamento: "Em Andamento",
  nao_atendida: "Nao Atendida",
  cancelada: "Cancelada",
  pendente: "Pendente",
};

export const STATUS_COLORS: Record<string, string> = {
  atendida: "bg-green-100 text-green-800 border border-green-200",
  em_andamento: "bg-blue-100 text-blue-800 border border-blue-200",
  nao_atendida: "bg-red-100 text-red-800 border border-red-200",
  cancelada: "bg-gray-100 text-gray-600 border border-gray-200",
  pendente: "bg-yellow-100 text-yellow-800 border border-yellow-200",
};

export const WORKFLOW_LABELS: Record<string, string> = {
  rascunho: "Rascunho",
  enviada: "Enviada",
  aprovada_dir: "Aprovada Dir.",
  revisao_cti: "Revisão CTI",
  finalizada: "Finalizada",
  devolvida: "Devolvida",
};

export const WORKFLOW_COLORS: Record<string, string> = {
  rascunho: "bg-gray-100 text-gray-600 border border-gray-200",
  enviada: "bg-blue-100 text-blue-800 border border-blue-200",
  aprovada_dir: "bg-green-100 text-green-800 border border-green-200",
  revisao_cti: "bg-purple-100 text-purple-800 border border-purple-200",
  finalizada: "bg-slate-800 text-slate-100 border border-slate-700",
  devolvida: "bg-amber-100 text-amber-800 border border-amber-200",
};

export const EIXO_LABELS: Record<string, string> = {
  infraestrutura: "Infraestrutura",
  sistemas: "Sistemas de Informacao",
  dados_inovacao_seguranca: "Dados, Inovacao e Seguranca",
  governanca: "Governanca",
};

export const SEMAFORO_COLORS: Record<string, string> = {
  verde: "bg-green-500",
  amarelo: "bg-amber-400",
  vermelho: "bg-red-500",
};

export const SEMAFORO_LABELS: Record<string, string> = {
  verde: "Adequado",
  amarelo: "Atencao",
  vermelho: "Critico",
};

export function formatCurrency(value: number | string | null | undefined): string {
  if (value == null) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(num);
}
