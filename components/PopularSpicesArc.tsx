"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PopularSpices() {
  const spices = [
    {
      name: "Turmeric Powder",
      image: "/termuric.webp",
      desc: "Rich in curcumin with powerful anti-inflammatory properties. Perfect for cooking curries, golden milk, and traditional remedies. This vibrant golden spice has been treasured for thousands of years.",
      benefits: ["Anti-inflammatory", "Antioxidant rich", "Boosts immunity"],
      origin: "India & Southeast Asia"
    },
    {
      name: "Cardamom",
      image: "https://images.pexels.com/photos/4022090/pexels-photo-4022090.jpeg?auto=compress&cs=tinysrgb&w=800",
      desc: "Known as the 'Queen of Spices', cardamom offers a unique sweet and floral aroma. Essential for Indian desserts, teas, and savory dishes. Its intense flavor elevates any culinary creation.",
      benefits: ["Digestive aid", "Fresh breath", "Heart health"],
      origin: "Western Ghats of India"
    },
    {
      name: "Black Pepper",
      image: "https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=800",
      desc: "The 'King of Spices' brings bold heat and complex flavor to dishes worldwide. Rich in piperine, it enhances nutrient absorption and adds that perfect spicy kick to any meal.",
      benefits: ["Enhances absorption", "Metabolism boost", "Rich in antioxidants"],
      origin: "Kerala, India"
    },
    {
      name: "Tea Powder",
      image: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800",
      desc: "Premium loose leaf tea powder perfect for authentic masala chai. Strong, aromatic, and refreshing with a robust flavor that pairs beautifully with milk and traditional spices.",
      benefits: ["Energy boost", "Rich in antioxidants", "Mental alertness"],
      origin: "Darjeeling & Assam"
    },
  ];

  const [active, setActive] = useState<string | null>(null);
  const activeSpice = spices.find((s) => s.name === active);

  const handleToggle = (spiceName: string) => {
    setActive(active === spiceName ? null : spiceName);
  };

  return (
    <section className="min-h-screen py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/30 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Premium Spices Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of authentic spices, each with unique flavors and health benefits
          </p>
        </motion.div>

        <div className="flex flex-col xl:flex-row items-center gap-16 max-w-7xl mx-auto">
          
          {/* Interactive Spice Display */}
          <div className="relative flex justify-center items-center w-full max-w-[700px] aspect-square">
            {/* Main Display Circle */}
            <motion.div 
              className="w-[80%] aspect-square rounded-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 relative flex items-center justify-center shadow-2xl border-8 border-card backdrop-blur-sm"
            >
              {/* Active spice in the center */}
              <AnimatePresence mode="wait">
                {activeSpice && (
                  <motion.div
                    key={activeSpice.name}
                    className="relative"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl border-8 border-card relative">
                      <img
                        src={activeSpice.image}
                        alt={`${activeSpice.name} spice`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <motion.div
                      className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-card px-5 py-3 rounded-full shadow-xl border"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-lg font-semibold text-foreground">{activeSpice.name}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!activeSpice && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="w-40 h-40 rounded-full bg-primary/30 flex items-center justify-center mb-4 mx-auto shadow-xl">
                    <span className="text-5xl">🌶️</span>
                  </div>
                  <p className="text-muted-foreground text-lg font-medium">Click a spice to explore</p>
                </motion.div>
              )}
            </motion.div>

            {/* Spice Selection Buttons */}
            {spices.map((spice, index) => {
              const angle = (index / (spices.length - 1)) * 200 - 100;
              const radius = 320;
              const isActive = active === spice.name;

              return (
                <motion.button
                  key={spice.name}
                  onClick={() => handleToggle(spice.name)}
                  aria-pressed={isActive}
                  className="absolute cursor-pointer group focus:outline-none"
                  animate={{
                    x: radius * Math.cos((angle * Math.PI) / 180),
                    y: radius * Math.sin((angle * Math.PI) / 180),
                    scale: isActive ? 1.3 : 1,
                    zIndex: isActive ? 20 : 10,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div
                    className={`w-28 h-28 rounded-full shadow-lg border-4 flex items-center justify-center overflow-hidden relative transition-all duration-300
                      ${isActive ? "border-primary shadow-primary/50" : "border-card shadow-muted/50 hover:border-primary/40"}`}
                  >
                    <img
                      src={spice.image}
                      alt={`${spice.name} spice`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-primary/20 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </div>
                  
                  {/* Spice name tooltip */}
                  <motion.div
                    className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
                    transition={{ duration: 0.2 }}
                  >
                    {spice.name}
                  </motion.div>
                </motion.button>
              );
            })}
          </div>

          {/* Enhanced Description Panel */}
          <div className="flex-1 max-w-2xl">
            <AnimatePresence mode="wait">
              {activeSpice ? (
                <motion.article
                  key={activeSpice.name}
                  initial={{ opacity: 0, x: 60, rotateY: -15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -60, rotateY: 15 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="bg-card/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border"
                >
                  <motion.h3 
                    className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {activeSpice.name}
                  </motion.h3>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <p className="text-foreground/80 text-lg leading-relaxed mb-4">
                      {activeSpice.desc}
                    </p>
                    <div className="bg-muted rounded-xl p-4 mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-semibold text-primary">Origin:</span> {activeSpice.origin}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="text-xl font-semibold text-foreground mb-4">Health Benefits</h4>
                    <div className="grid gap-3">
                      {activeSpice.benefits.map((benefit, index) => (
                        <motion.div
                          key={benefit}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center bg-accent/10 p-3 rounded-lg border border-accent/30"
                        >
                          <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                          <span className="text-foreground font-medium">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 p-4 bg-secondary rounded-xl border"
                  >
                    <h5 className="text-lg font-semibold text-primary mb-2">Did You Know?</h5>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {activeSpice.name === "Turmeric Powder" && "Turmeric contains over 300 chemical compounds and has been used in traditional medicine for over 4,000 years. It's often called 'Indian saffron' due to its golden color."}
                      {activeSpice.name === "Cardamom" && "Cardamom is the world's third most expensive spice by weight, after saffron and vanilla. Ancient Egyptians used it for teeth cleaning and breath freshening."}
                      {activeSpice.name === "Black Pepper" && "Black pepper was once so valuable it was used as currency. In ancient Rome, it was worth its weight in gold and was often referred to as 'black gold'."}
                      {activeSpice.name === "Tea Powder" && "Tea is the second most consumed beverage in the world after water. A single tea plant can produce tea for up to 100 years when properly maintained."}
                    </p>
                  </motion.div>
                </motion.article>
              ) : (
                <motion.article
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card/60 backdrop-blur-sm shadow-xl rounded-3xl p-8 border text-center"
                >
                  <div className="text-6xl mb-6">🌟</div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    Discover the World of Spices
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Click on any spice to learn about its fascinating history, unique properties, health benefits, and culinary applications. 
                    Discover the stories behind these incredible natural treasures that have shaped cuisines and cultures for millennia.
                  </p>
                  <div className="mt-6 flex justify-center space-x-2">
                    {['🌶️', '🧄', '🌿', '☕'].map((emoji, index) => (
                      <motion.div
                        key={index}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: index * 0.2,
                          ease: "easeInOut"
                        }}
                        className="text-2xl"
                      >
                        {emoji}
                      </motion.div>
                    ))}
                  </div>
                </motion.article>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
