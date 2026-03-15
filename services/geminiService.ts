
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function suggestEducationalContent(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um assistente pedagógico especializado na BNCC brasileira. 
      Com base no tema fornecido, sugira habilidades, estratégias metodológicas, recursos e avaliação.
      Retorne APENAS um objeto JSON com as chaves: habilidades, estrategias, recursos, avaliacao.
      
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
