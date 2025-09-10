"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images?: Array<{ url: string; alt?: string; is_primary?: boolean }>;
  rating?: number;
  reviewCount?: number;
}

interface ShopProps {
  initialProducts: Product[];
}

const Shop = ({ initialProducts }: ShopProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  // Client-side filtering & sorting
  useEffect(() => {
    setLoading(true);

    let filtered = [...initialProducts];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
    setLoading(false);
  }, [searchTerm, selectedCategory, sortBy, initialProducts]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        <div className="container mx-auto px-3 py-3 space-y-6">
          {/* Header */}
          <motion.div
            className="text-center space-y-4 py-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              TastyDash Shop
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover our curated selection of premium spices, dry fruits, and teas
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search our premium collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-base"
            />
          </motion.div>

          {/* Category Filters */}
          <motion.div
            className="flex gap-3 overflow-x-auto pb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {["all", "spices", "dry-fruits", "tea"].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full transition-all hover:scale-105"
              >
                {cat === "all" ? "All" : cat.replace("-", " ")}
              </Button>
            ))}
          </motion.div>

          {/* Sort & Results */}
          <motion.div
            className="flex justify-between items-center bg-card/50 rounded-xl p-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-sm">
              {loading ? "Loading..." : `${filteredProducts.length} products`}
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Product Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            <AnimatePresence>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-80 bg-muted/50 animate-pulse rounded-xl"
                    />
                  ))
                : filteredProducts.map((product, idx) => {
                    // Pick primary image
                    const images = Array.isArray(product.images) ? product.images : [];
                    const primaryImage =
                      images.find((img) => img.is_primary) || images[0] || {
                        url: "/placeholder.svg",
                        alt: product.name,
                      };

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-card rounded-xl overflow-hidden shadow hover:shadow-md transition">
                          <div className="relative aspect-square w-full">
                            <Image
                              src={`${primaryImage.url}?f_auto,q_auto,w=400,h=400`}
                              alt={primaryImage.alt || product.name}
                              fill
                              className="object-cover transition-all duration-500 hover:scale-105"
                              priority={idx === 0} // only first product is LCP image
                            />
                          </div>
                          <div className="p-3 space-y-2">
                            <h3 className="text-sm font-semibold line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="text-base font-bold text-foreground">
                              ₹{product.price.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {!loading && filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-lg font-medium">No products found</p>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Shop;
