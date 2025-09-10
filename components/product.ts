// lib/products.ts
import { URLSearchParams } from "node:url"; // Optional, TS-safe

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  createdAt?: string;
}

export interface GetProductsParams {
  selectedCategory?: string;
  searchTerm?: string;
  sortBy?: "name" | "price-low" | "price-high";
}

export async function getProducts({
  selectedCategory = "all",
  searchTerm = "",
  sortBy = "name",
}: GetProductsParams): Promise<Product[]> {
  try {
    const params = new URLSearchParams({
      category: selectedCategory,
      search: searchTerm,
      sortBy,
    });

    const res = await fetch(`${process.env.API_URL}/products?${params.toString()}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data?.error || "Failed to fetch products");

    // Ensure array of products
    if (!Array.isArray(data.products)) return [];
    return data.products as Product[];
  } catch (err) {
    console.error("getProducts error:", err);
    return [];
  }
}
