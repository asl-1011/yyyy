const { MongoClient } = require("mongodb")

const products = [
  // Spices
  {
    name: "Premium Cardamom",
    category: "spices",
    price: 450,
    stock: 50,
    description: "Aromatic green cardamom pods, perfect for tea and desserts",
    image_url: "/placeholder-1qv4s.png",
    tags: ["aromatic", "premium", "green cardamom", "tea spice"],
    isActive: true,
  },
  {
    name: "Organic Turmeric Powder",
    category: "spices",
    price: 120,
    stock: 100,
    description: "Pure organic turmeric powder with high curcumin content",
    image_url: "/turmeric-powder.png",
    tags: ["organic", "curcumin", "anti-inflammatory", "cooking"],
    isActive: true,
  },
  {
    name: "Kashmiri Red Chili Powder",
    category: "spices",
    price: 180,
    stock: 75,
    description: "Mild heat with vibrant red color, perfect for Indian cuisine",
    image_url: "/red-chili-powder.png",
    tags: ["kashmiri", "mild heat", "vibrant color", "indian cuisine"],
    isActive: true,
  },
  {
    name: "Whole Cumin Seeds",
    category: "spices",
    price: 90,
    stock: 80,
    description: "Fresh cumin seeds with intense aroma and flavor",
    image_url: "/cumin-seeds.png",
    tags: ["whole spices", "aromatic", "tempering", "indian cooking"],
    isActive: true,
  },

  // Dry Fruits
  {
    name: "Premium Almonds",
    category: "dry-fruits",
    price: 650,
    stock: 60,
    description: "California almonds, rich in protein and healthy fats",
    image_url: "/almonds-dry-fruit.png",
    tags: ["california", "protein rich", "healthy snack", "premium quality"],
    isActive: true,
  },
  {
    name: "Medjool Dates",
    category: "dry-fruits",
    price: 380,
    stock: 40,
    description: "Large, soft Medjool dates - nature's candy",
    image_url: "/placeholder-ufzv5.png",
    tags: ["medjool", "soft dates", "natural sweetener", "energy boost"],
    isActive: true,
  },
  {
    name: "Mixed Dry Fruits",
    category: "dry-fruits",
    price: 550,
    stock: 35,
    description: "Premium mix of almonds, cashews, raisins, and walnuts",
    image_url: "/mixed-dry-fruits.png",
    tags: ["mixed", "gift pack", "healthy mix", "premium"],
    isActive: true,
  },
  {
    name: "Cashew Nuts",
    category: "dry-fruits",
    price: 720,
    stock: 45,
    description: "Whole cashew nuts, perfect for snacking and cooking",
    image_url: "/pile-of-cashews.png",
    tags: ["whole cashews", "creamy texture", "cooking", "snacking"],
    isActive: true,
  },

  // Tea
  {
    name: "Darjeeling Black Tea",
    category: "tea",
    price: 320,
    stock: 70,
    description: "Premium Darjeeling tea with muscatel flavor",
    image_url: "/darjeeling-black-tea.png",
    tags: ["darjeeling", "black tea", "muscatel", "premium"],
    isActive: true,
  },
  {
    name: "Earl Grey Tea",
    category: "tea",
    price: 280,
    stock: 55,
    description: "Classic Earl Grey with bergamot oil",
    image_url: "/earl-grey-tea.png",
    tags: ["earl grey", "bergamot", "classic", "aromatic"],
    isActive: true,
  },
  {
    name: "Green Tea",
    category: "tea",
    price: 250,
    stock: 90,
    description: "Antioxidant-rich green tea for health and wellness",
    image_url: "/green-tea-leaves.png",
    tags: ["green tea", "antioxidants", "health", "wellness"],
    isActive: true,
  },
  {
    name: "Masala Chai",
    category: "tea",
    price: 200,
    stock: 85,
    description: "Traditional Indian spiced tea blend",
    image_url: "/masala-chai-tea.png",
    tags: ["masala chai", "spiced tea", "traditional", "indian"],
    isActive: true,
  },
]

async function seedProducts() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()
    const collection = db.collection("products")

    // Clear existing products
    await collection.deleteMany({})

    // Insert new products
    const result = await collection.insertMany(products)
    console.log(`Inserted ${result.insertedCount} products`)

    // Create text index for search
    await collection.createIndex({
      name: "text",
      description: "text",
      tags: "text",
    })
    console.log("Created text index for search")
  } catch (error) {
    console.error("Error seeding products:", error)
  } finally {
    await client.close()
  }
}

seedProducts()
