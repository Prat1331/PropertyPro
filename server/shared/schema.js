"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAiRecommendationSchema = exports.insertInquirySchema = exports.insertPropertySchema = exports.insertUserSchema = exports.aiRecommendations = exports.inquiries = exports.properties = exports.users = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
});
exports.properties = (0, pg_core_1.pgTable)("properties", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    price: (0, pg_core_1.decimal)("price", { precision: 12, scale: 2 }).notNull(),
    priceType: (0, pg_core_1.text)("price_type").notNull(), // "sale", "rent", "pg"
    propertyType: (0, pg_core_1.text)("property_type").notNull(), // "apartment", "villa", "office", "pg"
    bedrooms: (0, pg_core_1.integer)("bedrooms"),
    bathrooms: (0, pg_core_1.integer)("bathrooms"),
    area: (0, pg_core_1.integer)("area").notNull(), // in sq.ft
    location: (0, pg_core_1.text)("location").notNull(),
    sector: (0, pg_core_1.text)("sector").notNull(),
    city: (0, pg_core_1.text)("city").notNull().default("Faridabad"),
    amenities: (0, pg_core_1.text)("amenities").array(),
    images: (0, pg_core_1.text)("images").array(),
    featured: (0, pg_core_1.boolean)("featured").default(false),
    available: (0, pg_core_1.boolean)("available").default(true),
    contactPerson: (0, pg_core_1.text)("contact_person"),
    contactPhone: (0, pg_core_1.text)("contact_phone"),
});
exports.inquiries = (0, pg_core_1.pgTable)("inquiries", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    phone: (0, pg_core_1.text)("phone").notNull(),
    propertyType: (0, pg_core_1.text)("property_type"),
    message: (0, pg_core_1.text)("message").notNull(),
    propertyId: (0, pg_core_1.integer)("property_id"),
    status: (0, pg_core_1.text)("status").default("new"), // "new", "contacted", "closed"
});
exports.aiRecommendations = (0, pg_core_1.pgTable)("ai_recommendations", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id"),
    preferences: (0, pg_core_1.text)("preferences").notNull(),
    recommendedProperties: (0, pg_core_1.text)("recommended_properties").array(),
    confidence: (0, pg_core_1.decimal)("confidence", { precision: 3, scale: 2 }),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    username: true,
    password: true,
});
exports.insertPropertySchema = (0, drizzle_zod_1.createInsertSchema)(exports.properties).omit({
    id: true,
});
exports.insertInquirySchema = (0, drizzle_zod_1.createInsertSchema)(exports.inquiries).omit({
    id: true,
    status: true,
});
exports.insertAiRecommendationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.aiRecommendations).omit({
    id: true,
});
