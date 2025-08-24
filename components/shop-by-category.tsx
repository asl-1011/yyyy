"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProductCardEnhanced } from "@/components/product-card-enhanced"

export function ShopByCategory({ categories }: { categories: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const url =
          selectedCategory === "all"
            ? `/api/products?limit=12`
            : `/api/products?category=${selectedCategory}&limit=12`

        const response = await fetch(url, { cache: "no-store" })
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [selectedCategory])

  return (
    <section className="py-10 sm:py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="text-center space-y-2 sm:space-y-4 mb-6 sm:mb-8">
          <p className="text-muted-foreground text-sm sm:text-base">
            Explore our premium collection
          </p>
        </div>

        {/* Category Buttons - Scrollable row on mobile */}
        <div className="overflow-x-auto no-scrollbar mb-6 sm:mb-8">
          <div className="flex space-x-2 sm:space-x-3 w-max">
            {/* Default "All" button */}
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="rounded-full px-4 py-1.5 sm:px-6 sm:py-2 whitespace-nowrap"
            >
              All
            </Button>

            {/* Dynamic categories */}
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={selectedCategory === cat.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.name)}
                className="rounded-full px-4 py-1.5 sm:px-6 sm:py-2 whitespace-nowrap"
              >
                {cat.displayName}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCardEnhanced key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm sm:text-base">
            No products found.
          </p>
        )}
      </div>
    </section>
  )
}
