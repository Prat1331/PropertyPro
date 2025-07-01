import { db } from '../db'; // ✅ now pointing to db.ts, not ./index
import { users, properties, inquiries, aiRecommendations } from '../shared/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Insert users
  await db.insert(users).values([
    { username: 'alice.verma', password: 'hashed_pass_001' },
    { username: 'rohit.bansal', password: 'hashed_pass_002' },
    { username: 'neha.kumar', password: 'hashed_pass_003' },
  ]);

  // Insert properties
  await db.insert(properties).values([
    {
      title: 'Luxury 3BHK in Sector 15',
      description: 'Spacious apartment with park view, close to metro and malls.',
      price: 7500000.0,
      priceType: 'sale',
      propertyType: 'apartment',
      bedrooms: 3,
      bathrooms: 3,
      area: 1800,
      location: 'Sector 15',
      sector: '15',
      city: 'Faridabad',
      amenities: ['lift', 'parking', 'gym'],
      images: ['apt1.jpg', 'apt2.jpg'],
      featured: true,
      available: true,
      contactPerson: 'Ramesh Verma',
      contactPhone: '9876543210',
    },
    {
      title: '2BHK for Rent in Sector 9',
      description: 'Modern 2BHK ideal for couples, semi-furnished.',
      price: 15000.0,
      priceType: 'rent',
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      location: 'Sector 9',
      sector: '9',
      city: 'Faridabad',
      amenities: ['power backup', 'security'],
      images: ['rent1.jpg', 'rent2.jpg'],
      featured: false,
      available: true,
      contactPerson: 'Anita Mehra',
      contactPhone: '9988776655',
    },
    {
      title: 'PG Rooms for Students',
      description: 'Affordable PG with meals and Wi-Fi, walking distance to college.',
      price: 6000.0,
      priceType: 'pg',
      propertyType: 'pg',
      bedrooms: null,
      bathrooms: null,
      area: 300,
      location: 'Sector 21D',
      sector: '21D',
      city: 'Faridabad',
      amenities: ['wifi', 'meals', 'laundry'],
      images: ['pg1.jpg', 'pg2.jpg'],
      featured: false,
      available: true,
      contactPerson: 'Rajeev Khanna',
      contactPhone: '9123456780',
    },
  ]);

  // Insert inquiries
  await db.insert(inquiries).values([
    {
      name: 'Sneha Gupta',
      email: 'sneha@gmail.com',
      phone: '9999988888',
      propertyType: 'apartment',
      message: 'Interested in a 3BHK in Sector 15.',
      propertyId: 1,
      status: 'new',
    },
    {
      name: 'Amit Joshi',
      email: 'amitj@outlook.com',
      phone: '9876543211',
      propertyType: 'pg',
      message: 'Need PG near Sector 21D for 6 months.',
      propertyId: 3,
      status: 'contacted',
    },
    {
      name: 'Vikram Patel',
      email: 'vikramp@gmail.com',
      phone: '9090909090',
      propertyType: 'villa',
      message: 'Looking for a luxury villa for rent.',
      status: 'new',
    },
  ]);

  // Insert AI recommendations
  await db.insert(aiRecommendations).values([
    {
      userId: 'alice.verma',
      preferences: '3BHK, Sector 15, near metro',
      recommendedProperties: ['1', '2'],
      confidence: 0.92,
    },
    {
      userId: 'rohit.bansal',
      preferences: 'PG in Sector 21D, low budget',
      recommendedProperties: ['3'],
      confidence: 0.85,
    },
    {
      userId: 'neha.kumar',
      preferences: '2BHK, rent, budget under 20k',
      recommendedProperties: ['2'],
      confidence: 0.88,
    },
  ]);

  console.log('✅ Seeding complete.');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
