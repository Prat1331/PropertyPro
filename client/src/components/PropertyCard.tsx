import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Square, MapPin, Phone, Eye } from "lucide-react";
import type { Property } from "server/shared/schema";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: string, priceType: string) => {
    const amount = parseFloat(price);
    if (priceType === "sale") {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(0)} L`;
      return `₹${amount.toLocaleString()}`;
    } else {
      return `₹${amount.toLocaleString()}/${priceType === "pg" ? "month" : "month"}`;
    }
  };

  const getBadgeColor = (priceType: string) => {
    switch (priceType) {
      case "sale": return "bg-primary text-white";
      case "rent": return "bg-blue-500 text-white";
      case "pg": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getBackgroundColor = (priceType: string) => {
    switch (priceType) {
      case "sale": return "gradient-primary";
      case "rent": return "gradient-warm";
      case "pg": return "gradient-accent";
      default: return "gradient-primary";
    }
  };

  return (
    <div className="property-card">
      <div className="card-inner">
        {/* Card Front */}
        <div className="card-front bg-white overflow-hidden">
          <div className="relative">
            <img 
              src={property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"} 
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge className={getBadgeColor(property.priceType)}>
                For {property.priceType === "pg" ? "PG" : property.priceType}
              </Badge>
            </div>
            {property.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-accent text-gray-800">Featured</Badge>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="mb-3">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(property.price, property.priceType)}
              </span>
              <span className="text-gray-500 text-sm">{property.area} sq.ft</span>
            </div>

            {/* Property Stats */}
            {property.bedrooms && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  {property.bedrooms} Beds
                </div>
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {property.bathrooms} Baths
                  </div>
                )}
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  {property.area} sq.ft
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Back */}
        <div className={`card-back text-white p-6 flex flex-col justify-center ${getBackgroundColor(property.priceType)}`}>
          <h3 className="text-2xl font-bold mb-4">Property Details</h3>
          
          <div className="space-y-3 mb-6">
            {property.amenities?.slice(0, 5).map((amenity, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>{amenity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Link href={`/property/${property.id}`}>
              <Button className="w-full bg-white text-gray-800 hover:bg-gray-100 transition-colors">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
            
            <Button 
              onClick={() => window.open(`tel:${property.contactPhone || "+919911926000"}`)}
              className="w-full bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
