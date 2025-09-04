import { ScrollObserver } from "@/components/scroll-observer";
import { Award, Truck, Shield, Star, Zap, Globe, Heart, Users } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Hand-picked products from trusted sources worldwide",
    delay: 0
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and secure delivery to your doorstep",
    delay: 100
  },
  {
    icon: Shield,
    title: "100% Natural",
    description: "No artificial colors or preservatives",
    delay: 200
  },
  {
    icon: Star,
    title: "Trusted Brand",
    description: "Over 10,000 satisfied customers",
    delay: 300
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed and performance",
    delay: 400
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Available in over 50 countries",
    delay: 500
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Crafted with passion and attention to detail",
    delay: 600
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by the community, for the community",
    delay: 700
  }
];

export function Features() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <ScrollObserver animation="reveal-up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">Our Platform</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our premium features and exceptional service
            </p>
          </div>
        </ScrollObserver>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <ScrollObserver 
              key={feature.title} 
              animation="reveal-up" 
              delay={feature.delay}
            >
              <div className="group p-6 glass-card rounded-xl smooth-hover">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </ScrollObserver>
          ))}
        </div>
      </div>
    </section>
  );
}