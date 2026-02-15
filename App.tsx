
import React, { useState } from 'react';
import { PlanningData, PlanningRow } from './types';
import { suggestEducationalContent } from './services/geminiService';
import { 
  PlusIcon, 
  TrashIcon, 
  PrinterIcon, 
  SparklesIcon, 
  ChevronDoubleDownIcon
} from '@heroicons/react/24/outline';

const THEMATIC_UNITS = ["Brincadeiras e Jogos", "Esportes", "Ginásticas", "Danças", "Lutas", "Práticas Corporais de Aventura"];
const KNOWLEDGE_OBJECTS = ["Brincadeiras e jogos populares", "Jogos de tabuleiros", "Jogos cooperativos", "Esportes de combate", "Lutas do mundo"];
const SKILLS = [
  { id: "EF12EF01", text: "(EF12EF01) Experimentar, fruir e recriar diferentes brincadeiras e jogos da cultura popular." },
  { id: "EF12EF02", text: "(EF12EF02) Explicar brincadeiras populares do contexto comunitário." }
];

const FIXED_METHODOLOGY_TEXT = ["Aprendizagem baseada na experimentação", "Rodas de conversa", "Atividades desenvolvidas:"];
const FIXED_EVALUATION_TEXT = "A avaliação acontecerá de forma processual e contínua.";
const FIXED_ADAPTATION_TEXT = "A Adaptação Curricular busca garantir segurança e inclusão.";

const App: React.FC = () => {
  const [data, setData] = useState<PlanningData>({
    unidadeEscolar: '', professor: '', mes: '', anoTurma: '', observacoes: '',
    rows: [{ id: Math.random().toString(36).substr(2, 9), unidadeTematica: '', objetoConhecimento: '', habilidades: '', estrategias: '', recursos: '', avaliacao: '', adaptacao: '' }]
  });

  const [isAiLoading, setIsAiLoading] = useState<string | null>(null);

  const handleInputChange = (field: keyof Omit<PlanningData, 'rows'>, value: string) => setData(prev => ({ ...prev, [field]: value }));
  const handleRowChange = (id: string, field: keyof PlanningRow, value: string) => setData(prev => ({ ...prev, rows: prev.rows.map(row => row.id === id ? { ...row, [field]: value } : row) }));

  const addRow = () => setData(prev => ({ ...prev, rows: [...prev.rows, { id: Math.random().toString(36).substr(2, 9), unidadeTematica: '', objetoConhecimento: '', habilidades: '', estrategias: '', recursos: '', avaliacao: '', adaptacao: '' }] }));
  const removeRow = (id: string) => data.rows.length > 1 && setData(prev => ({ ...prev, rows: prev.rows.filter(r => r.id !== id) }));

  const handleAiSuggest = async (id: string, tema: string, objeto: string) => {
    if (!tema && !objeto) return;
    setIsAiLoading(id);
    const suggestions = await suggestEducationalContent(`Unidade: ${tema}, Objeto: ${objeto}`);
    if (suggestions) {
      setData(prev => ({
        ...prev,
        rows: prev.rows.map(row => row.id === id ? { ...row, ...suggestions } : row)
      }));
    }
    setIsAiLoading(null);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg"><SparklesIcon className="w-6 h-6 text-white" /></div>
          <h1 className="text-xl font-black text-slate-800">PLANEJAMENTO PRO</h1>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold">
          <PrinterIcon className="w-5 h-5" /> EXPORTAR PDF
        </button>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 md:p-8 print-container">
        {/* CABEÇALHO PDF - MODELO 2 (Compacto) */}
        <div className="hidden print:block mb-4 border-b-2 border-black pb-2">
          <div className="flex items-center gap-4 mb-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bras%C3%A3o_de_Hortol%C3%A2ndia.png/1200px-Bras%C3%A3o_de_Hortol%C3%A2ndia.png" className="w-12 h-12 object-contain" />
            <div className="flex-1">
              <h1 className="text-lg font-black uppercase text-slate-800">Planejamento Mensal</h1>
              <p className="text-[8px] font-bold text-slate-500">PREFEITURA DE HORTOLÂNDIA - SECRETARIA DE EDUCAÇÃO</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 text-[10px] uppercase">
            <div><span className="font-black">Unidade:</span> {data.unidadeEscolar}</div>
            <div><span className="font-black">Professor:</span> {data.professor}</div>
            <div><span className="font-black">Período:</span> {data.mes}</div>
            <div><span className="font-black">Público:</span> {data.anoTurma}</div>
          </div>
        </div>

        {/* CABEÇALHO TELA */}
        <div className="no-print mb-8 bg-white p-6 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Unidade Escolar" value={data.unidadeEscolar} onChange={e => handleInputChange('unidadeEscolar', e.target.value)} className="border-b p-2 font-bold outline-none focus:border-emerald-500" />
          <input type="text" placeholder="Professor" value={data.professor} onChange={e => handleInputChange('professor', e.target.value)} className="border-b p-2 font-bold outline-none focus:border-emerald-500" />
          <input type="text" placeholder="Mês / Ano" value={data.mes} onChange={e => handleInputChange('mes', e.target.value)} className="border-b p-2 font-bold outline-none focus:border-emerald-500" />
          <input type="text" placeholder="Turma" value={data.anoTurma} onChange={e => handleInputChange('anoTurma', e.target.value)} className="border-b p-2 font-bold outline-none focus:border-emerald-500" />
        </div>

        {/* TABELA */}
        <div className="overflow-hidden border-2 border-slate-900 bg-white print:border-none">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 text-white print:bg-slate-100 print:text-black">
                <th className="w-[15%]">Unidade/Objeto</th>
                <th className="w-[20%]">Habilidades</th>
                <th className="w-[20%]">Estratégias</th>
                <th className="w-[15%]">Recursos</th>
                <th className="w-[15%]">Avaliação</th>
                <th className="w-[15%]">Adaptação</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map(row => (
                <tr key={row.id} className="border-b border-black print:break-inside-auto">
                  <td className="align-top p-2">
                    <div className="no-print space-y-1 mb-2">
                      <select className="w-full text-[9px] border p-1" value={row.unidadeTematica} onChange={e => handleRowChange(row.id, 'unidadeTematica', e.target.value)}>
                        <option value="">+ Unidade</option>
                        {THEMATIC_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <button onClick={() => handleAiSuggest(row.id, row.unidadeTematica, row.objetoConhecimento)} className="w-full bg-emerald-600 text-white text-[8px] font-black py-1 rounded">IA SUGERIR</button>
                    </div>
                    <div className="font-black text-emerald-700 text-[10px] uppercase">{row.unidadeTematica}</div>
                    <textarea value={row.objetoConhecimento} onChange={e => handleRowChange(row.id, 'objetoConhecimento', e.target.value)} className="mt-2 text-[9px]" placeholder="Objeto..." />
                  </td>
                  <td className="align-top"><textarea value={row.habilidades} onChange={e => handleRowChange(row.id, 'habilidades', e.target.value)} className="min-h-[100px] text-blue-800 font-bold" /></td>
                  <td className="align-top">
                    <div className="text-[8px] font-bold text-slate-500 mb-1">{FIXED_METHODOLOGY_TEXT.join(' / ')}</div>
                    <textarea value={row.estrategias} onChange={e => handleRowChange(row.id, 'estrategias', e.target.value)} className="min-h-[100px]" />
                  </td>
                  <td className="align-top"><textarea value={row.recursos} onChange={e => handleRowChange(row.id, 'recursos', e.target.value)} /></td>
                  <td className="align-top">
                    <div className="text-[8px] text-slate-500 mb-1">{FIXED_EVALUATION_TEXT}</div>
                    <textarea value={row.avaliacao} onChange={e => handleRowChange(row.id, 'avaliacao', e.target.value)} />
                  </td>
                  <td className="align-top">
                    <div className="text-[8px] text-slate-500 mb-1">{FIXED_ADAPTATION_TEXT}</div>
                    <textarea value={row.adaptacao} onChange={e => handleRowChange(row.id, 'adaptacao', e.target.value)} />
                    <button onClick={() => removeRow(row.id)} className="no-print text-red-500 mt-2"><TrashIcon className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="no-print p-4 flex justify-center bg-slate-50">
            <button onClick={addRow} className="bg-white border-2 border-black px-6 py-2 rounded-full font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all">
              + ADICIONAR NOVA UNIDADE
            </button>
          </div>
          <div className="p-4 bg-white border-t border-black">
            <label className="font-black text-[10px] uppercase">Observações:</label>
            <textarea value={data.observacoes} onChange={e => handleInputChange('observacoes', e.target.value)} className="h-12" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
