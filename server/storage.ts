import {
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

  private initializeSampleData(): void {
    this.properties.clear();
    this.currentPropertyId = 1;
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
      title: "3 BHK Apartment – BPTP Park Elite Floors, Sector 85",
      description: "1045 - 2250 sq.ft, 3 beds/3 baths, North-facing, ready to move",
      price: "6000000 to 10000000", // ₹37.8 L
      priceType: "sale",
      propertyType: "Apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: 2250,
      location: "Sector 85, Faridabad",
      sector: "Sector 85",
      city: "Faridabad",
      amenities: ["Lift", "Parking", "Security"],
      images: ["https://housing-images.n7net.in/4f2250e8/86bdd4f6bf1da3e7c24ba3b33bede8d9/v0/large/bptp_park_elite_floors-sector_85_faridabad-faridabad-bptp_limited.jpeg"],
      featured: true,
      available: true,
      contactPerson: "Anupam Properties",
      contactPhone: "+91 9911926000",
    },

    {
      title: "3 BHK Flat – Kgl Green, Sector 75",
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
      title: "4 BHK Apartment –  Greenfield Colony,Just 3.1 km away from Asian Fidelis Multi Speciality",
      description: "1850 sq.ft, 4 beds/4 baths, West-facing, ₹1.3 - 3.7 cr",
      price: "30000000",
      priceType: "sale",
      propertyType: "apartment",
      bedrooms: 4,
      bathrooms: 3,
      area: 1850,
      location: "3, 4, 5 BHK Flat in Greenfield Colony, Faridabad",
      sector: "Greenfield Colony",
      city: "Faridabad",
      amenities: ["Parking", "Security"],
      images: ["https://newprojects.99acres.com/projects/lord_krishna_properties_and_developers/faridabad_luxury_and_premium_builder_floors/images/3yitjeu_1741693218_576731847_optOrig.jpg"],
      featured: false,
      available: true,
      contactPerson: "Anupam Properties",
      contactPhone: "+91 9911926000",
    },

    {
      title: "3 BHK Flat – Puri Aanand Vilas, Sector 81",
      description: "1475 sq.ft, 3 beds/3 baths, West-facing, ₹1.05 Cr",
      price: "10500000",
      priceType: "sale",
      propertyType: "apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: 1475,
      location: "Sector 81, Faridabad",
      sector: "Sector 81",
      city: "Faridabad",
      amenities: ["Pool", "Gym", "Garden", "Lift"],
      images: ["https://newprojects.99acres.com/projects/puri/puri_aanand_vilas/images/t5vdqyh_1741253518_575226233_optOrig.jpg"],
      featured: false,
      available: true,
      contactPerson: "Anupam Properties",
      contactPhone: "+91 9911926000",
    },

    {
      title: "3 BHK Flat – Omaxe Heights, Sector 86",
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
      images: ["https://newprojects.99acres.com/projects/omaxe/omaxe_heights/images/7rhiw3z_1740995918_574230819_large.jpg"],
      featured: false,
      available: true,
      contactPerson: "Anupam Properties",
      contactPhone: "+91 9911926000",
    },
      // Add more if needed
    ];

    sampleProperties.forEach((p: InsertProperty) => this.createProperty(p));
    console.log("✅ Sample data loaded:", sampleProperties.map((p) => p.title));
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
    username: insertUser?.username ?? null,
    password: insertUser?.password ?? null,
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
      if (filters.location && !property.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.bedrooms && property.bedrooms !== filters.bedrooms) return false;

      const price = parseFloat(property.price ?? "0");
      if (filters.minPrice && price < filters.minPrice) return false;
      if (filters.maxPrice && price > filters.maxPrice) return false;

      return true;
    });
  }

  async getFeaturedProperties(): Promise<Property[]> {
    const featured = Array.from(this.properties.values()).filter((p) => p.featured && p.available);
    console.log("📦 Returning featured properties:", featured.map((p) => p.title));
    return featured;
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
      amenities: insertProperty.amenities ?? [],
      images: insertProperty.images ?? [],
      featured: insertProperty.featured ?? false,
      available: insertProperty.available ?? true,
      contactPerson: insertProperty.contactPerson ?? "",
      contactPhone: insertProperty.contactPhone ?? "",
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updateData };
    this.properties.set(id, updated as Property);
    return updated as Property;
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
