import mongoose, { type Document, Schema } from "mongoose"

export interface IProductVariant {
  weight: string
  price: number
  stock: number
  sku?: string
}

export interface INutritionFacts {
  calories_per_100g?: number
  protein?: string
  carbs?: string
  fat?: string
  fiber?: string
}

export interface IProduct extends Document {
  name: string
  category: "spices" | "dry-fruits" | "tea"
  price: number
  stock: number
  description: string
  detailed_description?: string
  origin?: string
  shelf_life?: string
  storage_instructions?: string
  certifications?: string[]
  nutrition_facts?: INutritionFacts
  health_benefits?: string[]
  usage_instructions?: string
  variants?: IProductVariant[]
  images: {
    url: string
    public_id: string
    alt?: string
    is_primary?: boolean
  }[]
  tags: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["spices", "dry-fruits", "tea"],
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    detailed_description: { type: String },
    origin: { type: String },
    shelf_life: { type: String },
    storage_instructions: { type: String },
    certifications: [{ type: String }],
    nutrition_facts: {
      calories_per_100g: { type: Number },
      protein: { type: String },
      carbs: { type: String },
      fat: { type: String },
      fiber: { type: String },
    },
    health_benefits: [{ type: String }],
    usage_instructions: { type: String },
    variants: [
      {
        weight: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0 },
        sku: { type: String },
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        alt: { type: String },
        is_primary: { type: Boolean, default: false },
      },
    ],
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

// Create text index for search functionality
ProductSchema.index({
  name: "text",
  description: "text",
  tags: "text",
})

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
