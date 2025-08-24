"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart-context"; // adjust path if needed
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  tags: string[];
  images?: Array<{
    url: string;
    alt?: string;
    is_primary?: boolean;
  }>;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { data: session } = useSession();
  const { cart, addToCart, updateQuantity, loading } = useCart();
  const { toast } = useToast();

  // Ensure images is always a safe array
  const images = Array.isArray(product.images) ? product.images : [];

  // Pick primary image or fallback
  const primaryImage =
    images.find((img) => img.is_primary) ||
    images[0] || {
      url: "/placeholder.png",
      alt: product.name,
    };

  // find current cart item
  const cartItem = cart?.products.find(
    (item) => item.productId._id === product.id
  );
  const currentQuantity = cartItem?.quantity || 0;

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
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));

  const handleAdd = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    const success = await addToCart(product.id, 1);
    if (success) {
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 0 || newQuantity > product.stock) return;

    const success = await updateQuantity(product.id, newQuantity);
    if (success) {
      toast({
        title: "Cart Updated",
        description:
          newQuantity === 0 ? "Item removed from cart" : "Quantity updated",
      });
    }
  };

  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border border-border/50 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 rounded-xl sm:rounded-2xl">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative bg-gradient-to-br from-background/50 to-muted/30">
          <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-background to-muted/20 ring-1 ring-border/20">
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Premium Badge */}
          <div className="absolute top-2 left-2">
            <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-primary/90 to-accent/90 text-primary-foreground text-[10px] sm:text-xs font-medium rounded-full backdrop-blur-sm">
              PREMIUM
            </div>
          </div>

          {/* Stock Badges */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 right-2 px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] sm:text-xs font-medium rounded-full backdrop-blur-sm animate-pulse">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl sm:rounded-2xl backdrop-blur-sm">
              <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-destructive/90 text-destructive-foreground text-[10px] sm:text-xs font-medium rounded-full">
                Out of Stock
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gradient-to-br from-card to-card/90">
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
            ></div>
            <span className="text-[10px] sm:text-xs font-medium text-primary capitalize tracking-wide">
              {product.category.replace("-", " ")}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex">{renderStars(product.rating || 4.2)}</div>
            <span className="text-[10px] sm:text-xs font-medium text-foreground">
              {(product.rating || 4.2).toFixed(1)}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              ({product.reviewCount || Math.floor(Math.random() * 100) + 10})
            </span>
          </div>

          {/* Price */}
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                {formatPrice(Math.floor(product.price * 1.25))}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 sm:px-2 py-0.5 rounded-full">
                20% OFF
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-primary font-medium">
              ✨ FREE delivery • Prime eligible
            </div>
          </div>

          {/* Cart Actions */}
          <div className="pt-1 sm:pt-2">
            {currentQuantity === 0 ? (
              <Button
                onClick={handleAdd}
                disabled={product.stock === 0 || loading}
                className="w-full h-8 sm:h-10 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium text-xs sm:text-sm rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all"
              >
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Add to Cart
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Quantity controls */}
                <div className="flex items-center bg-muted/50 rounded-lg sm:rounded-xl overflow-hidden border border-border/30">
                  <Button
                    onClick={() => handleUpdateQuantity(currentQuantity - 1)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg sm:rounded-xl hover:bg-background/50"
                    disabled={loading}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="text-xs sm:text-sm font-semibold px-2 sm:px-3 min-w-[1.5rem] sm:min-w-[2rem] text-center">
                    {currentQuantity}
                  </span>
                  <Button
                    onClick={() => handleUpdateQuantity(currentQuantity + 1)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg sm:rounded-xl hover:bg-background/50"
                    disabled={loading || currentQuantity >= product.stock}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                {/* Buy Now (hidden on xs) */}
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex flex-1 text-xs sm:text-sm h-8 sm:h-10 rounded-lg sm:rounded-xl border-primary/30 hover:bg-primary hover:text-primary-foreground font-medium"
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
