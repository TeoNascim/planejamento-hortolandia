
import { GoogleGenAI, Type } from "@google/genai";

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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
