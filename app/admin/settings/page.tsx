import { requireAdmin } from "@/lib/auth"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default async function AdminSettingsPage() {
  const session = await requireAdmin()

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your store settings and configuration</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue="Spice Bazaar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Contact Email</Label>
                  <Input id="storeEmail" type="email" defaultValue="info@spicebazaar.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Contact Phone</Label>
                  <Input id="storePhone" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea id="storeAddress" defaultValue="Mumbai, India" />
                </div>
                <Button>Save Store Information</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Business Number</Label>
                  <Input id="whatsappNumber" defaultValue="" />
                  <p className="text-xs text-muted-foreground">Include country code (e.g., +91 for India)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappMessage">Default Order Message Template</Label>
                  <Textarea
                    id="whatsappMessage"
                    rows={4}
                    defaultValue="🛒 New Order Received

📋 Order ID: {orderId}
🛍️ Cart ID: {cartId}

📦 Products:
{productList}

💰 Total Amount: ₹{totalPrice}

📍 Delivery Location:
{deliveryLocation}

Please confirm this order and provide payment details. Thank you! 🙏"
                  />
                </div>
                <Button>Save WhatsApp Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                  <Input id="freeShippingThreshold" type="number" defaultValue="500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingFee">Standard Shipping Fee (₹)</Label>
                  <Input id="shippingFee" type="number" defaultValue="50" />
                </div>
                <Button>Save Shipping Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current admin: {session.user.email}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newAdminEmail">Add New Admin Email</Label>
                  <Input id="newAdminEmail" type="email" placeholder="admin@example.com" />
                </div>
                <Button>Add Admin User</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
