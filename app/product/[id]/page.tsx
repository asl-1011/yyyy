import { notFound } from "next/navigation"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductVariantSelector } from "@/components/product-variant-selector"
import { formatPrice, getStockStatus, getCategoryDisplayName } from "@/lib/utils/product"
import { Star, Truck, Shield, RotateCcw, Award, Leaf, Clock } from "lucide-react"

async function getProduct(id: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${id}`, {
      cache: "no-store",
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

async function getRecommendations(productId: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/recommendations?productId=${productId}&limit=4`, {
      cache: "no-store",
    })
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return []
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [product, recommendations] = await Promise.all([getProduct(params.id), getRecommendations(params.id)])

  if (!product) {
    notFound()
  }

  const stockStatus = getStockStatus(product.stock)
  const primaryImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <ProductImageGallery images={product.images} productName={product.name} />
            ) : (
              <div className="relative">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
                />
                {stockStatus.status === "out-of-stock" && (
                  <Badge variant="destructive" className="absolute top-4 right-4">
                    Out of Stock
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{getCategoryDisplayName(product.category)}</Badge>
                {product.certifications?.map((cert: string) => (
                  <Badge key={cert} variant="secondary" className="bg-green-100 text-green-800">
                    <Leaf className="h-3 w-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

              {product.origin && <p className="text-sm text-muted-foreground">Origin: {product.origin}</p>}

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.8)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${stockStatus.color}`}>{stockStatus.message}</span>
              </div>
            </div>

            {product.variants && product.variants.length > 0 && (
              <ProductVariantSelector variants={product.variants} productId={product._id} productName={product.name} />
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <AddToCartButton
                productId={product._id}
                productName={product.name}
                stock={product.stock}
                className="w-full lg:w-auto"
              />
            </div>

            {/* Enhanced Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Free delivery above ₹500</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">100% authentic</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Easy returns</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Premium quality</span>
              </div>
              {product.shelf_life && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Shelf life: {product.shelf_life}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.detailed_description && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Detailed Description</h3>
                        <p className="text-muted-foreground leading-relaxed">{product.detailed_description}</p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {product.origin && (
                        <div>
                          <h4 className="font-medium mb-1">Origin</h4>
                          <p className="text-sm text-muted-foreground">{product.origin}</p>
                        </div>
                      )}

                      {product.shelf_life && (
                        <div>
                          <h4 className="font-medium mb-1">Shelf Life</h4>
                          <p className="text-sm text-muted-foreground">{product.shelf_life}</p>
                        </div>
                      )}

                      {product.storage_instructions && (
                        <div>
                          <h4 className="font-medium mb-1">Storage</h4>
                          <p className="text-sm text-muted-foreground">{product.storage_instructions}</p>
                        </div>
                      )}

                      {product.certifications && product.certifications.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Certifications</h4>
                          <div className="flex flex-wrap gap-1">
                            {product.certifications.map((cert: string) => (
                              <Badge key={cert} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {product.nutrition_facts ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Nutrition Facts (per 100g)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {product.nutrition_facts.calories_per_100g && (
                          <div className="flex justify-between">
                            <span>Calories</span>
                            <span className="font-medium">{product.nutrition_facts.calories_per_100g} kcal</span>
                          </div>
                        )}
                        {product.nutrition_facts.protein && (
                          <div className="flex justify-between">
                            <span>Protein</span>
                            <span className="font-medium">{product.nutrition_facts.protein}</span>
                          </div>
                        )}
                        {product.nutrition_facts.carbs && (
                          <div className="flex justify-between">
                            <span>Carbohydrates</span>
                            <span className="font-medium">{product.nutrition_facts.carbs}</span>
                          </div>
                        )}
                        {product.nutrition_facts.fat && (
                          <div className="flex justify-between">
                            <span>Fat</span>
                            <span className="font-medium">{product.nutrition_facts.fat}</span>
                          </div>
                        )}
                        {product.nutrition_facts.fiber && (
                          <div className="flex justify-between">
                            <span>Fiber</span>
                            <span className="font-medium">{product.nutrition_facts.fiber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nutrition information not available for this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {product.health_benefits && product.health_benefits.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Health Benefits</h3>
                      <ul className="space-y-2">
                        {product.health_benefits.map((benefit: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Leaf className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Health benefits information not available for this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {product.usage_instructions ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Usage Instructions</h3>
                      <p className="text-muted-foreground leading-relaxed">{product.usage_instructions}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Usage instructions not available for this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">You might also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((product: any) => (
                <Card key={product._id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={250}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                        <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                      </div>
                      <AddToCartButton
                        productId={product._id}
                        productName={product.name}
                        stock={product.stock}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
