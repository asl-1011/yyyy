"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatPrice, getStockStatus } from "@/lib/utils/product"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/admin/image-upload"
import { Plus, Edit, Trash2 } from "lucide-react"

interface UploadedImage {
  url: string
  public_id: string
  alt?: string
  is_primary?: boolean
}

interface Product {
  _id: string
  name: string
  category: string
  price: number
  stock: number
  description: string
  image_url?: string // Keep for backward compatibility
  images?: UploadedImage[] // New multiple images field
  tags: string[]
  isActive: boolean
}

interface ProductManagementProps {
  initialProducts: Product[]
}

export function ProductManagement({ initialProducts }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    tags: "",
    images: [] as UploadedImage[], // Use images array instead of image_url
  })

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      tags: "",
      images: [], // Reset images array
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        images: formData.images,
        image_url: formData.images.find((img) => img.is_primary)?.url || formData.images[0]?.url || "",
      }

      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save product")
      }

      const savedProduct = await response.json()

      if (editingProduct) {
        setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? savedProduct : p)))
        toast({ title: "Product Updated", description: "Product has been updated successfully" })
      } else {
        setProducts((prev) => [savedProduct, ...prev])
        toast({ title: "Product Added", description: "New product has been added successfully" })
      }

      resetForm()
      setIsAddDialogOpen(false)
      setEditingProduct(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      tags: product.tags.join(", "),
      images:
        product.images || (product.image_url ? [{ url: product.image_url, public_id: "", is_primary: true }] : []),
    })
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      setProducts((prev) => prev.filter((p) => p._id !== productId))
      toast({ title: "Product Deleted", description: "Product has been deleted successfully" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Product Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
              isEditing={false}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock)
          const primaryImage =
            product.images?.find((img) => img.is_primary)?.url ||
            product.images?.[0]?.url ||
            product.image_url ||
            "/placeholder.svg"

          return (
            <Card key={product._id} className="group">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Image
                      src={primaryImage || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {!product.isActive && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Inactive
                      </Badge>
                    )}
                    {product.images && product.images.length > 1 && (
                      <Badge variant="secondary" className="absolute bottom-2 right-2">
                        +{product.images.length - 1} more
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                      <Badge variant="outline">{product.category.replace("-", " ")}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${stockStatus.color}`}>{stockStatus.message}</span>
                      <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          <ProductForm
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            loading={loading}
                            isEditing={true}
                          />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                        disabled={loading}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

interface ProductFormProps {
  formData: any
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  isEditing: boolean
}

function ProductForm({ formData, setFormData, onSubmit, loading, isEditing }: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spices">Spices</SelectItem>
              <SelectItem value="dry-fruits">Dry Fruits</SelectItem>
              <SelectItem value="tea">Tea</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, stock: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Product Images</Label>
        <ImageUpload
          images={formData.images}
          onImagesChange={(images) => setFormData((prev: any) => ({ ...prev, images }))}
          maxImages={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, tags: e.target.value }))}
          placeholder="organic, premium, aromatic"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
      </Button>
    </form>
  )
}
