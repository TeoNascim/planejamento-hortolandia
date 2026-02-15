
export interface PlanningRow {
  id: string;
  unidadeTematica: string;
  objetoConhecimento: string;
  habilidades: string;
  estrategias: string;
  recursos: string;
  avaliacao: string;
  adaptacao: string;
}

export interface PlanningData {
  unidadeEscolar: string;
  professor: string;
  mes: string;
  anoTurma: string;
  observacoes: string;
  rows: PlanningRow[];
}
