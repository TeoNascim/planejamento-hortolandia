
import { GoogleGenAI, Type } from "@google/genai";

// Inicializa a IA usando a variável de ambiente configurada na Vercel
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const suggestEducationalContent = async (contexto: string) => {
  if (!contexto) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um especialista em Educação Física Escolar (BNCC). 
      Com base no tema: "${contexto}", gere sugestões pedagógicas.
      IMPORTANTE: Para 'estrategias', foque especificamente em ATIVIDADES PRÁTICAS para a etapa de 'Desenvolvimento (Prática corporal)', sendo coerente com o tema e as habilidades.
      Retorne em formato JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            habilidades: { type: Type.STRING, description: "Habilidades BNCC relacionadas" },
            estrategias: { type: Type.STRING, description: "Atividades práticas para o desenvolvimento da aula" },
            recursos: { type: Type.STRING, description: "Materiais necessários" },
            avaliacao: { type: Type.STRING, description: "Critérios de avaliação" },
            adaptacao: { type: Type.STRING, description: "Sugestões para alunos com deficiência" },
          },
          required: ["habilidades", "estrategias", "recursos", "avaliacao", "adaptacao"]
        }
      }
    });

    // Esta verificação de 'typeof' é o que resolve o erro no log da Vercel.
    // Ela garante ao TypeScript que 'textOutput' é obrigatoriamente uma string antes do JSON.parse.
    const textOutput = response.text;
    
    if (typeof textOutput === 'string') {
      return JSON.parse(textOutput);
    }
    
    console.warn("IA retornou conteúdo vazio ou inválido.");
    return null;
    
  } catch (error) {
    console.error("Erro na chamada do Gemini:", error);
    return null;
  }
};
