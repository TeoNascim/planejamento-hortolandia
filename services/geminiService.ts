
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export async function suggestEducationalContent(prompt: string, anoTurma: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um assistente pedagógico especializado na BNCC brasileira. 
      Com base no tema fornecido, sugira habilidades, estratégias metodológicas, recursos e avaliação.
      A turma/ano alvo é: ${anoTurma || 'Ensino Fundamental'}. Suas sugestões, especialmente as habilidades da BNCC de Educação Física, DEVEM ser estritamente coerentes e voltadas para essa faixa etária/ano escolar.
      
      Regra de Formatação: Para TODOS os tópicos (habilidades, estratégias, recursos e avaliação), NÃO use vírgulas ou pontos e vírgulas para separar os itens. Em vez disso, coloque CADA ITEM EM UMA NOVA LINHA, iniciando com um traço "- " e pulando uma linha entre eles.
      
      Retorne APENAS um objeto JSON com as chaves: habilidades, estrategias, recursos, avaliacao. Todas essas chaves devem ser strings (texto longo formátado com as quebras de linha).
      
      Tema: ${prompt}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Erro na sugestão IA:", error);
    return null;
  }
}
