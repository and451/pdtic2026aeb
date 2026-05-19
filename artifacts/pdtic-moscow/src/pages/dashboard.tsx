import { useGetDashboardSummary, useGetNecessidadesStats } from "@workspace/api-client-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CheckCircle2, Clock, DollarSign, Target, BarChart3, Activity } from "lucide-react";
import { MOSCOW_LABELS, STATUS_LABELS, EIXO_LABELS, formatCurrency, SEMAFORO_COLORS, SEMAFORO_LABELS } from "@/lib/moscow";

function DonutChart({ data, size = 160 }: { data: { value: number; fill: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div style={{ width: size, height: size }} className="rounded-full bg-muted" />;
  const cx = size / 2, cy = size / 2;
  const r1 = size * 0.26, r2 = size * 0.46;
  const toRad = (a: number) => (a * Math.PI) / 180;
  let current = -90;
  const gap = 2;
  const segments = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const sweep = (d.value / total) * 360 - gap;
      const sa = current, ea = current + sweep;
      current = ea + gap;
      const x1 = cx + r2 * Math.cos(toRad(sa)), y1 = cy + r2 * Math.sin(toRad(sa));
      const x2 = cx + r2 * Math.cos(toRad(ea)), y2 = cy + r2 * Math.sin(toRad(ea));
      const x3 = cx + r1 * Math.cos(toRad(ea)), y3 = cy + r1 * Math.sin(toRad(ea));
      const x4 = cx + r1 * Math.cos(toRad(sa)), y4 = cy + r1 * Math.sin(toRad(sa));
      const lg = sweep > 180 ? 1 : 0;
      return { fill: d.fill, d: `M${x1} ${y1} A${r2} ${r2} 0 ${lg} 1 ${x2} ${y2} L${x3} ${y3} A${r1} ${r1} 0 ${lg} 0 ${x4} ${y4}Z` };
    });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {segments.map((s, i) => <path key={i} d={s.d} fill={s.fill} />)}
    </svg>
  );
}

const MOSCOW_CHART_COLORS = { must: "#dc2626", should: "#ea580c", could: "#2563eb", wont: "#9ca3af" };
const STATUS_CHART_COLORS = { atendida: "#16a34a", em_andamento: "#2563eb", nao_atendida: "#dc2626", cancelada: "#9ca3af", pendente: "#ca8a04" };

function StatCard({ label, value, sub, icon: Icon, color = "primary" }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; color?: "primary" | "green" | "amber" | "red";
}) {
  const colors: Record<string, string> = {
    primary: "text-primary bg-primary/10",
    green: "text-green-600 bg-green-50",
    amber: "text-amber-600 bg-amber-50",
    red: "text-red-600 bg-red-50",
  };
  return (
    <div className="bg-card border border-border rounded-lg p-4" data-testid="card-stat">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: stats, isLoading: loadingStats } = useGetNecessidadesStats();

  if (loadingSummary || loadingStats) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!summary || !stats) {
    return <div className="p-6 text-muted-foreground">Erro ao carregar dados do dashboard.</div>;
  }

  const moscowChartData = Object.entries(summary.necessidades_por_moscow || {}).map(([k, v]) => ({
    name: MOSCOW_LABELS[k] ?? k, value: v as number, fill: MOSCOW_CHART_COLORS[k as keyof typeof MOSCOW_CHART_COLORS] ?? "#888",
  }));

  const statusChartData = Object.entries(summary.necessidades_por_status || {}).map(([k, v]) => ({
    name: STATUS_LABELS[k] ?? k, value: v as number, fill: STATUS_CHART_COLORS[k as keyof typeof STATUS_CHART_COLORS] ?? "#888",
  }));

  const eixoChartData = Object.entries(stats.por_eixo || {}).map(([k, v]) => ({
    name: EIXO_LABELS[k] ?? k, value: v as number,
  }));

  const orcPct = summary.orcamento_execucao_pct ?? 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard Executivo</h1>
        <p className="text-sm text-muted-foreground mt-0.5">PDTIC/AEB 2024-2026 — Periodo de referencia: jan/2024 a mai/2026</p>
      </div>

      {/* Top KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total de Necessidades" value={summary.necessidades_total} sub="mapeadas no PDTIC" icon={Activity} color="primary" />
        <StatCard
          label="Atendidas"
          value={summary.necessidades_por_status?.atendida ?? 0}
          sub={`${Math.round(((summary.necessidades_por_status?.atendida ?? 0) / summary.necessidades_total) * 100)}% do total`}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          label="Sem Informacao"
          value={(summary.necessidades_por_status?.pendente ?? 0)}
          sub="aguardando atualizacao"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          label="Nao Atendidas"
          value={summary.necessidades_por_status?.nao_atendida ?? 0}
          sub="requerem atencao"
          icon={Clock}
          color="red"
        />
      </div>

      {/* Budget row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4" data-testid="card-orcamento">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Orcamento Planejado (Total)</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(summary.orcamento_planejado_total)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Acumulado 2024-2025</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Orcamento Realizado</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(summary.orcamento_realizado_total)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Efetivamente executado</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Execucao Orcamentaria</p>
              <p className="text-2xl font-bold text-foreground mt-1">{orcPct}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Do total planejado</p>
            </div>
            <DollarSign className={`w-5 h-5 mt-1 ${orcPct >= 85 ? "text-green-600" : orcPct >= 70 ? "text-amber-600" : "text-red-600"}`} />
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${orcPct >= 85 ? "bg-green-500" : orcPct >= 70 ? "bg-amber-400" : "bg-red-500"}`}
              style={{ width: `${Math.min(orcPct, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MoSCoW donut */}
        <div className="bg-card border border-border rounded-lg p-5" data-testid="chart-moscow">
          <h3 className="text-sm font-semibold text-foreground mb-4">Distribuicao MoSCoW</h3>
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              <DonutChart data={moscowChartData} size={160} />
            </div>
            <div className="space-y-2 flex-1">
              {moscowChartData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-semibold text-foreground ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status donut */}
        <div className="bg-card border border-border rounded-lg p-5" data-testid="chart-status">
          <h3 className="text-sm font-semibold text-foreground mb-4">Status de Execucao</h3>
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              <DonutChart data={statusChartData} size={160} />
            </div>
            <div className="space-y-2 flex-1">
              {statusChartData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
                  <span className="text-muted-foreground text-xs">{d.name}</span>
                  <span className="font-semibold text-foreground ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Eixo bar chart */}
      <div className="bg-card border border-border rounded-lg p-5" data-testid="chart-eixo">
        <h3 className="text-sm font-semibold text-foreground mb-4">Necessidades por Eixo Tematico</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={eixoChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={180} />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(217, 91%, 30%)" radius={[0, 4, 4, 0]} name="Necessidades" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* OKR + KPI bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">OKRs</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(summary.okrs_por_status || {}).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span className="capitalize text-muted-foreground">{k}</span>
                <span className="font-semibold text-foreground">{v as number}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-border flex items-center justify-between text-sm font-semibold">
              <span>Total</span><span>{summary.okrs_total}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">KPIs por Semaforo</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(summary.kpis_por_semaforo || {}).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3 text-sm">
                <div className={`w-3 h-3 rounded-full ${SEMAFORO_COLORS[k] ?? "bg-gray-400"}`} />
                <span className="text-muted-foreground capitalize">{SEMAFORO_LABELS[k] ?? k}</span>
                <span className="font-semibold text-foreground ml-auto">{v as number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
