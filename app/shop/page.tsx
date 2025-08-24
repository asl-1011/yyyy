"use client";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          category: selectedCategory,
          search: searchTerm,
          sortBy: sortBy === "name" ? "name" : sortBy.startsWith("price") ? "price" : "createdAt",
          sortOrder: sortBy === "price-low" ? "asc" : "desc",
        });

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        if (res.ok) {
          setProducts(data.products || []);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy]);

  const handleAddToCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        <div className="container mx-auto px-3 py-3 space-y-3">

          {/* Header */}
          <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              TastyDash Shop
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover our curated selection of premium spices, dry fruits, and teas
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search our premium collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-base"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {["all", "spices", "dry-fruits", "tea"].map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full"
              >
                {cat === "all" ? "All" : cat.replace("-", " ")}
              </Button>
            ))}
          </div>

          {/* Sort & Results */}
          <div className="flex justify-between items-center bg-card/50 rounded-xl p-2">
            <div className="text-sm">
              {loading ? "Loading..." : `${products.length} products`}
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
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {!loading && products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={cartItems[product.id] || 0}
                onAdd={() => handleAddToCart(product.id)}
                onRemove={() => handleRemoveFromCart(product.id)}
              />
            ))}
          </div>

          {/* No Results */}
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Shop;
