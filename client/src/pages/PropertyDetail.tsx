import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Phone, 
  Heart,
  Share2,
  Calendar,
  CheckCircle
} from "lucide-react";
import type { Property } from "@shared/schema";

export default function PropertyDetail() {
  const { id } = useParams();
  
  const { data: property, isLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`]
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-lg mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-8 bg-gray-200 rounded mb-4" />
                  <div className="h-20 bg-gray-200 rounded" />
                </div>
                <div className="h-64 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h1>
            <p className="text-gray-600">The property you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Property Images */}
          <div className="mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img 
                src={property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge 
                  className={`text-white ${
                    property.priceType === "sale" ? "bg-primary" : 
                    property.priceType === "rent" ? "bg-blue-500" : "bg-green-500"
                  }`}
                >
                  For {property.priceType === "pg" ? "PG" : property.priceType}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="sm" variant="secondary">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.location}
                </div>
                <div className="text-3xl font-bold text-primary mb-4">
                  {formatPrice(property.price, property.priceType)}
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {property.bedrooms && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Bed className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </CardContent>
                  </Card>
                )}
                {property.bathrooms && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Bath className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </CardContent>
                  </Card>
                )}
                <Card>
                  <CardContent className="p-4 text-center">
                    <Square className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{property.area}</div>
                    <div className="text-sm text-gray-600">sq.ft</div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
                  
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                      {property.contactPerson || "Pratham Associates"}
                    </div>
                    <div className="text-gray-600">Property Consultant</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Button 
                      className="w-full phone-link"
                      onClick={() => window.open(`tel:${property.contactPhone || "+919911926000"}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open("https://wa.me/919911926000", "_blank")}
                    >
                      WhatsApp
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Visit
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Office Hours:</p>
                    <p>Mon-Sat: 9:00 AM - 7:00 PM</p>
                    <p>Sunday: 10:00 AM - 5:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
