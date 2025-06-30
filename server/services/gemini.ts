import { GoogleGenAI } from "@google/genai";
import type { Property } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyDJEOwgYfC1MWF-X4cuL8D4Vri-U0cRpJU" 
});

export interface PropertyRecommendation {
  propertyIds: number[];
  confidence: number;
  reasoning: string;
}

export async function getPropertyRecommendations(
  userPreferences: string,
  availableProperties: Property[]
): Promise<PropertyRecommendation> {
  try {
    const systemPrompt = `You are a real estate AI assistant for Pratham Associates in Faridabad. 
Analyze user preferences and recommend the most suitable properties from the available list.
Consider factors like budget, location, property type, amenities, and lifestyle needs.
Respond with JSON in this exact format:
{
  "propertyIds": [array of property IDs],
  "confidence": number between 0 and 1,
  "reasoning": "detailed explanation of why these properties match the user's needs"
}`;

    const propertiesContext = availableProperties.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      priceType: p.priceType,
      propertyType: p.propertyType,
      bedrooms: p.bedrooms,
      location: p.location,
      amenities: p.amenities,
      area: p.area
    }));

    const prompt = `User preferences: ${userPreferences}

Available properties: ${JSON.stringify(propertiesContext, null, 2)}

Please recommend the best matching properties based on the user's preferences.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            propertyIds: {
              type: "array",
              items: { type: "number" }
            },
            confidence: { type: "number" },
            reasoning: { type: "string" }
          },
          required: ["propertyIds", "confidence", "reasoning"]
        }
      },
      contents: prompt
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    const recommendation: PropertyRecommendation = JSON.parse(rawJson);
    return recommendation;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Fallback recommendation
    return {
      propertyIds: availableProperties.slice(0, 3).map(p => p.id),
      confidence: 0.5,
      reasoning: "AI service temporarily unavailable. Showing featured properties."
    };
  }
}

export async function analyzePropertyInquiry(inquiryText: string): Promise<{
  propertyType: string;
  priceRange: string;
  urgency: string;
  summary: string;
}> {
  try {
    const systemPrompt = `Analyze a property inquiry and extract key information.
Respond with JSON in this format:
{
  "propertyType": "apartment|villa|office|pg|any",
  "priceRange": "budget|mid-range|luxury|unspecified",
  "urgency": "low|medium|high",
  "summary": "brief summary of the inquiry"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            propertyType: { type: "string" },
            priceRange: { type: "string" },
            urgency: { type: "string" },
            summary: { type: "string" }
          },
          required: ["propertyType", "priceRange", "urgency", "summary"]
        }
      },
      contents: inquiryText
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    return {
      propertyType: "any",
      priceRange: "unspecified",
      urgency: "medium",
      summary: "Property inquiry received"
    };
  }
}
