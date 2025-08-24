"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, Leaf, X, ShoppingBag, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthStatus } from "@/components/auth-status"
import { useCart } from "./cart-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { LocationModal } from "@/components/LocationModal"

// 1. Import hooks for session and navigation
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Navigation() {
  // 2. Get session status and router instance
  const { data: session, status } = useSession();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("Select your location")
  const pathname = usePathname()
  const { cart, cartOpen, setCartOpen, updateQuantity } = useCart()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/shop?category=spices", label: "Spices" },
    { href: "/shop?category=dry-fruits", label: "Dry Fruits" },
    { href: "/shop?category=tea", label: "Tea" },
    { href: "/orders", label: "Orders" },
  ]

  const cartItems =
    cart?.products.map((item) => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image_url,
    })) || []

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
  }

  const handleCheckout = () => {
    alert("Proceeding to checkout")
    setCartOpen(false)
  }

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setLocationModalOpen(false)
  }
  
  // 3. Create a centralized handler for the location button click
  const handleLocationClick = () => {
    // If the session status is still being determined, do nothing.
    if (status === "loading") {
      return;
    }

    // If the user is not authenticated, redirect them to the sign-in page.
    if (status === "unauthenticated") {
      router.push("/signin"); // <-- IMPORTANT: Change this to your actual sign-in route
      return;
    }

    // If the user is authenticated, open the location modal.
    if (status === "authenticated") {
      setLocationModalOpen(true);
    }
  };


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-white/90 backdrop-blur-md shadow-sm transition-all">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group mr-auto">
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 opacity-80 animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-playfair font-bold text-xl bg-gradient-to-r from-emerald-600 via-green-700 to-teal-700 bg-clip-text text-transparent">
                  Wanted
                </span>
                <span className="font-source-sans text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                  Natural & Pure
                </span>
              </div>
            </Link>

            {/* Desktop Location Selector */}
            <div className="hidden md:flex items-center mr-4">
              {/* 4. Use the new handler and add a disabled state */}
              <button
                onClick={handleLocationClick}
                disabled={status === 'loading'}
                className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-full hover:bg-muted/70 transition disabled:opacity-50"
              >
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {status === 'loading' ? 'Loading...' : selectedLocation}
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 ml-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "?")
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative font-medium transition-colors duration-300 ${
                      isActive ? "text-emerald-600" : "text-foreground/80 hover:text-foreground"
                    } group`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                )
              })}
            </nav>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 h-4 w-4 group-focus-within:text-emerald-600 transition-colors duration-200" />
                <Input
                  placeholder="Search your product..."
                  className="pl-12 pr-4 py-3 bg-muted/50 border-border/60 rounded-full font-source-sans text-sm placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300 hover:bg-muted/70"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Desktop cart & auth */}
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative p-2 rounded-full hover:bg-muted/50 transition"
                >
                  <ShoppingBag className="h-5 w-5 text-foreground" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] bg-emerald-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
                <AuthStatus />
              </div>

              {/* Mobile buttons */}
              <div className="md:hidden flex items-center space-x-2">
                {/* Location button always visible */}
                {/* 4. Use the new handler and add a disabled state here too */}
                <button
                  onClick={handleLocationClick}
                  disabled={status === 'loading'}
                  className="relative p-2 rounded-full hover:bg-muted/50 transition disabled:opacity-50"
                >
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </button>

                {/* Cart button */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative p-2 rounded-full hover:bg-muted/50 transition"
                >
                  <ShoppingBag className="h-5 w-5 text-foreground" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] bg-emerald-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                {/* Mobile menu toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-muted/50 rounded-full p-2"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {/* Optional mobile search */}
                <Button variant="ghost" size="sm" className="hover:bg-muted/50 rounded-full p-2">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-[80vh] bg-white/95 backdrop-blur-md z-40 transform transition-transform duration-300 ${
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="container mx-auto px-4 py-6 flex flex-col justify-start h-full">
            <nav className="flex flex-col space-y-4 text-lg">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "?")
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-medium transition-colors duration-300 ${
                      isActive ? "text-emerald-600" : "text-foreground/80 hover:text-foreground"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-auto pt-4 border-t border-border/30">
              <AuthStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar deliveryLocation={selectedLocation} />

      {/* 5. Conditionally render the modal to avoid mounting it for logged-out users */}
      {status === 'authenticated' && (
        <LocationModal
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}
    </>
  )
}