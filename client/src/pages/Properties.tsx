import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Property } from "@shared/schema";

export default function Properties() {
  const [searchParams, setSearchParams] = useState({
    priceType: "",
    propertyType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: ""
  });

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/search", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "any") params.append(key, value);
      });
      
      const response = await fetch(`/api/properties/search?${params}`);
      return response.json();
    }
  });

  const handleSearch = () => {
    // The query will automatically refetch when searchParams change
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              All Properties in <span className="text-primary">Faridabad</span>
            </h1>
            <p className="text-xl text-gray-600">
              Discover your perfect property with advanced search filters
            </p>
          </div>

          {/* Search Filters */}
          <Card className="max-w-6xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Select
                  value={searchParams.priceType}
                  onValueChange={(value) => setSearchParams(prev => ({...prev, priceType: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Price Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="pg">PG/Hostel</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={searchParams.propertyType}
                  onValueChange={(value) => setSearchParams(prev => ({...prev, propertyType: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="pg">PG/Hostel</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Location or Sector"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams(prev => ({...prev, location: e.target.value}))}
                />

                <Select
                  value={searchParams.bedrooms}
                  onValueChange={(value) => setSearchParams(prev => ({...prev, bedrooms: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4">4+ BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Min Price"
                  type="number"
                  value={searchParams.minPrice}
                  onChange={(e) => setSearchParams(prev => ({...prev, minPrice: e.target.value}))}
                />
                <Input
                  placeholder="Max Price"
                  type="number"
                  value={searchParams.maxPrice}
                  onChange={(e) => setSearchParams(prev => ({...prev, maxPrice: e.target.value}))}
                />
              </div>

              <div className="flex justify-center">
                <Button onClick={handleSearch} className="px-8 py-3 bg-primary hover:bg-primary/90">
                  <Search className="w-4 h-4 mr-2" />
                  Search Properties
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {properties.length} Properties Found
            </h2>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
              <Button 
                onClick={() => setSearchParams({
                  priceType: "",
                  propertyType: "",
                  location: "",
                  minPrice: "",
                  maxPrice: "",
                  bedrooms: ""
                })}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
