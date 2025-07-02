import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertInquirySchema } from "@shared/schema";
import { getPropertyRecommendations, analyzePropertyInquiry } from "./services/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // ✅ Properties - All
  app.get("/api/properties", async (_req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      console.error("❌ /api/properties error:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  // ✅ Properties - Featured
  app.get("/api/properties/featured", async (_req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      console.error("❌ /api/properties/featured error:", error);
      res.status(500).json({ error: "Failed to fetch featured properties" });
    }
  });

  // ✅ Properties - Search
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
      console.error("❌ /api/properties/search error:", error);
      res.status(500).json({ error: "Failed to search properties" });
    }
  });

  // ✅ Properties - Get by ID
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);

      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("❌ /api/properties/:id error:", error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  // ✅ AI Recommendations
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { preferences, userId } = req.body;

      if (!preferences) {
        return res.status(400).json({ error: "Preferences are required" });
      }

      const availableProperties = await storage.getAllProperties();
      const recommendation = await getPropertyRecommendations(preferences, availableProperties);

      // Save recommendation
      await storage.createAiRecommendation({
        userId: userId || "anonymous",
        preferences,
        recommendedProperties: recommendation.propertyIds.map(String),
        confidence: recommendation.confidence.toString(),
      });

      // Fetch full property details
      const recommendedProperties = await Promise.all(
        recommendation.propertyIds.map(id => storage.getProperty(id))
      );

      res.json({
        properties: recommendedProperties.filter(Boolean),
        confidence: recommendation.confidence,
        reasoning: recommendation.reasoning,
      });
    } catch (error) {
      console.error("❌ /api/recommendations error:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  // ✅ Inquiries - Submit
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);

      const analysis = await analyzePropertyInquiry(validatedData.message);
      const inquiry = await storage.createInquiry(validatedData);

      res.json({
        inquiry,
        analysis,
        message: "Thank you for your inquiry! We'll contact you soon.",
      });
    } catch (error) {
      console.error("❌ /api/inquiries error:", error);
      res.status(500).json({ error: "Failed to submit inquiry" });
    }
  });

  // ✅ Inquiries - List
  app.get("/api/inquiries", async (_req, res) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("❌ /api/inquiries (GET) error:", error);
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // ✅ Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Pratham Associates API" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
