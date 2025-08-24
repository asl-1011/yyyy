"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, X, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

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
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory("")
    setPriceRange([0, 1000])
    router.push("/shop")
  }

  const hasActiveFilters = search || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-0 bg-slate-50 dark:bg-slate-800 rounded-xl focus-visible:ring-2 focus-visible:ring-orange-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-800 dark:text-slate-200">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={category.value}
                  checked={selectedCategory === category.value}
                  onCheckedChange={(checked) => {
                    setSelectedCategory(checked ? category.value : "")
                  }}
                  className="rounded data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <Label 
                  htmlFor={category.value} 
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                {category.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-800 dark:text-slate-200">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {brands.map((brand) => (
            <div key={brand.value} className="flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={brand.value}
                  className="rounded data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <Label 
                  htmlFor={brand.value} 
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 cursor-pointer"
                >
                  {brand.label}
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                {brand.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-800 dark:text-slate-200">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <Slider 
            value={priceRange} 
            onValueChange={setPriceRange} 
            max={1000} 
            min={0} 
            step={10} 
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">₹</span>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-20 h-8 text-xs border-slate-300 dark:border-slate-600 rounded-lg"
              />
            </div>
            <span className="text-slate-400">-</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">₹</span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-20 h-8 text-xs border-slate-300 dark:border-slate-600 rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <Button 
          onClick={applyFilters} 
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          Apply Filters
        </Button>
        <Button 
          onClick={clearFilters} 
          variant="outline" 
          className="w-full border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Clear All
        </Button>
      </div>
    </div>
  )
}