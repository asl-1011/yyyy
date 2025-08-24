"use client";

import { Button } from "@/components/ui/button";
import TypewriterText from "@/components/TypewriterText";
import { Playfair_Display, Dancing_Script, Inter } from "next/font/google";

// Import fonts
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const dancing = Dancing_Script({ subsets: ["latin"], weight: ["400","700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700"] });

const Hero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/hero-spices.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className={`${playfair.className} text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-up`}>
          Premium Indian
          <span className={`${dancing.className} block text-accent-foreground text-5xl md:text-7xl`}>
            <TypewriterText
              texts={["Spices...", "Tea powder", "Dry fruits","kerala cloths"]}
              speed={150}
              delay={2500}
              className="text-yellow-200"
            />
          </span>
        </h1>

        <p className={`${inter.className} text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto animate-slide-in`}>
          Discover the finest quality cardamom, tea powder, turmeric, and traditional spices
          sourced directly from Indian farms. Pure. Fresh. Authentic.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="hero"
            size="lg"
            onClick={scrollToProducts}
            className="text-lg px-8 py-3"
          >
            Shop Now
          </Button>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
