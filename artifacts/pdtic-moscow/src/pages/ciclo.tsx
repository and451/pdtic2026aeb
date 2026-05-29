import { CheckCircle, Circle, Send, ClipboardCheck, FileSearch, Lock, RotateCcw } from "lucide-react";
import { WORKFLOW_LABELS, WORKFLOW_COLORS } from "@/lib/moscow";

const STEPS = [
  {
    key: "rascunho",
    icon: Circle,
    title: "Rascunho",
    description: "Elaboracao inicial pela unidade solicitante.",
  },
  {
    key: "enviada",
    icon: Send,
    title: "Enviada",
    description: "Submissao para analise da diretoria.",
  },
  {
    key: "aprovada_dir",
    icon: ClipboardCheck,
    title: "Aprovada Dir.",
    description: "Validacao pela diretoria responsavel.",
  },
  {
    key: "revisao_cti",
    icon: FileSearch,
    title: "Revisao CTI",
    description: "Avaliacao tecnica pelo CTI/CGD-AEB.",
  },
  {
    key: "finalizada",
    icon: Lock,
    title: "Finalizada",
    description: "Incorporada ao PDTIC. Nao editavel.",
  },
];

export default function Ciclo() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Ciclo do Processo PDTIC</h1>
        <p className="text-sm text-muted-foreground mt-0.5">As 5 etapas do fluxo de aprovacao das necessidades de TIC</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:items-center md:justify-between">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === STEPS.length - 1;
            return (
              <div key={step.key} className="flex items-center gap-3 md:flex-col md:items-center md:text-center md:flex-1">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${WORKFLOW_COLORS[step.key]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!isLast && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-border -translate-y-1/2" style={{ width: "calc(100% + 1rem)" }} />
                  )}
                </div>
                <div className="md:mt-2">
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground max-w-[140px]">{step.description}</p>
                </div>
                {!isLast && (
                  <div className="md:hidden absolute left-5 ml-5 mt-8 w-0.5 h-6 bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 space-y-3">
        <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Regras de Transicao</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <RotateCcw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Devolucao: Aprovada Dir. ou Revisao CTI podem ser devolvidas ao status <strong>Rascunho</strong> para correcoes.</span>
          </li>
          <li className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>Imutabilidade: Necessidades com status <strong>Finalizada</strong> nao podem ser editadas ou removidas.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <span>Aprovacao final so e possivel apos a Revisao CTI validar a necessidade.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
