// /lib/products.ts
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// Fully typed ProductType matching your Mongoose schema
export interface ProductType {
  _id: string;
  name: string;
  category: "spices" | "dry-fruits" | "tea";
  price: number;
  stock: number;
  description: string;
  detailed_description?: string;
  origin?: string;
  shelf_life?: string;
  storage_instructions?: string;
  certifications?: string[];
  nutrition_facts?: {
    calories_per_100g?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
    fiber?: string;
  };
  health_benefits?: string[];
  usage_instructions?: string;
  variants?: {
    weight: string;
    price: number;
    stock: number;
    sku?: string;
  }[];
  images?: {
    url: string;
    public_id: string;
    alt?: string;
    is_primary?: boolean;
  }[];
  tags?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  image_url?: string;
}

// Helper to convert a raw Mongoose product to plain ProductType
function toProductType(raw: any): ProductType {
  return {
    ...raw,
    _id: raw._id.toString(),
    createdAt: raw.createdAt?.toISOString(),
    updatedAt: raw.updatedAt?.toISOString(),
    images: raw.images?.map((img: any) => ({ ...img })),
    variants: raw.variants?.map((v: any) => ({ ...v })),
  };
}

// Fetch a single product by ID
export async function getProductById(id: string): Promise<ProductType | null> {
  await dbConnect();
  const product = await Product.findById(id).lean();
  if (!product) return null;
  return toProductType(product);
}

// Fetch recommendations (other products in the same category)
export async function getRecommendationsByProductId(
  id: string,
  limit = 4
): Promise<ProductType[]> {
  await dbConnect();

  const currentProduct = await Product.findById(id).lean();
  if (!currentProduct) return [];

  const recommendations = await Product.find({
    _id: { $ne: id },
    category: currentProduct.category,
  })
    .limit(limit)
    .lean();

  return recommendations.map(toProductType);
}
