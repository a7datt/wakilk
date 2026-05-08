import { GoogleGenerativeAI } from "@google/generative-ai";

export function getAI(apiKey?: string) {
  const meta = (import.meta as any);
  const key = apiKey || (meta.env?.VITE_GEMINI_API_KEY) || "";
  
  if (!key) {
    throw new Error("لم يتم العثور على مفتاح API. يرجى إدخال مفتاح Gemini الخاص بك في إعدادات الوكيل.");
  }
  return new GoogleGenerativeAI(key);
}

export async function generateResponse(params: {
  message: string;
  history?: { role: string; content: string }[];
  systemInstruction: string;
  model?: string;
  apiKey?: string;
}) {
  try {
    const genAI = getAI(params.apiKey);
    // Use gemini-1.5-flash as default stable version
    const modelName = params.model || "gemini-1.5-flash";
    
    // Explicitly using the model with system instructions
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: params.systemInstruction,
    });

    const chat = model.startChat({
      history: (params.history || []).map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
      })),
    });

    const result = await chat.sendMessage(params.message);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Service Error Details:", error);
    
    // If it fails, try a direct generation without chat history as fallback
    try {
      const genAI = getAI(params.apiKey);
      const model = genAI.getGenerativeModel({ model: params.model || "gemini-1.5-flash" });
      const result = await model.generateContent(params.message);
      return result.response.text();
    } catch (fallbackError) {
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        throw new Error("النموذج المختأ غير متوفر لهذا المفتاح. حاول اختيار Gemini 1.5 Flash.");
      }
      throw error;
    }
  }
}
