import { Router } from "express";
import { db } from "./db";

const router = Router();

// ✅ Featured properties
router.get("/api/properties/featured", async (_req, res) => {
  try {
    const result = await db.query.properties.findMany({
      where: (props, { eq }) => eq(props.featured, true),
    });
    res.json(result); // Removed .rows
  } catch (err) {
    console.error("❌ Error fetching featured properties:", err);
    res.status(500).json({ error: "Failed to fetch featured properties" });
  }
});

// ✅ All properties
router.get("/api/properties", async (_req, res) => {
  try {
    const result = await db.query.properties.findMany();
    res.json(result); // Removed .rows
  } catch (err) {
    console.error("❌ Error fetching all properties:", err);
    res.status(500).json({ error: "Failed to fetch all properties" });
  }
});

export async function registerRoutes(app: any) {
  app.use(router);
  return app;
}
