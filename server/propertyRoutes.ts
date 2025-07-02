import { Router } from "express";
import { db } from "./db"; // or "../db" based on your path
import { properties } from "@shared/schema";

const router = Router();

// ✅ Featured properties
router.get("/api/properties/featured", async (_req, res) => {
  try {
    const result = await db.select().from(properties).where(properties.featured.eq(true));
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching featured properties:", err);
    res.status(500).json({ error: "Failed to fetch featured properties" });
  }
});

// ✅ All properties
router.get("/api/properties", async (_req, res) => {
  try {
    const result = await db.select().from(properties);
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching all properties:", err);
    res.status(500).json({ error: "Failed to fetch all properties" });
  }
});

export default router;
