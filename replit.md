# Real Estate Platform - Pratham Associates

## Overview

This is a full-stack real estate web application for Pratham Associates, a property consulting company based in Faridabad. The platform features property listings, AI-powered property recommendations, and inquiry management. It's built with a modern tech stack including React frontend, Express backend, and PostgreSQL database.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state
- **Animation**: Framer Motion for smooth animations
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API**: RESTful API with JSON responses
- **Middleware**: CORS, JSON parsing, request logging
- **Storage**: In-memory storage with interface for future database integration

### Database Schema
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Migration**: Drizzle Kit for schema management
- **Provider**: Neon Database (serverless PostgreSQL)
- **Tables**: Users, Properties, Inquiries, AI Recommendations

## Key Components

### Property Management
- Property listings with comprehensive details (price, type, location, amenities)
- Featured properties section
- Advanced search and filtering capabilities
- Property detail pages with image galleries
- Support for sale, rent, and PG (paying guest) properties

### AI Integration
- Google Gemini AI integration for property recommendations
- Natural language processing for user preferences
- Confidence scoring for recommendations
- Personalized property matching based on user criteria

### User Interface
- Responsive design with mobile-first approach
- Modern card-based layouts with hover effects
- Smooth animations and transitions
- Professional color scheme (gold/yellow theme)
- Accessible navigation with proper ARIA labels

### Contact System
- Inquiry form with validation
- Property-specific inquiries
- Contact information management
- Status tracking for inquiries

## Data Flow

1. **Property Display**: Frontend fetches properties from `/api/properties` endpoints
2. **Search**: Filter parameters sent to `/api/properties/search` with query string
3. **AI Recommendations**: User preferences processed by Gemini AI service
4. **Inquiries**: Form submissions sent to `/api/inquiries` endpoint
5. **Real-time Updates**: TanStack Query handles caching and refetching

## External Dependencies

### AI Services
- **Google Gemini AI**: Property recommendation engine
- **API Key Management**: Environment variable for Gemini API access

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **React Hook Form**: Form handling with validation

### Development Tools
- **Vite**: Build tool with hot reload
- **Replit Integration**: Runtime error overlay and cartographer
- **TypeScript**: Type safety across the stack

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- Express server with auto-restart via tsx
- Database schema push with Drizzle Kit

### Production Build
- Vite builds optimized frontend bundle
- esbuild bundles Express server for Node.js
- Static assets served from Express in production
- Environment variables for database and API keys

### Database Management
- Drizzle schema migrations
- PostgreSQL connection via DATABASE_URL
- Neon serverless database for scalability

## Changelog
- June 30, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.