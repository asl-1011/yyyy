"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Filter, Search, X, SlidersHorizontal } from "lucide-react"

export function MobileFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [priceRange, setPriceRange] = useState([
    Number.parseInt(searchParams.get("minPrice") || "0"),
    Number.parseInt(searchParams.get("maxPrice") || "1000"),
  ])

  const categories = [
    { value: "", label: "All Categories", count: 156 },
    { value: "spices", label: "Spices", count: 45 },
    { value: "dry-fruits", label: "Dry Fruits", count: 32 },
    { value: "tea", label: "Tea", count: 28 },
  ]

  const brands = [
    { value: "premium-spice", label: "Premium Spice Co.", count: 24 },
    { value: "nature-fresh", label: "Nature Fresh", count: 18 },
    { value: "organic-valley", label: "Organic Valley", count: 15 },
  ]

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (selectedCategory) params.set("category", selectedCategory)
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 1000) params.set("maxPrice", priceRange[1].toString())

    router.push(`/shop?${params.toString()}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory("")
    setPriceRange([0, 1000])
    router.push("/shop")
    setIsOpen(false)
  }

  const hasActiveFilters = search || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000
  const activeFilterCount = [search, selectedCategory, priceRange[0] > 0 || priceRange[1] < 1000].filter(Boolean).length

  return (
    <div className="flex items-center gap-3">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus-visible:ring-2 focus-visible:ring-orange-500 shadow-sm"
        />
      </div>

      {/* Filter Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="relative border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 h-auto shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl border-t border-slate-200 dark:border-slate-700">
          <SheetHeader className="pb-6">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Filters & Search
              </SheetTitle>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mt-2" />
          </SheetHeader>

          <div className="space-y-6 pb-20 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full" />
                Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                      selectedCategory === category.value
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === category.value ? "" : category.value)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-slate-800 dark:text-slate-200">
                        {category.label}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                    <Checkbox
                      checked={selectedCategory === category.value}
                      className="absolute top-3 right-3 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-200 dark:bg-slate-700" />

            {/* Brands */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                Brands
              </h3>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <div key={brand.value} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={brand.value}
                        className="rounded data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label 
                        htmlFor={brand.value} 
                        className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        {brand.label}
                      </Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {brand.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-200 dark:bg-slate-700" />

            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full" />
                Price Range
              </h3>
              <div className="space-y-4">
                <Slider 
                  value={priceRange} 
                  onValueChange={setPriceRange} 
                  max={1000} 
                  min={0} 
                  step={10} 
                  className="w-full"
                />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm text-slate-600 dark:text-slate-400">Min Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="pl-8 rounded-xl border-slate-300 dark:border-slate-600"
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm text-slate-600 dark:text-slate-400">Max Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="pl-8 rounded-xl border-slate-300 dark:border-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-t-3xl">
            <div className="flex gap-3">
              <Button 
                onClick={clearFilters} 
                variant="outline" 
                className="flex-1 rounded-2xl border-slate-300 dark:border-slate-600 py-3"
              >
                Clear All
              </Button>
              <Button 
                onClick={applyFilters} 
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-2xl py-3 shadow-lg"
              >
                Show Results
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}