export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: "name" | "price" | "createdAt" | "popular"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export function buildProductQuery(filters: ProductFilters) {
  const params = new URLSearchParams()

  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category)
  }

  if (filters.search) {
    params.append("search", filters.search)
  }

  if (filters.minPrice !== undefined) {
    params.append("minPrice", filters.minPrice.toString())
  }

  if (filters.maxPrice !== undefined) {
    params.append("maxPrice", filters.maxPrice.toString())
  }

  if (filters.sortBy) {
    params.append("sortBy", filters.sortBy)
  }

  if (filters.sortOrder) {
    params.append("sortOrder", filters.sortOrder)
  }

  if (filters.page) {
    params.append("page", filters.page.toString())
  }

  if (filters.limit) {
    params.append("limit", filters.limit.toString())
  }

  return params.toString()
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function getCategoryDisplayName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function getStockStatus(stock: number): {
  status: "in-stock" | "low-stock" | "out-of-stock"
  message: string
  color: string
} {
  if (stock === 0) {
    return {
      status: "out-of-stock",
      message: "Out of Stock",
      color: "text-red-600",
    }
  } else if (stock <= 5) {
    return {
      status: "low-stock",
      message: `Only ${stock} left`,
      color: "text-orange-600",
    }
  } else {
    return {
      status: "in-stock",
      message: "In Stock",
      color: "text-green-600",
    }
  }
}
