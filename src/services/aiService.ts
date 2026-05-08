import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export class AIService {
  private static ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  static async generateChatResponse(message: string, systemPrompt: string, history: any[] = []) {
    if (!this.ai) {
      throw new Error("Gemini API Key is not configured. Please add it to your secrets.");
    }

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    return response.text;
  }
}
