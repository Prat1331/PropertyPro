import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Hero() {
  const [searchData, setSearchData] = useState({
    priceType: "",
    location: ""
  });
  const [aiPreferences, setAiPreferences] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const { toast } = useToast();

  const backgroundImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080', // Modern luxury home
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080', // Contemporary villa
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080', // Elegant modern house
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080', // Luxury apartment
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080'  // Premium residential
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change background every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const aiRecommendationMutation = useMutation({
    mutationFn: async (preferences: string) => {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences, userId: "anonymous" })
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "AI Recommendations Ready!",
        description: `Found ${data.properties.length} properties matching your preferences.`
      });
      // You could navigate to a results page or show recommendations
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get AI recommendations. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSearch = () => {
    if (!searchData.priceType && !searchData.location) {
      toast({
        title: "Search criteria required",
        description: "Please select at least one search criterion.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to properties page with search params
    const params = new URLSearchParams();
    if (searchData.priceType) params.append("priceType", searchData.priceType);
    if (searchData.location) params.append("location", searchData.location);
    
    window.location.href = `/properties?${params.toString()}`;
  };

  const handleAiSearch = () => {
    if (!aiPreferences.trim()) {
      toast({
        title: "Preferences required",
        description: "Please describe what you're looking for.",
        variant: "destructive"
      });
      return;
    }

    aiRecommendationMutation.mutate(aiPreferences);
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center hero-bg"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), 
                         url('${backgroundImages[currentBgIndex]}')`
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="hero-title font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find Your Dream
            <span className="text-accent block mt-2">Property</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover premium properties in Faridabad with Pratham Associates
          </motion.p>

          {/* Traditional Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="max-w-3xl mx-auto mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Select 
                      value={searchData.priceType}
                      onValueChange={(value) => setSearchData(prev => ({...prev, priceType: value}))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="For Sale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="pg">PG/Hostel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-2">
                    <Input
                      placeholder="Search location, project, or builder..."
                      value={searchData.location}
                      onChange={(e) => setSearchData(prev => ({...prev, location: e.target.value}))}
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSearch}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI-Powered Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="max-w-3xl mx-auto glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-accent mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">AI-Powered Property Search</h3>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Describe your ideal property... e.g., '3BHK apartment under 50L with gym and parking'"
                    value={aiPreferences}
                    onChange={(e) => setAiPreferences(e.target.value)}
                    className="flex-1"
                  />
                  
                  <Button 
                    onClick={handleAiSearch}
                    disabled={aiRecommendationMutation.isPending}
                    className="gradient-accent text-gray-800 font-semibold hover:shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {aiRecommendationMutation.isPending ? "Searching..." : "AI Search"}
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Powered by Gemini AI for personalized recommendations
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
