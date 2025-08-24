"use client"

import { Navigation } from "@/components/navigation"
import Hero from "@/components/hero"
import { ShopByCategory } from "@/components/shop-by-category"
import { Testimonials } from "@/components/testimonials"
import { SocialProof } from "@/components/social-proof"
import Footer from "@/components/footer"

interface ClientHomePageProps {
  categories: any[]
}

export default function ClientHomePage({ categories }: ClientHomePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ShopByCategory categories={categories} />
      <Testimonials />
      <SocialProof />
      <Footer />
    </div>
  )
}
