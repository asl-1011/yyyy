import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment:
      "The quality of spices is exceptional! My dishes have never tasted better. Fast delivery and excellent packaging.",
    product: "Garam Masala Blend",
    avatar: "/indian-woman-smiling.png",
  },
  {
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    comment: "Authentic flavors that remind me of my grandmother's cooking. The cardamom is so fresh and aromatic!",
    product: "Green Cardamom",
    avatar: "/indian-man-smiling.png",
  },
  {
    name: "Anita Patel",
    location: "Ahmedabad",
    rating: 5,
    comment: "Best online spice store! The turmeric powder is pure and organic. Highly recommend to everyone.",
    product: "Organic Turmeric",
    avatar: "/indian-woman-cooking.png",
  },
]

export function Testimonials() {
  return (
    <section className="py-10 md:py-16 bg-muted">
      <div className="container mx-auto px-3 md:px-4">
        <div className="text-center space-y-2 md:space-y-4 mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">What Our Customers Say</h2>
          <p className="text-sm md:text-base text-muted-foreground">Join thousands of satisfied customers</p>
        </div>

        {/* Mobile = carousel | Desktop = grid */}
        <div className="md:grid md:grid-cols-3 gap-6 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow md:w-auto flex-shrink-0 w-[85%] snap-center mx-2"
            >
              <CardContent className="p-4 md:p-6 space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-sm md:text-base text-foreground italic leading-snug">
                  "{testimonial.comment}"
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-foreground text-sm md:text-base">{testimonial.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{testimonial.location}</p>
                    <p className="text-xs text-primary">Purchased: {testimonial.product}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
