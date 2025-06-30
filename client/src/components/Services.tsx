import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Key, Bot, TrendingUp, Scale, Handshake, Sparkles } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Home,
      title: "Property Sales",
      description: "Expert guidance for buying and selling residential and commercial properties with market insights.",
      features: ["Market valuation", "Legal documentation", "Negotiation support"]
    },
    {
      icon: Key,
      title: "Rental Services", 
      description: "Complete rental solutions for landlords and tenants with hassle-free management.",
      features: ["Tenant verification", "Rental agreements", "Property management"]
    },
    {
      icon: Bot,
      title: "AI Property Matching",
      description: "Advanced AI-powered recommendations to find properties that perfectly match your preferences.",
      features: ["Smart property search", "Personalized recommendations", "Market predictions"],
      highlight: true
    },
    {
      icon: TrendingUp,
      title: "Investment Consulting",
      description: "Strategic investment advice for building a profitable real estate portfolio.",
      features: ["ROI analysis", "Market trends", "Portfolio planning"]
    },
    {
      icon: Scale,
      title: "Legal Support",
      description: "Complete legal assistance for property transactions and documentation.",
      features: ["Property verification", "Title clearance", "Registration support"]
    },
    {
      icon: Handshake,
      title: "Property Management",
      description: "End-to-end property management services for maximum returns on investment.",
      features: ["Maintenance oversight", "Rent collection", "Performance reporting"]
    }
  ];

  return (
    <section id="services" className="py-20 gradient-primary text-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Comprehensive real estate solutions powered by AI technology for better property recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <service.icon className="w-10 h-10 mr-3" />
                    {service.highlight && (
                      <Sparkles className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="opacity-90 mb-6">{service.description}</p>
                  
                  <ul className="space-y-2 text-sm opacity-80">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {service.highlight && (
                    <div className="mt-6 p-3 bg-accent/20 rounded-lg">
                      <div className="flex items-center text-sm">
                        <Sparkles className="w-4 h-4 mr-2 text-accent" />
                        <span className="opacity-90">Powered by Gemini AI</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
