import { GoogleGenAI, Type } from "@google/genai";

// Helper to process file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });
};

export const GeminiService = {
  fileToBase64,

  extractBusinessInfo: async (file: File) => {
    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await fileToBase64(file);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: file.type, data: base64Data } },
          { text: "Extract Korean Business Registration Info as JSON." }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            businessRegNo: { type: Type.STRING },
            representativeName: { type: Type.STRING },
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  extractVehicleRegistration: async (file: File) => {
    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await fileToBase64(file);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: file.type, data: base64Data } },
          { text: "Extract Korean Vehicle Registration details as JSON." }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plateNumber: { type: Type.STRING },
            vin: { type: Type.STRING },
            manufacturer: { type: Type.STRING },
            modelName: { type: Type.STRING },
            modelYear: { type: Type.STRING },
            fuelType: { type: Type.STRING },
            registrationDate: { type: Type.STRING },
            mileage: { type: Type.STRING },
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  estimateMarketPrice: async (model: string, year: string) => {
    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Estimate export market price for ${year} ${model} from Korea in USD. Search recent data.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((c: any) => c.web?.uri ? { title: c.web.title, uri: c.web.uri } : null)
      .filter(Boolean) || [];
    return { text: response.text, sources };
  }
};

