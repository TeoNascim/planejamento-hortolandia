
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

const THEMATIC_UNITS = [
  "Brincadeiras e Jogos",
  "Esportes",
  "Ginásticas",
  "Danças",
  "Lutas",
  "Práticas Corporais de Aventura"
];

const KNOWLEDGE_OBJECTS = [
  "Brincadeiras e jogos da cultura popular presentes no contexto comunitário e regional",
  "Brincadeiras e jogos da cultura popular presentes no contexto brasileiro",
  "Brincadeiras e jogos da cultura popular do mundo",
  "Brincadeiras e jogos de matriz indígena e africana",
  "Esportes de marca",
  "Esportes de precisão",
  "Esportes de invasão",
  "Esportes de rede/parede",
  "Esportes de campo e taco",
  "Esportes de combate",
  "Ginástica geral",
  "Ginástica de condicionamento físico",
  "Ginástica de conscientização corporal",
  "Danças do contexto comunitário e regional",
  "Danças populares do Brasil e do mundo",
  "Danças de matriz indígena e africana",
  "Danças urbanas",
  "Lutas do contexto comunitário e regional",
  "Lutas de matriz indígena e africana",
  "Lutas do Brasil",
  "Lutas do mundo",
  "Práticas corporais de aventura na natureza",
  "Práticas corporais de aventura urbanas"
];

const SKILLS = [
  { id: "EF12EF01", text: "(EF12EF01) Experimentar, fruir e recriar diferentes brincadeiras e jogos da cultura popular, reconhecendo e respeitando as diferenças individuais de desempenho dos colegas." },
  { id: "EF12EF02", text: "(EF12EF02) Explicar, por meio de múltiplas linguagens (corporal, visual, oral e escrita), as brincadeiras e os jogos populares do contexto comunitário e regional, reconhecendo e valorizando a importância desses jogos e brincadeiras para suas culturas de origem." },
  { id: "EF12EF03", text: "(EF12EF03) Planejar e utilizar estratégias para resolver desafios de brincadeiras e jogos populares do contexto comunitário e regional, com base no reconhecimento das características dessas práticas." },
  { id: "EF12EF04", text: "(EF12EF04) Colaborar na proposição e na produção de alternativas para a prática, em outros momentos e espaços, de brincadeiras e jogos e demais práticas corporais tematizadas na escola, produzindo textos (orais, escritos, audiovisuais) para divulgá-las na escola e na comunidade." },
  { id: "EF35EF01", text: "(EF35EF01) Experimentar e fruir brincadeiras e jogos populares do Brasil e do mundo, incluindo aqueles de matriz indígena e africana, e recriá-los, valorizando a importância desse patrimônio histórico cultural." }
];

const RESOURCES_LIST = [
  "Textos;", "Imagens;", "Vídeos;", "Cordas;", "Bolas;", "Cones;", "Tatames;", "Bambolês;"
];

const FIXED_METHODOLOGY_TEXT = [
  "Aprendizagem baseada na experimentação: permitir que as crianças vivenciam diferentes jogos e brincadeiras",
  "Rodas de conversa: discutir regras, origens culturais e variações dos jogos",
  "Atividades desenvolvidas:"
];

const FIXED_EVALUATION_TEXT = "A avaliação acontecerá de forma processual e contínua, centrada na participação, assiduidade no interesse e compromisso com as atividades propostas.";

const FIXED_ADAPTATION_TEXT = "A Adaptação Curricular tem como objetivos garantir a segurança, bem estar, construir vínculo, estimular a participação, percepção, compreensão e promover a inclusão de todas as crianças/estudantes.";

const App: React.FC = () => {
  const [data, setData] = useState<PlanningData>({
    unidadeEscolar: '',
    professor: '',
    mes: '',
    anoTurma: '',
    observacoes: '',
    rows: [{
      id: Math.random().toString(36).substr(2, 9),
      unidadeTematica: '',
      objetoConhecimento: '',
      habilidades: '',
      estrategias: '',
      recursos: '',
      avaliacao: '',
      adaptacao: ''
    }]
  });

  const [isAiLoading, setIsAiLoading] = useState<string | null>(null);

  const handleInputChange = (field: keyof Omit<PlanningData, 'rows'>, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleRowChange = (id: string, field: keyof PlanningRow, value: string) => {
    setData(prev => ({
      ...prev,
      rows: prev.rows.map(row => row.id === id ? { ...row, [field]: value } : row)
    }));
  };

  const toggleSkill = (rowId: string, skillText: string) => {
    const row = data.rows.find(r => r.id === rowId);
    if (!row) return;
    let current = row.habilidades;
    if (current.includes(skillText)) {
      current = current.replace(skillText, '').replace(/\n\n+/g, '\n').trim();
    } else {
      current = current ? `${current}\n\n${skillText}` : skillText;
    }
    handleRowChange(rowId, 'habilidades', current);
  };

  const toggleResource = (rowId: string, resource: string) => {
    const row = data.rows.find(r => r.id === rowId);
    if (!row) return;
    let current = row.recursos;
    if (current.includes(resource)) {
      current = current.replace(resource, '').replace(/, ,+/g, ',').replace(/^, |, $/g, '').trim();
    } else {
      current = current ? `${current} ${resource}` : resource;
    }
    handleRowChange(rowId, 'recursos', current);
  };

  const addRow = () => {
    setData(prev => ({
      ...prev,
      rows: [...prev.rows, {
        id: Math.random().toString(36).substr(2, 9),
        unidadeTematica: '',
        objetoConhecimento: '',
        habilidades: '',
        estrategias: '',
        recursos: '',
        avaliacao: '',
        adaptacao: ''
      }]
    }));
  };

  const removeRow = (id: string) => {
    if (data.rows.length === 1) return;
    setData(prev => ({
      ...prev,
      rows: prev.rows.filter(row => row.id !== id)
    }));
  };

  const handleAiSuggest = async (id: string, tema: string, objeto: string) => {
    if (!tema && !objeto) return;
    setIsAiLoading(id);
    const suggestions = await suggestEducationalContent(`Unidade: ${tema}, Objeto: ${objeto}`);
    if (suggestions) {
      setData(prev => ({
        ...prev,
        rows: prev.rows.map(row => row.id === id ? { 
          ...row, 
          habilidades: suggestions.habilidades,
          estrategias: suggestions.estrategias,
          recursos: suggestions.recursos,
          avaliacao: suggestions.avaliacao,
          adaptacao: suggestions.adaptacao
        } : row)
      }));
    }
    setIsAiLoading(null);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg shadow-inner"><SparklesIcon className="w-6 h-6 text-white" /></div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">PLANEJAMENTO PRO</h1>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg">
          <PrinterIcon className="w-5 h-5" />
          <span>EXPORTAR PDF</span>
        </button>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 md:p-8 print-container">
        
        {/* CABEÇALHO COMPACTO PARA O PDF (Baseado no Modelo 2) */}
        <div className="hidden print:block mb-4 border-b-2 border-black pb-2">
          <div className="flex items-center gap-6 mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bras%C3%A3o_de_Hortol%C3%A2ndia.png/1200px-Bras%C3%A3o_de_Hortol%C3%A2ndia.png" 
              className="w-16 h-16 object-contain" 
            />
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-black text-slate-700 uppercase">Planejamento Mensal</h1>
            </div>
            <div className="w-16"></div>
          </div>
          <div className="grid grid-cols-2 gap-y-1 text-[10px] font-medium uppercase">
            <div><span className="font-black">Unidade Escolar:</span> {data.unidadeEscolar || 'EMEF'}</div>
            <div><span className="font-black">Professor(a):</span> {data.professor || 'José João Silva Silva'}</div>
            <div><span className="font-black">Mês:</span> {data.mes || 'Fevereiro'}</div>
            <div><span className="font-black">Ano/Turma:</span> {data.anoTurma || '1º e 2º anos'}</div>
          </div>
        </div>

        {/* CABEÇALHO DE EDIÇÃO (Visível apenas na tela) */}
        <div className="no-print flex flex-col gap-6 mb-8 border-b-4 border-slate-900 pb-6">
          <div className="flex items-center gap-6">
             <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center p-1 bg-white border-2 border-slate-900 rounded-full overflow-hidden shadow-md">
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bras%C3%A3o_de_Hortol%C3%A2ndia.png/1200px-Bras%C3%A3o_de_Hortol%C3%A2ndia.png" className="w-full h-full object-contain" />
             </div>
             <div className="flex flex-col justify-center">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Prefeitura de Hortolândia</h3>
               <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mt-2 border-l-8 border-emerald-600 pl-4">Planejamento Mensal</h2>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <input type="text" placeholder="Unidade Escolar" value={data.unidadeEscolar} onChange={(e) => handleInputChange('unidadeEscolar', e.target.value)} className="border-b-2 border-slate-200 outline-none p-2 font-bold focus:border-emerald-500" />
            <input type="text" placeholder="Professor(a)" value={data.professor} onChange={(e) => handleInputChange('professor', e.target.value)} className="border-b-2 border-slate-200 outline-none p-2 font-bold focus:border-emerald-500" />
            <input type="text" placeholder="Mês / Ano" value={data.mes} onChange={(e) => handleInputChange('mes', e.target.value)} className="border-b-2 border-slate-200 outline-none p-2 font-bold focus:border-emerald-500" />
            <input type="text" placeholder="Ano / Turma" value={data.anoTurma} onChange={(e) => handleInputChange('anoTurma', e.target.value)} className="border-b-2 border-slate-200 outline-none p-2 font-bold focus:border-emerald-500" />
          </div>
        </div>

        {/* TABELA DE PLANEJAMENTO */}
        <div className="overflow-hidden border-2 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] print:shadow-none print:border-none">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="w-[15%]">Unidade Temática</th>
                <th className="w-[20%]">Habilidades</th>
                <th className="w-[20%]">Estratégias</th>
                <th className="w-[15%]">Recursos</th>
                <th className="w-[15%]">Avaliação</th>
                <th className="w-[15%]">Adaptação</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id} className="border-b border-black print:break-inside-auto">
                  <td className="align-top">
                    <div className="no-print mb-2 flex flex-col gap-1">
                      <select className="text-[9px] p-1 border font-bold" value={row.unidadeTematica} onChange={(e) => handleRowChange(row.id, 'unidadeTematica', e.target.value)}>
                        <option value="">+ Unidade</option>
                        {THEMATIC_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <select className="text-[9px] p-1 border" value={row.objetoConhecimento} onChange={(e) => handleRowChange(row.id, 'objetoConhecimento', e.target.value)}>
                        <option value="">+ Objeto</option>
                        {KNOWLEDGE_OBJECTS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <button onClick={() => handleAiSuggest(row.id, row.unidadeTematica, row.objetoConhecimento)} className="p-1 bg-emerald-600 text-white text-[8px] font-black rounded uppercase">IA Sugerir</button>
                    </div>
                    <div className="text-red-600 font-bold uppercase">{row.unidadeTematica}</div>
                    <div className="text-red-600 text-[10px] mt-2">{row.objetoConhecimento}</div>
                  </td>
                  <td className="align-top">
                    <div className="no-print max-h-20 overflow-auto border mb-1">
                      {SKILLS.map(s => <div key={s.id} onClick={() => toggleSkill(row.id, s.text)} className="text-[8px] p-1 cursor-pointer hover:bg-slate-100">{s.id}</div>)}
                    </div>
                    <textarea value={row.habilidades} onChange={(e) => handleRowChange(row.id, 'habilidades', e.target.value)} className="text-blue-700 font-bold h-full min-h-[150px]" />
                  </td>
                  <td className="align-top">
                    <div className="text-red-600 text-[9px] mb-2 font-bold">
                      {FIXED_METHODOLOGY_TEXT.map((t, i) => <p key={i}>{t}</p>)}
                    </div>
                    <textarea value={row.estrategias} onChange={(e) => handleRowChange(row.id, 'estrategias', e.target.value)} className="text-red-600 min-h-[100px]" />
                  </td>
                  <td className="align-top">
                    <div className="no-print flex flex-wrap gap-1 mb-1">
                      {RESOURCES_LIST.map(r => <button key={r} onClick={() => toggleResource(row.id, r)} className="text-[8px] bg-slate-200 px-1 rounded">{r}</button>)}
                    </div>
                    <textarea value={row.recursos} onChange={(e) => handleRowChange(row.id, 'recursos', e.target.value)} className="text-red-600" />
                  </td>
                  <td className="align-top">
                    <div className="text-[9px] mb-2 font-medium">{FIXED_EVALUATION_TEXT}</div>
                    <textarea value={row.avaliacao} onChange={(e) => handleRowChange(row.id, 'avaliacao', e.target.value)} className="text-red-600" />
                  </td>
                  <td className="align-top">
                    <div className="text-[9px] mb-2 font-medium">{FIXED_ADAPTATION_TEXT}</div>
                    <textarea value={row.adaptacao} onChange={(e) => handleRowChange(row.id, 'adaptacao', e.target.value)} />
                    <button onClick={() => removeRow(row.id)} className="no-print mt-2 text-red-500"><TrashIcon className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="no-print p-4 bg-slate-50 flex justify-center border-t border-black">
            <button onClick={addRow} className="flex items-center gap-2 bg-white border-2 border-black px-6 py-2 rounded-full font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <PlusIcon className="w-4 h-4" /> ADICIONAR UNIDADE
            </button>
          </div>
          <div className="p-4 bg-white border-t border-black">
            <label className="font-black text-[10px] uppercase">Observações:</label>
            <textarea value={data.observacoes} onChange={(e) => handleInputChange('observacoes', e.target.value)} className="h-12 text-red-600" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
