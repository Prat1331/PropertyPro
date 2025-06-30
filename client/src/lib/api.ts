import { apiRequest } from "./queryClient";
import type { Property, InsertInquiry } from "@shared/schema";

export const api = {
  // Properties
  getProperties: async (): Promise<Property[]> => {
    const response = await fetch("/api/properties");
    return response.json();
  },

  getFeaturedProperties: async (): Promise<Property[]> => {
    const response = await fetch("/api/properties/featured");
    return response.json();
  },

  getProperty: async (id: number): Promise<Property> => {
    const response = await fetch(`/api/properties/${id}`);
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
    
    const response = await fetch(`/api/properties/search?${params}`);
    return response.json();
  },

  // AI Recommendations
  getRecommendations: async (preferences: string, userId?: string) => {
    const response = await apiRequest("POST", "/api/recommendations", {
      preferences,
      userId: userId || "anonymous"
    });
    return response.json();
  },

  // Inquiries
  submitInquiry: async (inquiry: InsertInquiry) => {
    const response = await apiRequest("POST", "/api/inquiries", inquiry);
    return response.json();
  }
};
