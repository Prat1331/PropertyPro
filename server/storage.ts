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
        contactPerson: "Anupam Properties",
        contactPhone: "+91 9911926000",
      },
      {
      title: "3 BHK Apartment – Adore Happy Homes, Sector 86",
      description: "650 sq.ft, 3 beds/2 baths, North-facing, ready to move",
      price: "6000000 to 10000000", // ₹37.8 L
      priceType: "sale",
      propertyType: "flat",
      bedrooms: 3,
      bathrooms: 3,
      area: 1045 - 2250,
      location: "Sector 85, Faridabad",
      sector: "Sector 85",
      city: "Faridabad",
      amenities: ["Lift", "Parking", "Security"],
      images: ["https://housing-images.n7net.in/4f2250e8/86bdd4f6bf1da3e7c24ba3b33bede8d9/v0/large/bptp_park_elite_floors-sector_85_faridabad-faridabad-bptp_limited.jpeg"],
      featured: false,
      available: true,
      contactPerson: "Anupam Properties",
      contactPhone: "+91 9911926000",
    },

    {
      title: "3 BHK Flat – BPTP Princess Park, Sector 86",
      description: "1888 sq.ft, 3 beds/3 baths, ready to move",
      price: "10000000", // ₹1 Cr
      priceType: "sale",
      propertyType: "apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: 1888,
      location: "Sector 75, Faridabad",
      sector: "Sector 75",
      city: "Faridabad",
      amenities: ["Lift", "Car Parking", "Garden"],
      images: ["https://newprojects.99acres.com/projects/klj/greens/images/v2s2su6f.jpg"],
      featured: true,
      available: true,
      contactPerson: "Anupam Properties",
      contactPhone: "+91 9911926000",
    },

    {
      title: "2 BHK Apartment – Amolik Residency, Sector 86",
      description: "900 sq.ft, 2 beds/2 baths, West-facing, ₹78 L",
      price: "7800000",
      priceType: "sale",
      propertyType: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 900,
      location: "Sector 86, Faridabad",
      sector: "Sector 86",
      city: "Faridabad",
      amenities: ["Parking", "Security"],
      images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20b?w=800"],
      featured: false,
      available: true,
      contactPerson: "Anupam Properties",
      contactPhone: "+91 9911926000",
    },

    {
      title: "3 BHK Flat – Omaxe Heights, Sector 86",
      description: "1475 sq.ft, 3 beds/3 baths, West-facing, ₹1.05 Cr",
      price: "10500000",
      priceType: "sale",
      propertyType: "apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: 1475,
      location: "Sector 86, Faridabad",
      sector: "Sector 86",
      city: "Faridabad",
      amenities: ["Pool", "Gym", "Garden", "Lift"],
      images: ["https://images.unsplash.com/photo-1600585152895-7981d41cd77b?w=800"],
      featured: true,
      available: true,
      contactPerson: "Anupam Properties",
      contactPhone: "+91 9911926000",
    },

    {
      title: "3 BHK Flat – Umang Summer Palms, Sector 86",
      description: "1576 sq.ft, 3 beds/3 baths, ₹1 Cr approx.",
      price: "10000000",
      priceType: "sale",
      propertyType: "apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: 1576,
      location: "Sector 86, Faridabad",
      sector: "Sector 86",
      city: "Faridabad",
      amenities: ["Lift", "Sports Area", "Gated Community"],
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
      featured: false,
      available: true,
      contactPerson: "Anupam Properties",
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
