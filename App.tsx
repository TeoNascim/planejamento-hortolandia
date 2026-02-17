
import React, { useState } from 'react';
import { PlanningData, PlanningRow } from './types';
import { suggestEducationalContent } from './services/geminiService';
import { 
  PlusIcon, 
  TrashIcon, 
  PrinterIcon, 
  SparklesIcon
} from '@heroicons/react/24/outline';

const THEMATIC_UNITS = [
  "Brincadeiras e Jogos",
  "Esportes",
  "Ginásticas",
  "Danças",
  "Lutas",
  "Práticas Corporais de Aventura"
];

const SKILLS = [
  { id: "EF12EF01", text: "EF12EF01: Experimentar, fruir e recriar diferentes brincadeiras e jogos da cultura popular, reconhecendo e respeitando as diferenças individuais de desempenho dos colegas." },
  { id: "EF12EF02", text: "(EF12EF02) Explicar, por meio de múltiplas linguagens (corporal, visual, oral e escrita), as brincadeiras e os jogos populares do contexto comunitário e regional, reconhecendo e valorizando a importância desses jogos e brincadeiras para suas culturas de origem." },
  { id: "EF12EF03", text: "EF12EF03: Planejar e utilizar estratégias para resolver desafios de brincadeiras e jogos populares do contexto comunitário e regional, com base no reconhecimento das características dessas práticas." },
  { id: "EF12EF04", text: "(EF12EF04) Colaborar na proposição e na produção de alternativas para a prática de brincadeiras e jogos tematizadas na escola." },
  { id: "EF12EF05", text: "(EF12EF05) Experimentar e fruir, prezando pelo trabalho coletivo e pelo protagonismo, a prática de esportes de marca e de precisão." },
  { id: "EF12EF06", text: "(EF12EF06) Discutir a importância da observação das normas e das regras dos esportes de marca e de precisão." },
  { id: "EF12EF07", text: "(EF12EF07) Experimentar, fruir e identificar differentes elementos básicos da ginástica (equilíbrios, saltos, giros, rotações, acrobacias, com e sem materiais) e da ginástica geral, de forma individual e em pequenos grupos, adotando procedimentos de segurança." },
  { id: "EF12EF08", text: "(EF12EF08) Planejar e utilizar estratégias para a execução de diferentes elementos básicos da ginástica e da ginástica geral." },
  { id: "EF35EF01", text: "(EF35EF01) Experimentar e fruir brincadeiras e jogos populares do Brasil e do mundo, incluindo those of matriz indígena e africana." },
  { id: "EF35EF02", text: "(EF35EF02) Planejar e utilizar estratégias para possibilitar a participação segura de todos os alunos." },
  { id: "EF35EF13", text: "(EF35EF13) Experimentar, fruir e recriar diferentes lutas presentes no contexto comunitário e regional." }
];

const RESOURCES_LIST = [
  "Apito profissional", "Bolas de Futsal", "Bolas de Voleibol", "Bolas de Basquetebol", "Bolas de Handebol",
  "Bolas de Borracha", "Cones", "Arcos (Bambolês)", "Colchonetes", "Coletes coloridos", "Petecas", 
  "Raquetes de Tênis de Mesa", "Caixa de som Bluetooth", "Corda", "Tatames", "Giz escolar", "Fita Crepe", "Musica", "Quadra", "Folha de sulfite"
];

const FIXED_METHODOLOGY_HEADER = [
  "- Aprendizagem baseada na experimentação e fruição: permitir que as crianças vivenciem, criem e recriem diferentes jogos e brincadeiras da cultura popular geral.",
  "- Rodas de conversa: realização da chamada, apresentação das atividades, discutir regras, origens e histórias culturais e variações dos jogos.",
  "Atividades desenvolvidas:"
];

const FIXED_EVALUATION_HEADER = [
  "- A avaliação acontecerá de forma processual e contínua, centrada na participação, assiduidade no interesse e compromisso com as atividades propostas.",
  "- Desenvolvimento progressivo;",
  "- Autonomia nas atividades;",
  "- Noção espaço-temporal;",
  "- Habilidades motoras etc.",
  "- Realização da coreografia."
];

const FIXED_ADAPTATION_HEADER = [
  "A Adaptação Curricular tem como objetivos garantir a segurança, bem estar, construir vínculo, estimular a participação, percepção, compreensão e promover a inclusão de todas as crianças/estudantes (pessoa com deficiência PCD, TEA, pessoa sem deficiência) nas atividades propostas.",
  "Para adaptar uma atividade são necessárias algumas ações importantes que requerem atenção e conhecimento de quais são as adaptações e necessidades que a criança/estudante precisa como, por exemplo, auxílio para se locomover, ajuste no tempo de permanência na atividade, dificuldade para ouvir, enxergar, compreender a atividade proposta.",
  "Ações:",
  "● Estimular a participação e interação com o grupo mesmo que seja por ouvir o que está sendo dito ou se tiver dificuldade de ouvir ou for surda, verificar se há intérprete de LIBRAS, posicionar a pessoa de frente para quem está falando ou onde está acontecendo a atividade para facilitar e viabilizar a compreensão, identificar o foco da atividade proposta;",
  "● No decorrer da explicação direcionar a fala à todas as crianças/estudantes (pessoa com deficiência PCD, TEA, pessoa sem deficiência), independente, de condições físicas ou intelectuais de respostas;",
  "● Observar posicionamento das crianças/estudantes todos envolvidos na atividade, exemplo, no caso de crianças/estudantes que fazem uso da cadeira de rodas, se a cadeira está posicionada de modo que a atividade, participantes estão dentro do seu campo visual;",
  "● Oferecer possibilidades de participação no processo de construção das atividades para que possa ser feito um trabalho de estimulação sensorial, por meio de, sentir as texturas formas, pesos, sejam eles: bolas, cones, cordas, bambolês, cola, papéis, lápis, materiais diversos;",
  "● Posicionar a PCD, TEA onde ela possa ver o que está se passando ao seu redor e na atividade, isto favorece o aprendizado da noção do espaço, entendimento da dinâmica da atividade em si, comportamento dos participantes e sequência, como a sua vez de jogar ou brincar, por exemplo."
];

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
      current = current ? `${current}\n\n- ${skillText}` : `- ${skillText}`;
    }
    handleRowChange(rowId, 'habilidades', current);
  };

  const toggleResource = (rowId: string, resource: string) => {
    const row = data.rows.find(r => r.id === rowId);
    if (!row) return;
    let current = row.recursos;
    if (current.includes(resource)) {
      current = current.replace(`- ${resource}`, '').replace(/\n\n+/g, '\n').trim();
    } else {
      current = current ? `${current}\n- ${resource}` : `- ${resource}`;
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
    setData(prev => ({ ...prev, rows: prev.rows.filter(row => row.id !== id) }));
  };

  const handleAiSuggest = async (id: string, tema: string, objeto: string) => {
    if (!tema && !objeto) return;
    setIsAiLoading(id);
    const suggestions = await suggestEducationalContent(`Unidade: ${tema}, Objeto: ${objeto}`);
    if (suggestions) {
      setData(prev => ({ ...prev, rows: prev.rows.map(row => row.id === id ? { ...row, ...suggestions } : row) }));
    }
    setIsAiLoading(null);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      
      {/* 1. INTERFACE DE EDIÇÃO (Visível apenas na tela) */}
      <header className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg"><SparklesIcon className="w-6 h-6 text-white" /></div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">PLANEJAMENTO PRO</h1>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-all">
          <PrinterIcon className="w-5 h-5" /> EXPORTAR / IMPRIMIR
        </button>
      </header>

      <main className="no-print max-w-[1400px] mx-auto p-4 md:p-8">
        <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 shadow-xl mb-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 border-2 border-slate-200 rounded-full p-2 bg-slate-50">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bras%C3%A3o_de_Hortol%C3%A2ndia.png/1200px-Bras%C3%A3o_de_Hortol%C3%A2ndia.png" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 uppercase leading-none">Editor de Planejamento</h2>
              <p className="font-bold text-slate-400 mt-1 uppercase tracking-widest text-sm">Prefeitura Municipal de Hortolândia</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Unidade Escolar</label>
              <input type="text" value={data.unidadeEscolar} onChange={(e) => handleInputChange('unidadeEscolar', e.target.value)} placeholder="Ex: EMEF Lilian Araujo" className="w-full border-b-2 p-2 outline-none font-bold text-slate-700 focus:border-emerald-500 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Professor(a) / Agentes</label>
              <input type="text" value={data.professor} onChange={(e) => handleInputChange('professor', e.target.value)} placeholder="Nome completo" className="w-full border-b-2 p-2 outline-none font-bold text-slate-700 focus:border-emerald-500 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Mês de Referência</label>
              <input type="text" value={data.mes} onChange={(e) => handleInputChange('mes', e.target.value)} placeholder="Ex: Abril" className="w-full border-b-2 p-2 outline-none font-bold text-slate-700 focus:border-emerald-500 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Ano e Turma</label>
              <input type="text" value={data.anoTurma} onChange={(e) => handleInputChange('anoTurma', e.target.value)} placeholder="Ex: 1º e 2º anos" className="w-full border-b-2 p-2 outline-none font-bold text-slate-700 focus:border-emerald-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {data.rows.map((row, index) => (
            <div key={row.id} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg group">
              <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center">
                <span className="font-black text-xs tracking-widest uppercase">Unidade Didática #{index + 1}</span>
                <button onClick={() => removeRow(row.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-3 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Unidade Temática</label>
                    <select className="w-full p-2 border-2 rounded-lg font-bold text-sm" value={row.unidadeTematica} onChange={(e) => handleRowChange(row.id, 'unidadeTematica', e.target.value)}>
                      <option value="">Selecione...</option>
                      {THEMATIC_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Objeto de Conhecimento</label>
                    <textarea value={row.objetoConhecimento} onChange={(e) => handleRowChange(row.id, 'objetoConhecimento', e.target.value)} className="w-full h-32 p-3 border-2 rounded-lg text-sm font-medium" placeholder="Descreva o conteúdo..." />
                  </div>
                  <button onClick={() => handleAiSuggest(row.id, row.unidadeTematica, row.objetoConhecimento)} className="w-full bg-emerald-600 text-white py-2 rounded-lg font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                    <SparklesIcon className="w-4 h-4" /> Sugerir com IA
                  </button>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Habilidades (BNCC)</label>
                  <div className="mb-3 flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 border rounded bg-slate-50">
                    {SKILLS.map(s => (
                      <button key={s.id} onClick={() => toggleSkill(row.id, s.text)} className="text-[9px] font-bold px-2 py-1 rounded bg-white border border-slate-200 hover:bg-emerald-50">{s.id}</button>
                    ))}
                  </div>
                  <textarea value={row.habilidades} onChange={(e) => handleRowChange(row.id, 'habilidades', e.target.value)} className="w-full h-48 p-3 border-2 rounded-lg text-[11px] font-bold text-blue-900" />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Estratégias / Atividades</label>
                  <textarea value={row.estrategias} onChange={(e) => handleRowChange(row.id, 'estrategias', e.target.value)} className="w-full h-[320px] p-3 border-2 rounded-lg text-[11px]" />
                </div>

                <div className="md:col-span-3 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Recursos</label>
                    <div className="mb-3 flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 border rounded bg-slate-50">
                      {RESOURCES_LIST.map(r => (
                        <button key={r} onClick={() => toggleResource(row.id, r)} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:bg-blue-50">{r}</button>
                      ))}
                    </div>
                    <textarea value={row.recursos} onChange={(e) => handleRowChange(row.id, 'recursos', e.target.value)} className="w-full h-24 p-3 border-2 rounded-lg text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Avaliação</label>
                    <textarea value={row.avaliacao} onChange={(e) => handleRowChange(row.id, 'avaliacao', e.target.value)} className="w-full h-24 p-3 border-2 rounded-lg text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Adaptação Curricular</label>
                    <textarea value={row.adaptacao} onChange={(e) => handleRowChange(row.id, 'adaptacao', e.target.value)} className="w-full h-24 p-3 border-2 rounded-lg text-[11px]" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={addRow} className="w-full py-6 border-4 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-emerald-400 hover:text-emerald-500 transition-all bg-white/50">
            <PlusIcon className="w-10 h-10" />
            <span className="font-black uppercase tracking-widest text-sm">Adicionar Nova Unidade ao Planejamento</span>
          </button>
        </div>

        <div className="mt-10 bg-white p-8 rounded-2xl border-2 border-slate-200 shadow-xl">
          <label className="block font-black text-slate-900 uppercase text-xs mb-4 border-l-4 border-emerald-600 pl-4">Observações Adicionais (Mês)</label>
          <textarea value={data.observacoes} onChange={(e) => handleInputChange('observacoes', e.target.value)} className="w-full h-32 p-4 border-2 rounded-xl text-sm" placeholder="Anote ocorrências ou lembretes importantes..." />
        </div>
      </main>

      {/* 2. LAYOUT DE IMPRESSÃO (Fiel ao anexo, visível apenas no PDF/Impressora) */}
      <div className="print-only-layout">
        {/* Cabeçalho superior */}
        <div className="flex items-start mb-4">
           <div className="w-24 h-24 flex-shrink-0">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bras%C3%A3o_de_Hortol%C3%A2ndia.png/1200px-Bras%C3%A3o_de_Hortol%C3%A2ndia.png" className="w-full object-contain" />
           </div>
           <div className="flex-grow text-center">
             <h1 className="text-xl font-bold text-emerald-800 mb-4">Planejamento Mensal</h1>
             <div className="text-left ml-4 space-y-1 text-[11px] font-medium text-slate-700">
               <p><strong>Unidade Escolar:</strong> {data.unidadeEscolar || "________________________________________________"}</p>
               <p><strong>Professor(a) / Agentes Educacionais:</strong> {data.professor || "________________________________________________"}</p>
               <p><strong>Mês:</strong> {data.mes || "__________________"}</p>
             </div>
           </div>
        </div>

        {/* Faixa de Turma */}
        <div className="turma-bar">
          Ano/Turma: {data.anoTurma || "Não informado"}
        </div>

        {/* Tabela Principal */}
        <table>
          <thead>
            <tr>
              <th className="w-[18%]">Unidade Temática/<br/>Objeto de Conhecimento</th>
              <th className="w-[18%]">Habilidades</th>
              <th className="w-[20%]">Estratégias Metodológicas</th>
              <th className="w-[14%]">Recursos</th>
              <th className="w-[15%]">Avaliação</th>
              <th className="w-[15%]">Adaptação curricular</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.id}>
                {/* Unidade/Objeto */}
                <td>
                  <div className="font-bold mb-2 uppercase">{row.unidadeTematica}</div>
                  <div className="whitespace-pre-wrap">{row.objetoConhecimento}</div>
                </td>
                
                {/* Habilidades */}
                <td>
                  <div className="whitespace-pre-wrap">{row.habilidades}</div>
                </td>

                {/* Estratégias */}
                <td>
                  <div className="space-y-2">
                    {FIXED_METHODOLOGY_HEADER.map((t, i) => (
                      <p key={i} className={i === 2 ? "font-bold mt-2" : ""}>{t}</p>
                    ))}
                    <div className="whitespace-pre-wrap">{row.estrategias}</div>
                  </div>
                </td>

                {/* Recursos */}
                <td>
                  <div className="whitespace-pre-wrap">{row.recursos}</div>
                </td>

                {/* Avaliação */}
                <td>
                  <div className="space-y-2">
                    {FIXED_EVALUATION_HEADER.map((t, i) => (
                      <p key={i}>{t}</p>
                    ))}
                    <div className="whitespace-pre-wrap">{row.avaliacao}</div>
                  </div>
                </td>

                {/* Adaptação */}
                <td>
                  <div className="space-y-2">
                    {FIXED_ADAPTATION_HEADER.map((t, i) => (
                      <p key={i}>{t}</p>
                    ))}
                    <div className="whitespace-pre-wrap">{row.adaptacao}</div>
                  </div>
                </td>
              </tr>
            ))}
            {/* Linha de Observações dentro da tabela ou logo abaixo conforme o estilo */}
            <tr>
               <td colSpan={6} className="p-0 border-t-2 border-black">
                 <div className="p-2">
                    <strong className="text-[11px] block mb-1">Observações:</strong>
                    <p className="whitespace-pre-wrap">{data.observacoes || "-"}</p>
                 </div>
               </td>
            </tr>
          </tbody>
        </table>

        {/* Rodapé de Assinaturas (Espaçamento para baixo) */}
        <div className="mt-16 flex justify-around items-end">
            <div className="flex flex-col items-center">
              <div className="w-64 border-b border-black mb-1"></div>
              <span className="text-[10px] font-bold uppercase">Assinatura Professor(a)</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-64 border-b border-black mb-1"></div>
              <span className="text-[10px] font-bold uppercase">Visto Coordenação</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
