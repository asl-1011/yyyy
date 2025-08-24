"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Star } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  tags: string[];
  images: Array<{
    url: string;
    alt?: string;
    is_primary: boolean;
  }>;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: Product;
  quantity?: number; // 👈 made optional
  onAdd?: () => void; // 👈 made optional
  onRemove?: () => void; // 👈 made optional
}

export const ProductCard = ({
  product,
  quantity = 0,
  onAdd = () => {},
  onRemove = () => {},
}: ProductCardProps) => {
  const primaryImage =
    product.images.find((img) => img.is_primary) || product.images[0];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));

  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1">
      <CardContent className="p-0">
        {/* ==== IMAGE ==== */}
        <div className="relative bg-gradient-to-br from-background/50 to-muted/30 p-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted/20 ring-1 ring-border/20">
            <img
              src={primaryImage?.url}
              alt={primaryImage?.alt || product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-primary/90 to-accent/90 text-primary-foreground text-[10px] font-medium rounded-full backdrop-blur-sm">
            PREMIUM
          </div>

          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-medium rounded-full backdrop-blur-sm animate-pulse">
              Only {product.stock} left
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl backdrop-blur-sm">
              <div className="px-3 py-1 bg-destructive/90 text-destructive-foreground text-xs font-medium rounded-full">
                Out of Stock
              </div>
            </div>
          )}
        </div>

        {/* ==== DETAILS ==== */}
        <div className="p-4 space-y-3 bg-gradient-to-br from-card to-card/90">
          {/* Category */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                product.category === "spices"
                  ? "bg-orange-500"
                  : product.category === "tea"
                  ? "bg-green-500"
                  : "bg-purple-500"
              }`}
            />
            <span className="text-xs font-medium text-primary capitalize tracking-wide">
              {product.category.replace("-", " ")}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.rating || 4.2)}</div>
            <span className="text-xs font-medium text-foreground">
              {(product.rating || 4.2).toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount || Math.floor(Math.random() * 100) + 10})
            </span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(Math.floor(product.price * 1.25))}
              </span>
              <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                20% OFF
              </span>
            </div>
            <div className="text-xs text-primary font-medium">
              ✨ FREE delivery • Prime eligible
            </div>
          </div>

          {/* ==== CART CONTROLS ==== */}
          <div className="pt-2">
            {quantity === 0 ? (
              <Button
                onClick={onAdd}
                disabled={product.stock === 0}
                className="w-full h-10 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                Add to Cart
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Quantity Control */}
                <div className="flex items-center bg-muted/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/30">
                  <Button
                    onClick={onRemove}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-xl hover:bg-background/50"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-semibold px-3 min-w-[2rem] text-center text-foreground">
                    {quantity}
                  </span>
                  <Button
                    onClick={onAdd}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-xl hover:bg-background/50"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Buy Now */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs px-3 h-9 rounded-xl border-primary/30 hover:bg-primary hover:text-primary-foreground font-medium"
                >
                  Buy Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
