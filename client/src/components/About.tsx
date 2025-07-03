import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, Building, Award } from "lucide-react";

export default function About() {
  const stats = [
    { icon: Building, value: "500+", label: "Properties Sold" },
    { icon: Users, value: "1000+", label: "Happy Clients" },
    { icon: Award, value: "10+", label: "Years Experience" },
    { icon: Star, value: "4.9", label: "Customer Rating" }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              About <span className="text-primary">Anupam Properties</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              With over a decade of excellence in real estate, Anupam Properties has been the trusted partner for thousands of families and investors in Faridabad. We specialize in premium residential and commercial properties that define luxury living.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Our commitment to transparency, customer satisfaction, and innovative technology like AI-powered property matching sets us apart in the real estate industry.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardContent className="p-6 text-center">
                      <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold">
              Learn More About Us
            </Button>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Anupam Properties Office" 
              className="rounded-2xl shadow-2xl w-full"
            />
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-800">4.9/5 Rating</div>
                  <div className="text-sm text-gray-600">Customer Reviews</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
