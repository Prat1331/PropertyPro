import {
  users,
  properties,
  inquiries,
  aiRecommendations,
  type User,
  type InsertUser,
  type Property,
  type InsertProperty,
  type Inquiry,
  type InsertInquiry,
  type AiRecommendation,
  type InsertAiRecommendation,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProperty(id: number): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  getPropertiesByFilters(filters: {
    priceType?: string;
    propertyType?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  }): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;

  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getAllInquiries(): Promise<Inquiry[]>;

  createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
  getAiRecommendationsByUser(userId: string): Promise<AiRecommendation[]>;
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private properties = new Map<number, Property>();
  private inquiries = new Map<number, Inquiry>();
  private aiRecommendations = new Map<number, AiRecommendation>();
  private currentUserId = 1;
  private currentPropertyId = 1;
  private currentInquiryId = 1;
  private currentRecommendationId = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleProperties: InsertProperty[] = [
      {
        title: "Premium 3BHK Apartment",
        description: "Luxurious 3BHK apartment with modern amenities...",
        price: "8500000",
        priceType: "sale",
        propertyType: "apartment",
        bedrooms: 3,
        bathrooms: 3,
        area: 1850,
        location: "Sector 21, Faridabad",
        sector: "Sector 21",
        city: "Faridabad",
        amenities: ["Swimming Pool", "Gym", "Security", "Parking", "Elevator"],
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
        featured: true,
        available: true,
        contactPerson: "Pratham Associates",
        contactPhone: "+91 9911926000",
      },
      // Add more if needed
    ];

    sampleProperties.forEach((p) => this.createProperty(p));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      username: insertUser.username ?? null,
      password: insertUser.password ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter((p) => p.available);
  }

  async getPropertiesByFilters(filters: {
    priceType?: string;
    propertyType?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  }): Promise<Property[]> {
    return Array.from(this.properties.values()).filter((property) => {
      if (!property.available) return false;

      if (filters.priceType && property.priceType !== filters.priceType) return false;
      if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
      if (filters.location && !(property.location ?? "").toLowerCase().includes(filters.location.toLowerCase()))
        return false;
      if (filters.bedrooms && property.bedrooms !== filters.bedrooms) return false;

      const price = parseFloat(property.price ?? "0");
      if (filters.minPrice && price < filters.minPrice) return false;
      if (filters.maxPrice && price > filters.maxPrice) return false;

      return true;
    });
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter((p) => p.featured && p.available);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = {
      id,
      title: insertProperty.title ?? null,
      description: insertProperty.description ?? null,
      price: insertProperty.price ?? null,
      priceType: insertProperty.priceType ?? null,
      propertyType: insertProperty.propertyType ?? null,
      bedrooms: insertProperty.bedrooms ?? null,
      bathrooms: insertProperty.bathrooms ?? null,
      area: insertProperty.area ?? null,
      location: insertProperty.location ?? null,
      sector: insertProperty.sector ?? null,
      city: insertProperty.city ?? "Faridabad",
      amenities: insertProperty.amenities ?? null,
      images: insertProperty.images ?? null,
      featured: insertProperty.featured ?? false,
      available: insertProperty.available ?? true,
      contactPerson: insertProperty.contactPerson ?? null,
      contactPhone: insertProperty.contactPhone ?? null,
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updateData };
    this.properties.set(id, updated);
    return updated;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = {
      id,
      name: insertInquiry.name ?? null,
      email: insertInquiry.email ?? null,
      phone: insertInquiry.phone ?? null,
      message: insertInquiry.message ?? null,
      propertyType: insertInquiry.propertyType ?? null,
      propertyId: insertInquiry.propertyId ?? null,
      status: insertInquiry.status ?? "new",
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async createAiRecommendation(insertRecommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const id = this.currentRecommendationId++;
    const recommendation: AiRecommendation = {
      id,
      userId: insertRecommendation.userId ?? null,
      preferences: insertRecommendation.preferences ?? null,
      recommendedProperties: insertRecommendation.recommendedProperties ?? null,
      confidence: insertRecommendation.confidence ?? null,
    };
    this.aiRecommendations.set(id, recommendation);
    return recommendation;
  }

  async getAiRecommendationsByUser(userId: string): Promise<AiRecommendation[]> {
    return Array.from(this.aiRecommendations.values()).filter((r) => r.userId === userId);
  }
}

export const storage = new MemStorage();
