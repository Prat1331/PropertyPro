import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertInquirySchema } from "@shared/schema";
import { getPropertyRecommendations, analyzePropertyInquiry } from "./services/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured properties" });
    }
  });

  app.get("/api/properties/search", async (req, res) => {
    try {
      const filters = {
        priceType: req.query.priceType as string,
        propertyType: req.query.propertyType as string,
        location: req.query.location as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
      };

      const properties = await storage.getPropertiesByFilters(filters);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to search properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  // AI Recommendations
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { preferences, userId } = req.body;
      
      if (!preferences) {
        return res.status(400).json({ error: "Preferences are required" });
      }

      const availableProperties = await storage.getAllProperties();
      const recommendation = await getPropertyRecommendations(preferences, availableProperties);
      
      // Store the recommendation
      await storage.createAiRecommendation({
        userId: userId || "anonymous",
        preferences,
        recommendedProperties: recommendation.propertyIds.map(String),
        confidence: recommendation.confidence.toString()
      });

      // Get the actual property objects
      const recommendedProperties = await Promise.all(
        recommendation.propertyIds.map(id => storage.getProperty(id))
      );

      res.json({
        properties: recommendedProperties.filter(Boolean),
        confidence: recommendation.confidence,
        reasoning: recommendation.reasoning
      });
    } catch (error) {
      console.error("Recommendation error:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  // Inquiry routes
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      
      // Analyze inquiry with AI
      const analysis = await analyzePropertyInquiry(validatedData.message);
      
      const inquiry = await storage.createInquiry(validatedData);
      
      res.json({ 
        inquiry, 
        analysis,
        message: "Thank you for your inquiry! We'll contact you soon." 
      });
    } catch (error) {
      console.error("Inquiry creation error:", error);
      res.status(500).json({ error: "Failed to submit inquiry" });
    }
  });

  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Pratham Associates API" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
