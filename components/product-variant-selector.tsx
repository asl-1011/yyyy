"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { formatPrice, getStockStatus } from "@/lib/utils/product"

interface ProductVariant {
  weight: string
  price: number
  stock: number
  sku?: string
}

interface ProductVariantSelectorProps {
  variants: ProductVariant[]
  productId: string
  productName: string
}

export function ProductVariantSelector({ variants, productId, productName }: ProductVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(variants[0])

  const stockStatus = getStockStatus(selectedVariant.stock)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Select Weight</h3>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <Button
              key={variant.weight}
              variant={selectedVariant.weight === variant.weight ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedVariant(variant)}
              className="relative"
              disabled={variant.stock === 0}
            >
              {variant.weight}
              {variant.stock === 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs px-1">
                  Out
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{formatPrice(selectedVariant.price)}</span>
          <span className={`text-sm font-medium ${stockStatus.color}`}>{stockStatus.message}</span>
        </div>

        {selectedVariant.sku && <p className="text-xs text-muted-foreground">SKU: {selectedVariant.sku}</p>}
      </div>

      <AddToCartButton
        productId={productId}
        productName={`${productName} (${selectedVariant.weight})`}
        stock={selectedVariant.stock}
        price={selectedVariant.price}
        variant={selectedVariant.weight}
        className="w-full"
      />
    </div>
  )
}
