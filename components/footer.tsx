"use client"
import { MessageCircle, Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react"

const Footer = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_STORE_NUMBER

  const handleWhatsAppClick = () => {
    const message = "Hi! I'm interested in your spice products. Please share more details."
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <h3 className="text-lg font-bold">Wanted Spice</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Premium Indian spices and tea sourced directly from farms.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-white hover:text-pink-500 transition-colors" />
              </a>
              <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-white hover:text-blue-500 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#products" className="hover:text-primary-foreground">Products</a></li>
              <li><a href="#about" className="hover:text-primary-foreground">About Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Recipes</a></li>
              <li><a href="#" className="hover:text-primary-foreground">FAQs</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground">Spices</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Tea & Coffee</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Herbs</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Gift Sets</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <h4 className="font-semibold mb-2">Contact</h4>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
              <Phone className="w-4 h-4" />
              <span>{whatsappNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
              <Mail className="w-4 h-4" />
              <span>info@wantedspices.in</span>
            </div>
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm mt-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/70 gap-2">
          <p>&copy; 2024 Wanted Spice. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground">Terms</a>
            <a href="#" className="hover:text-primary-foreground">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
