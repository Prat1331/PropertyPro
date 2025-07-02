import { apiRequest } from "./queryClient";
import type { Property, InsertInquiry } from "server/shared/schema";

const BASE_URL = "https://propertypro-production.up.railway.app"; // 🔥 Replace with your Railway backend

export const api = {
  // Properties
  getProperties: async (): Promise<Property[]> => {
    const response = await fetch(`${BASE_URL}/api/properties`, {
      credentials: "include", // 🔥 Required for CORS
    });
    return response.json();
  },

  getFeaturedProperties: async (): Promise<Property[]> => {
    const response = await fetch(`${BASE_URL}/api/properties/featured`, {
      credentials: "include",
    });
    return response.json();
  },

  getProperty: async (id: number): Promise<Property> => {
    const response = await fetch(`${BASE_URL}/api/properties/${id}`, {
      credentials: "include",
    });
    return response.json();
  },

  searchProperties: async (filters: {
    priceType?: string;
    propertyType?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  }): Promise<Property[]> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/api/properties/search?${params}`, {
      credentials: "include",
    });
    return response.json();
  },

  // AI Recommendations
  getRecommendations: async (preferences: string, userId?: string) => {
    const response = await apiRequest("POST", `${BASE_URL}/api/recommendations`, {
      preferences,
      userId: userId || "anonymous",
    });
    return response.json();
  },

  // Inquiries
  submitInquiry: async (inquiry: InsertInquiry) => {
    const response = await apiRequest("POST", `${BASE_URL}/api/inquiries`, inquiry);
    return response.json();
  }
};
