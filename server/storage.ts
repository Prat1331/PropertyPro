import { users, properties, inquiries, aiRecommendations, type User, type InsertUser, type Property, type InsertProperty, type Inquiry, type InsertInquiry, type AiRecommendation, type InsertAiRecommendation } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property methods
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
  
  // Inquiry methods
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getAllInquiries(): Promise<Inquiry[]>;
  
  // AI Recommendation methods
  createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
  getAiRecommendationsByUser(userId: string): Promise<AiRecommendation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private inquiries: Map<number, Inquiry>;
  private aiRecommendations: Map<number, AiRecommendation>;
  private currentUserId: number;
  private currentPropertyId: number;
  private currentInquiryId: number;
  private currentRecommendationId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.inquiries = new Map();
    this.aiRecommendations = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentInquiryId = 1;
    this.currentRecommendationId = 1;
    
    // Initialize with sample properties
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleProperties: InsertProperty[] = [
      {
        title: "Premium 3BHK Apartment",
        description: "Luxurious 3BHK apartment with modern amenities, spacious rooms, and excellent connectivity to major landmarks.",
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
        contactPhone: "+91 9911926000"
      },
      {
        title: "Luxury Villa",
        description: "Independent villa with private garden, modern architecture, and premium location in Faridabad.",
        price: "25000000",
        priceType: "sale",
        propertyType: "villa",
        bedrooms: 4,
        bathrooms: 4,
        area: 3200,
        location: "Sector 15, Faridabad",
        sector: "Sector 15",
        city: "Faridabad",
        amenities: ["Private Garden", "Garage", "Security", "Terrace", "Study Room"],
        images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"],
        featured: true,
        available: true,
        contactPerson: "Pratham Associates",
        contactPhone: "+91 9911926000"
      },
      {
        title: "Commercial Office Space",
        description: "Prime commercial office space in business district with excellent infrastructure and connectivity.",
        price: "150000",
        priceType: "rent",
        propertyType: "office",
        area: 2500,
        location: "Sector 16, Faridabad",
        sector: "Sector 16",
        city: "Faridabad",
        amenities: ["High Speed Internet", "Central AC", "Elevator", "Cafeteria", "Parking"],
        images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"],
        featured: true,
        available: true,
        contactPerson: "Pratham Associates",
        contactPhone: "+91 9911926000"
      },
      {
        title: "2BHK Modern Apartment",
        description: "Well-designed 2BHK apartment with modern amenities and excellent metro connectivity.",
        price: "25000",
        priceType: "rent",
        propertyType: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        location: "Sector 12, Faridabad",
        sector: "Sector 12",
        city: "Faridabad",
        amenities: ["Modular Kitchen", "Balcony", "Metro Connectivity", "Security", "Parking"],
        images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"],
        featured: false,
        available: true,
        contactPerson: "Pratham Associates",
        contactPhone: "+91 9911926000"
      },
      {
        title: "Penthouse Suite",
        description: "Ultra-luxury penthouse with panoramic city views, premium amenities, and exclusive features.",
        price: "38000000",
        priceType: "sale",
        propertyType: "apartment",
        bedrooms: 5,
        bathrooms: 5,
        area: 4500,
        location: "Sector 18, Faridabad",
        sector: "Sector 18",
        city: "Faridabad",
        amenities: ["Private Jacuzzi", "City View Terrace", "Concierge Service", "Private Elevator", "Premium Finishes"],
        images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
        featured: true,
        available: true,
        contactPerson: "Pratham Associates",
        contactPhone: "+91 9911926000"
      },
      {
        title: "Premium PG Accommodation",
        description: "Fully furnished PG with all amenities, nutritious meals, and professional environment.",
        price: "12000",
        priceType: "pg",
        propertyType: "pg",
        area: 200,
        location: "Sector 20, Faridabad",
        sector: "Sector 20",
        city: "Faridabad",
        amenities: ["3 Meals", "WiFi", "Laundry", "Housekeeping", "Study Room", "Security"],
        images: ["https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800"],
        featured: false,
        available: true,
        contactPerson: "Pratham Associates",
        contactPhone: "+91 9911926000"
      }
    ];

    sampleProperties.forEach(property => {
      this.createProperty(property);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.available);
  }

  async getPropertiesByFilters(filters: {
    priceType?: string;
    propertyType?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  }): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property => {
      if (!property.available) return false;
      
      if (filters.priceType && property.priceType !== filters.priceType) return false;
      if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.bedrooms && property.bedrooms !== filters.bedrooms) return false;
      
      const price = parseFloat(property.price);
      if (filters.minPrice && price < filters.minPrice) return false;
      if (filters.maxPrice && price > filters.maxPrice) return false;
      
      return true;
    });
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.featured && p.available);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = { 
      ...insertProperty, 
      id,
      city: insertProperty.city ?? "Faridabad",
      bedrooms: insertProperty.bedrooms ?? null,
      bathrooms: insertProperty.bathrooms ?? null,
      amenities: insertProperty.amenities ?? null,
      images: insertProperty.images ?? null,
      featured: insertProperty.featured ?? false,
      available: insertProperty.available ?? true,
      contactPerson: insertProperty.contactPerson ?? null,
      contactPhone: insertProperty.contactPhone ?? null
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

  // Inquiry methods
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      status: "new",
      propertyType: insertInquiry.propertyType ?? null,
      propertyId: insertInquiry.propertyId ?? null
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  // AI Recommendation methods
  async createAiRecommendation(insertRecommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const id = this.currentRecommendationId++;
    const recommendation: AiRecommendation = { 
      ...insertRecommendation, 
      id,
      userId: insertRecommendation.userId ?? null,
      recommendedProperties: insertRecommendation.recommendedProperties ?? null,
      confidence: insertRecommendation.confidence ?? null
    };
    this.aiRecommendations.set(id, recommendation);
    return recommendation;
  }

  async getAiRecommendationsByUser(userId: string): Promise<AiRecommendation[]> {
    return Array.from(this.aiRecommendations.values()).filter(r => r.userId === userId);
  }
}

export const storage = new MemStorage();
