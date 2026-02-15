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
  { id: "EF12EF01", text: "EF12EF01: Experimentar, fruir e recriar diferentes brincadeiras e jogos da cultura popular, reconhecendo e respeitando as diferenças individuais de desempenho dos colegas." },
  { id: "EF12EF02", text: "(EF12EF02) Explicar, por meio de múltiplas linguagens (corporal, visual, oral e escrita), as brincadeiras e os jogos populares do contexto comunitário e regional, reconhecendo e valorizando a importância desses jogos e brincadeiras para suas culturas de origem." },
  { id: "EF12EF03", text: "EF12EF03: Planejar e utilizar estratégias para resolver desafios de brincadeiras e jogos populares do contexto comunitário e regional, com base no reconhecimento das características dessas práticas." },
  { id: "EF12EF04", text: "(EF12EF04) Colaborar na proposição e na produção de alternativas para a prática, em outros momentos e espaços, de brincadeiras e jogos e demais práticas corporais tematizadas na escola, produzindo textos (orais, escritos, audiovisuais) para divulgá-las na escola e na comunidade." },
  { id: "EF12EF05", text: "(EF12EF05) Experimentar e fruir, prezando pelo trabalho coletivo e pelo protagonismo, a prática de esportes de marca e de precisão, identificando os elementos comuns a esses esportes." },
  { id: "EF12EF06", text: "(EF12EF06) Discutir a importância da observação das normas e das regras dos esportes de marca e de precisão para assegurar a integridade própria e as dos demais participantes." },
  { id: "EF12EF07", text: "(EF12EF07) Experimentar, fruir e identificar differentes elementos básicos da ginástica (equilíbrios, saltos, giros, rotações, acrobacias, com e sem materiais) e da ginástica geral, de forma individual e em pequenos grupos, adotando procedimentos de segurança." },
  { id: "EF12EF08", text: "(EF12EF08) Planejar e utilizar estratégias para a execução de differentes elementos básicos da ginástica e da ginástica geral." },
  { id: "EF12EF09", text: "(EF12EF09) Participar da ginástica geral, identificando as potencialidades e os limites do corpo, e respeitando as diferenças individuais e de desempenho corporal." },
  { id: "EF12EF10", text: "(EF12EF10) Descrever, por meio de múltiplas linguagens (corporal, oral, escrita e audiovisual), as características dos elementos básicos da ginástica e da ginástica geral, identificando a presença desses elementos em distintas práticas corporais." },
  { id: "EF12EF11", text: "(EF12EF11) Experimentar e fruir diferentes danças do contexto comunitário e regional (rodas cantadas, brincadeiras rítmicas e expressivas), e recriá-las, respeitando as diferenças individuais e de desempenho corporal." },
  { id: "EF35EF01", text: "(EF35EF01) Experimentar e fruir brincadeiras e jogos populares do Brasil e do mundo, incluindo aqueles de matriz indígena e africana, e recriá-los, valorizando a importância desse patrimônio histórico cultural." },
  { id: "EF35EF02", text: "(EF35EF02) Planejar e utilizar estratégias para possibilitar a participação segura de todos os alunos em brincadeiras e jogos populares do Brasil e de matriz indígena e africana." },
  { id: "EF35EF03", text: "(EF35EF03) Descrever, por meio de múltiplas linguagens (corporal, oral, escrita, audiovisual), as brincadeiras e os jogos populares do Brasil e de matriz indígena e africana, explicando suas características e a importância desse patrimônio histórico cultural na preservação das differentes culturas." },
  { id: "EF35EF04", text: "(EF35EF04) Recriar, individual e coletivamente, e experimentar, na escola e fora dela, brincadeiras e jogos populares do Brasil e do mundo, incluindo aqueles de matriz indígena e africana, e demais práticas corporais tematizadas na escola, adequando-as aos espaços públicos disponíveis." },
  { id: "EF35EF05", text: "(EF35EF05) Experimentar e fruir diversos tipos de esportes de campo, taco, rede/parede e invasão, identificando seus elementos comuns e criando estratégias individuais e coletivas básicas para sua execução, prezando pelo trabalho coletivo e pelo protagonismo." },
  { id: "EF35EF06", text: "(EF35EF06) Diferenciar os conceitos de jogo e esporte, identificando as características que os constituem na contemporaneidade e suas manifestações (profissional e comunitária/lazer)." },
  { id: "EF35EF08", text: "(EF35EF08) Planejar e utilizar estratégias para resolver desafios na execução de elementos básicos de apresentações coletivas de ginástica geral, reconhecendo as potencialidades e os limites do corpo e adotando procedimentos de segurança." },
  { id: "EF35EF09", text: "(EF35EF09) Experimentar, recriar e fruir danças populares do Brasil e do mundo e danças de matriz indígena e africana, valorizando e respeitando os diferentes sentidos e significados dessas danças em suas culturas de origem." },
  { id: "EF35EF10", text: "(EF35EF10) Comparar e identificar os elementos constitutivos comuns e differentes (ritmo, espaço, gestos) em danças populares do Brasil e do mundo e danças de matriz indígena e africana." },
  { id: "EF35EF11", text: "(EF35EF11) Formular e utilizar estratégias para a execução de elementos constitutivos das danças populares do Brasil e do mundo, e das danças de matriz indígena e africana." },
  { id: "EF35EF12", text: "(EF35EF12) Identificar situações de injustiça e preconceito geradas e/ou presentes no contexto das danças e demais práticas corporais e discutir alternativas para superá-las." },
  { id: "EF35EF13", text: "(EF35EF13) Experimentar, fruir e recriar diferentes lutas presentes no contexto comunitário e regional e lutas de matriz indígena e africana." }
];

const RESOURCES_LIST = [
  "Apito profissional", "Bolas de Futsal", "Bolas de Voleibol", "Bolas de Basquetebol", "Bolas de Handebol",
  "Bolas de Borracha (nº 8 e 10)", "Bolas de Iniciação (Soft)", "Cones demarcatórios altos", "Cones tipo chapéu chinês",
  "Cordas individuais de nylon", "Cordas coletivas (5 metros+)", "Arcos (Bambolês) plásticos", "Colchonetes de densidade 33",
  "Coletes numerados coloridos", "Bastões de PVC/Madeira", "Petecas de penas", "Raquetes de Tênis de Mesa",
  "Bolinhas de Tênis de Mesa", "Raquetes de Badminton", "Petecas de Badminton (Volantes)", "Redes de Vôlei/Futsal",
  "Cronômetro digital", "Fita Métrica/Trena", "Caixa de som Bluetooth", "Microfone sem fio", "Pen drive com trilhas rítmicas",
  "Escada de agilidade", "Barreiras de salto ajustáveis", "Discos de Frisbee", "Sacos de areia para peso",
  "Tatames de EVA", "Vendas para os olhos", "Garrafas PET recicladas", "Pneus de xadrez reciclados", "Giz escolar branco/colorido",
  "Fita Crepe/Adesiva colorida", "Bambolês de encaixe", "Bolas de Pilates (Suiça)", "Elásticos extensores",
  "Pratos demarcatórios", "Túnel de pano lúdico", "Paraquedas lúdico gigante", "Blocos de montar gigantes",
  "Estafetas de madeira", "Arcos de ginástica rítmica", "Fitas de ginástica rítmica", "Massas de ginástica rítmica",
  "Mini-Trampolim", "Banco Sueco", "Espaldar de madeira", "Plinto de salto", "Colchão de queda (Gordão)"
];

const FIXED_METHODOLOGY_TEXT = [
  "Aprendizagem baseada na experimentação e fruição: permitir que as crianças vivenciem, criem e recriem diferentes jogos e brincadeiras da cultura popular geral.",
  "- Rodas de conversa: realização da chamada, apresentação das atividades, discutir regras, origens e histórias culturais e variações dos jogos.",
  "Atividades desenvolvidas:"
];

const FIXED_EVALUATION_TEXT = "A avaliação acontecerá de forma processual e contínua, centrada na participação, assiduidade no interesse e compromisso com as atividades propostas.";

const FIXED_ADAPTATION_TEXT = [
  "A Adaptação Curricular busca garantir segurança, bem-estar, participação e inclusão de todos os estudantes (PCD, TEA e sem deficiência) nas atividades propostas.",
  "Para isso, é necessário conhecer as necessidades individuais, como apoio na locomoção, ajustes no tempo, dificuldades auditivas, visuais ou de compreensão.",
  "Entre as principais ações estão: garantir comunicação acessível a todos, organizar o posicionamento adequado dos estudantes (especialmente cadeirantes), estimular a participação e interação no grupo e oferecer diferentes formas de envolvimento, inclusive com estímulos sensoriais e materiais variados, favorecendo a compreensão da atividade e do espaço."
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

    let currentHabilidades = row.habilidades;
    if (currentHabilidades.includes(skillText)) {
      currentHabilidades = currentHabilidades.replace(skillText, '').replace(/\n\n+/g, '\n').trim();
    } else {
      currentHabilidades = currentHabilidades ? `${currentHabilidades}\n\n${skillText}` : skillText;
    }

    handleRowChange(rowId, 'habilidades', currentHabilidades);
  };

  const toggleResource = (rowId: string, resource: string) => {
    const row = data.rows.find(r => r.id === rowId);
    if (!row) return;

    let currentRecursos = row.recursos;
    if (currentRecursos.includes(resource)) {
      currentRecursos = currentRecursos.replace(resource, '').replace(/, ,+/g, ',').replace(/^, |, $/g, '').trim();
    } else {
      currentRecursos = currentRecursos ? `${currentRecursos}, ${resource}` : resource;
    }

    handleRowChange(rowId, 'recursos', currentRecursos);
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
    if (!tema && !objeto) {
      alert("Por favor, selecione as informações antes de usar a IA.");
      return;
    }
    setIsAiLoading(id);
    const prompt = `Unidade: ${tema}, Objeto: ${objeto}`;
    const suggestions = await suggestEducationalContent(prompt);
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header Bar */}
      <header className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg shadow-inner">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">PLANEJAMENTO PRO</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg active:scale-95"
          >
            <PrinterIcon className="w-5 h-5" />
            <span>EXPORTAR PDF</span>
          </button>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="max-w-[1400px] mx-auto p-4 md:p-8 print-container">
        
        {/* Print Only Header (Compacto conforme solicitado) */}
        <div className="hidden print:block mb-4 border-b-2 border-slate-900 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="w-16 h-16">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bras%C3%A3o_de_Hortol%C3%A2ndia.png/1200px-Bras%C3%A3o_de_Hortol%C3%A2ndia.png" 
                alt="Logo Hortolândia" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex-1 text-center">
              <h2 className="text-lg font-black uppercase text-slate-900">Planejamento Mensal</h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase">Prefeitura Municipal de Hortolândia - Secretaria de Educação</p>
            </div>
            <div className="w-16"></div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div><span className="font-black uppercase">Unidade Escolar:</span> {data.unidadeEscolar}</div>
            <div><span className="font-black uppercase">Professor(a):</span> {data.professor}</div>
            <div><span className="font-black uppercase">Mês/Ano:</span> {data.mes}</div>
            <div><span className="font-black uppercase">Ano/Turma:</span> {data.anoTurma}</div>
          </div>
        </div>

        {/* Screen Only Header (O que o usuário vê na tela) */}
        <div className="no-print flex flex-col gap-6 mb-8 border-b-4 border-slate-900 pb-6">
          <div className="flex items-center gap-6">
             <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 flex items-center justify-center p-1 bg-white border-2 border-slate-900 rounded-full overflow-hidden shadow-md">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bras%C3%A3o_de_Hortol%C3%A2ndia.png/1200px-Bras%C3%A3o_de_Hortol%C3%A2ndia.png" 
                 alt="Logo Hortolândia" 
                 className="w-full h-full object-contain" 
               />
             </div>
             <div className="flex flex-col justify-center">
               <h3 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-widest leading-none">Prefeitura Municipal de Hortolândia</h3>
               <h4 className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider mt-1">Secretaria Municipal de Educação</h4>
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mt-2 border-l-8 border-emerald-600 pl-4 py-1">Planejamento Mensal</h2>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm bg-white p-6 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex flex-col gap-1">
              <label className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Unidade Escolar</label>
              <input 
                type="text" 
                value={data.unidadeEscolar}
                onChange={(e) => handleInputChange('unidadeEscolar', e.target.value)}
                placeholder="Nome da Instituição"
                className="border-b-2 border-slate-300 focus:border-emerald-600 outline-none py-1 font-bold text-slate-800 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Professor(a) / Agentes</label>
              <input 
                type="text" 
                value={data.professor}
                onChange={(e) => handleInputChange('professor', e.target.value)}
                placeholder="Responsáveis pelo planejamento"
                className="border-b-2 border-slate-300 focus:border-emerald-600 outline-none py-1 font-bold text-slate-800 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Período (Mês / Ano)</label>
              <input 
                type="text" 
                value={data.mes}
                onChange={(e) => handleInputChange('mes', e.target.value)}
                placeholder="Ex: Abril/2024"
                className="border-b-2 border-slate-300 focus:border-emerald-600 outline-none py-1 font-bold text-slate-800 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Público-Alvo (Ano / Turma)</label>
              <input 
                type="text" 
                value={data.anoTurma}
                onChange={(e) => handleInputChange('anoTurma', e.target.value)}
                placeholder="Ex: 2º Ciclo - Turma B"
                className="border-b-2 border-slate-300 focus:border-emerald-600 outline-none py-1 font-bold text-slate-800 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Table Structure */}
        <div className="overflow-hidden border-2 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] print:shadow-none print:border-none">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white border-b-2 border-slate-900">
                <th className="border-r border-slate-900 p-2 text-[10px] font-black uppercase text-center leading-tight w-[15%]">Unidade Temática / Objeto de Conhecimento</th>
                <th className="border-r border-slate-900 p-2 text-[10px] font-black uppercase text-center leading-tight w-[18%]">Habilidades</th>
                <th className="border-r border-slate-900 p-2 text-[10px] font-black uppercase text-center leading-tight w-[20%]">Estratégias Metodológicas</th>
                <th className="border-r border-slate-900 p-2 text-[10px] font-black uppercase text-center leading-tight w-[14%]">Recursos</th>
                <th className="border-r border-slate-900 p-2 text-[10px] font-black uppercase text-center leading-tight w-[15%]">Avaliação</th>
                <th className="p-2 text-[10px] font-black uppercase text-center leading-tight w-[18%]">Adaptação Curricular</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id} className="relative group border-b-2 border-slate-900 last:border-b-0 print:break-inside-avoid">
                  {/* Coluna 1: Unidade e Objeto */}
                  <td className="border-r border-slate-900 p-0 align-top">
                    <div className="flex flex-col h-full min-h-[180px] relative">
                      <div className="no-print space-y-1 p-2 bg-slate-50 border-b border-slate-200">
                        <select 
                          className="w-full p-2 outline-none text-[10px] font-black bg-white text-emerald-800 border-2 border-emerald-100 rounded focus:border-emerald-500"
                          value={row.unidadeTematica}
                          onChange={(e) => handleRowChange(row.id, 'unidadeTematica', e.target.value)}
                        >
                          <option value="">+ Unidade Temática</option>
                          {THEMATIC_UNITS.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>

                        <select 
                          className="w-full p-2 outline-none text-[10px] font-bold bg-white text-blue-800 border-2 border-blue-100 rounded focus:border-blue-500"
                          value={row.objetoConhecimento}
                          onChange={(e) => handleRowChange(row.id, 'objetoConhecimento', e.target.value)}
                        >
                          <option value="">+ Objeto de Conhecimento</option>
                          {KNOWLEDGE_OBJECTS.map(obj => (
                            <option key={obj} value={obj}>{obj}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="p-3 text-[11px] print:text-[9px] leading-relaxed text-slate-900">
                        {row.unidadeTematica && <div className="font-black uppercase mb-1 text-emerald-700">{row.unidadeTematica}</div>}
                        {row.objetoConhecimento && <div className="font-semibold text-slate-700">{row.objetoConhecimento}</div>}
                      </div>

                      <button 
                        onClick={() => handleAiSuggest(row.id, row.unidadeTematica, row.objetoConhecimento)}
                        disabled={isAiLoading === row.id}
                        className="no-print absolute bottom-2 right-2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-md flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter"
                      >
                        {isAiLoading === row.id ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin rounded-full" />
                        ) : (
                          <SparklesIcon className="w-3 h-3" />
                        )}
                        <span>Sugerir IA</span>
                      </button>
                    </div>
                  </td>

                  {/* Coluna 2: Habilidades */}
                  <td className="border-r border-slate-900 p-0 align-top">
                    <div className="flex flex-col h-full min-h-[180px] relative">
                      <div className="no-print p-2 bg-slate-50 border-b border-slate-200">
                        <div className="max-h-32 overflow-y-auto border-2 border-slate-200 rounded p-1 bg-white space-y-1">
                          {SKILLS.map((skill) => (
                            <label key={skill.id} className="flex items-start gap-2 p-1 hover:bg-slate-50 cursor-pointer rounded">
                              <input 
                                type="checkbox"
                                checked={row.habilidades.includes(skill.text)}
                                onChange={() => toggleSkill(row.id, skill.text)}
                                className="mt-0.5 w-3 h-3 text-emerald-600"
                              />
                              <span className="text-[9px] font-bold text-slate-600 leading-tight">{skill.id}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <textarea 
                        className="w-full flex-grow p-3 resize-none outline-none text-[11px] print:text-[9px] leading-relaxed font-medium text-slate-800 bg-transparent"
                        placeholder="Habilidades selecionadas..."
                        value={row.habilidades}
                        onChange={(e) => handleRowChange(row.id, 'habilidades', e.target.value)}
                      />
                    </div>
                  </td>

                  {/* Coluna 3: Estratégias Metodológicas */}
                  <td className="border-r border-slate-900 p-0 align-top">
                    <div className="flex flex-col h-full min-h-[180px]">
                      <div className="p-3 bg-slate-50 border-b border-slate-100 text-slate-900">
                        <div className="space-y-1">
                          {FIXED_METHODOLOGY_TEXT.map((text, idx) => (
                            <p key={idx} className={`text-[10px] print:text-[8px] leading-relaxed ${text.includes("Atividades desenvolvidas:") ? 'font-black' : 'font-medium'}`}>
                              {text}
                            </p>
                          ))}
                        </div>
                      </div>
                      
                      <textarea 
                        className="w-full flex-grow p-3 resize-none outline-none text-[11px] print:text-[9px] leading-relaxed font-medium text-slate-800 bg-transparent"
                        placeholder="Atividades específicas..."
                        value={row.estrategias}
                        onChange={(e) => handleRowChange(row.id, 'estrategias', e.target.value)}
                      />
                    </div>
                  </td>

                  {/* Coluna 4: Recursos */}
                  <td className="border-r border-slate-900 p-0 align-top">
                    <div className="flex flex-col h-full min-h-[180px] relative">
                      <div className="no-print p-2 bg-slate-50 border-b border-slate-200">
                        <div className="max-h-32 overflow-y-auto border-2 border-slate-200 rounded p-1 bg-white space-y-1">
                          {RESOURCES_LIST.map((resource) => (
                            <label key={resource} className="flex items-center gap-2 p-1 hover:bg-slate-50 cursor-pointer rounded">
                              <input 
                                type="checkbox"
                                checked={row.recursos.includes(resource)}
                                onChange={() => toggleResource(row.id, resource)}
                                className="w-3 h-3 text-emerald-600"
                              />
                              <span className="text-[9px] font-bold text-slate-600 leading-tight">{resource}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <textarea 
                        className="w-full flex-grow p-3 resize-none outline-none text-[11px] print:text-[9px] leading-relaxed font-medium text-slate-800 bg-transparent"
                        placeholder="Recursos..."
                        value={row.recursos}
                        onChange={(e) => handleRowChange(row.id, 'recursos', e.target.value)}
                      />
                    </div>
                  </td>

                  {/* Coluna 5: Avaliação */}
                  <td className="border-r border-slate-900 p-0 align-top">
                    <div className="flex flex-col h-full min-h-[180px]">
                      <div className="p-3 bg-slate-50 border-b border-slate-100 text-slate-900">
                        <p className="text-[10px] print:text-[8px] font-medium leading-relaxed">
                          {FIXED_EVALUATION_TEXT}
                        </p>
                      </div>
                      
                      <textarea 
                        className="w-full flex-grow p-3 resize-none outline-none text-[11px] print:text-[9px] leading-relaxed font-medium text-slate-800 bg-transparent"
                        placeholder="Mais avaliação..."
                        value={row.avaliacao}
                        onChange={(e) => handleRowChange(row.id, 'avaliacao', e.target.value)}
                      />
                    </div>
                  </td>

                  {/* Coluna 6: Adaptação Curricular */}
                  <td className="p-0 align-top relative">
                    <div className="flex flex-col h-full min-h-[180px]">
                      <div className="p-3 bg-slate-50 border-b border-slate-100 text-slate-900">
                        <div className="space-y-1">
                          {FIXED_ADAPTATION_TEXT.map((text, idx) => (
                            <p key={idx} className="text-[10px] print:text-[8px] font-medium leading-relaxed">
                              {text}
                            </p>
                          ))}
                        </div>
                      </div>
                      
                      <textarea 
                        className="w-full flex-grow p-3 resize-none outline-none text-[11px] print:text-[9px] leading-relaxed font-medium text-slate-800 bg-transparent"
                        placeholder="Mais adaptação..."
                        value={row.adaptacao}
                        onChange={(e) => handleRowChange(row.id, 'adaptacao', e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => removeRow(row.id)}
                      className="no-print absolute -right-10 top-2 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Adicionar Unidade */}
          <div className="no-print p-4 bg-slate-50 flex justify-center border-t-2 border-slate-900">
            <button 
              onClick={addRow}
              className="flex items-center gap-2 bg-white border-2 border-slate-900 hover:bg-slate-900 hover:text-white px-8 py-2 rounded-full transition-all font-black text-xs shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
            >
              <PlusIcon className="w-5 h-5" />
              <span>ADICIONAR UNIDADE DIDÁTICA</span>
            </button>
          </div>
          
          {/* Observações */}
          <div className="border-t-2 border-slate-900 p-4 bg-white min-h-[80px] print:border-t">
            <label className="block font-black text-slate-900 uppercase text-[10px] mb-2 tracking-widest border-l-4 border-emerald-600 pl-2">Observações Adicionais / Ocorrências Mensais</label>
            <textarea 
              value={data.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              className="w-full h-16 resize-none outline-none text-[11px] print:text-[9px] leading-relaxed font-medium text-slate-700 bg-transparent"
              placeholder="Anotações gerais..."
            />
          </div>
        </div>

        {/* Rodapé de Impressão (Compacto) */}
        <div className="mt-8 hidden print:block">
          <div className="flex justify-between items-end border-t border-slate-400 pt-4">
            <div className="text-[8px] text-slate-500 font-bold uppercase">
              Gerado em: {new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR')}
            </div>
            <div className="flex gap-12">
              <div className="flex flex-col items-center">
                <div className="w-48 border-b border-slate-900 mb-1"></div>
                <span className="text-[9px] font-black uppercase text-slate-900">Assinatura Professor(a)</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-48 border-b border-slate-900 mb-1"></div>
                <span className="text-[9px] font-black uppercase text-slate-900">Visto Coordenação</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Botão de Topo */}
      <div className="no-print fixed bottom-8 right-8 flex flex-col gap-4">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-4 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-black transition-all active:scale-90 border-2 border-white"
        >
          <ChevronDoubleDownIcon className="w-6 h-6 rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default App;
