import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  varchar,
  jsonb
} from 'drizzle-orm/pg-core';
import {
  InferSelectModel,
  InferInsertModel
} from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }),
  password: varchar('password', { length: 255 }),
});

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  price: varchar('price', { length: 255 }),
  priceType: varchar('price_type', { length: 255 }),
  propertyType: varchar('property_type', { length: 255 }),
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  area: integer('area'),
  location: varchar('location', { length: 255 }),
  sector: varchar('sector', { length: 255 }),
  city: varchar('city', { length: 255 }),
  amenities: jsonb('amenities').$type<string[]>(),
  images: jsonb('images').$type<string[]>(),
  featured: boolean('featured'),
  available: boolean('available'),
  contactPerson: varchar('contact_person', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 255 }),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 255 }),
  propertyType: varchar('property_type', { length: 255 }),
  message: text('message'),
  propertyId: integer('property_id'),
  status: varchar('status', { length: 255 }),
});

export const aiRecommendations = pgTable('ai_recommendations', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }),
  preferences: text('preferences'),
  recommendedProperties: jsonb('recommended_properties').$type<string[]>(),
  confidence: varchar('confidence', { length: 255 }),
});

// Export inferred types
export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export type Property = InferSelectModel<typeof properties>;
export type InsertProperty = InferInsertModel<typeof properties>;

export type Inquiry = InferSelectModel<typeof inquiries>;
export type InsertInquiry = InferInsertModel<typeof inquiries>;

export type AiRecommendation = InferSelectModel<typeof aiRecommendations>;
export type InsertAiRecommendation = InferInsertModel<typeof aiRecommendations>;
