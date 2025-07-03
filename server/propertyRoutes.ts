import { Router } from "express";
import { db } from "./db"; 
import { properties } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/featured", async (_req, res) => {
  try {
    // Use eq helper, NOT properties.featured.eq
    const result = await db.select().from(properties).where(eq(properties.featured, true));
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching featured properties:", err);
    res.status(500).json({ error: "Failed to fetch featured properties" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await db.select().from(properties);
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching all properties:", err);
    res.status(500).json({ error: "Failed to fetch all properties" });
  }
});

export default router;
