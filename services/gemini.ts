import { GoogleGenAI, Type } from "@google/genai";
import { ExpressionResult } from "../types";

// Always initialize GoogleGenAI with apiKey from process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeExpression = async (base64Image: string): Promise<ExpressionResult> => {
  const model = "gemini-2.5-flash";
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        },
        {
          text: "Analyze the facial expression in this image. Be precise about micro-expressions and subtle cues."
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          primaryEmotion: { type: Type.STRING, description: "The most dominant emotion detected." },
          secondaryEmotion: { type: Type.STRING, description: "The second most prominent emotion, if any." },
          confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 1." },
          explanation: { type: Type.STRING, description: "Detailed explanation of the analysis." },
          cues: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Physical facial cues detected (e.g. 'brow furrow', 'corner lip tightening')."
          },
          emotionBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                emotion: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["emotion", "score"]
            }
          }
        },
        required: ["primaryEmotion", "secondaryEmotion", "confidence", "explanation", "cues", "emotionBreakdown"],
        propertyOrdering: ["primaryEmotion", "secondaryEmotion", "confidence", "explanation", "cues", "emotionBreakdown"]
      },
      systemInstruction: "You are a world-class psychological expert in facial micro-expressions and emotional intelligence. Analyze images of human faces and provide detailed, accurate emotional insights in a structured JSON format."
    }
  });

  // Directly access the text property as per latest SDK guidelines
  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return {
    ...JSON.parse(text),
    timestamp: Date.now()
  };
};