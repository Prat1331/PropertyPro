import { pgTable, text, serial, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  priceType: text("price_type").notNull(), // "sale", "rent", "pg"
  propertyType: text("property_type").notNull(), // "apartment", "villa", "office", "pg"
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: integer("area").notNull(), // in sq.ft
  location: text("location").notNull(),
  sector: text("sector").notNull(),
  city: text("city").notNull().default("Faridabad"),
  amenities: text("amenities").array(),
  images: text("images").array(),
  featured: boolean("featured").default(false),
  available: boolean("available").default(true),
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  propertyType: text("property_type"),
  message: text("message").notNull(),
  propertyId: integer("property_id"),
  status: text("status").default("new"), // "new", "contacted", "closed"
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  preferences: text("preferences").notNull(),
  recommendedProperties: text("recommended_properties").array(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  status: true,
});

export const insertAiRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertAiRecommendation = z.infer<typeof insertAiRecommendationSchema>;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
