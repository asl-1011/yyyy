import { Navigation } from "@/components/navigation";
import Hero from "@/components/hero";
import { TrustSignals } from "@/components/trust-signals";
import { UrgencyBanner } from "@/components/urgency-banner";
import { SocialProof } from "@/components/social-proof";
import { Testimonials } from "@/components/testimonials";
import Footer from "@/components/footer";
import { Award, Truck, Shield, Star } from "lucide-react";
import { ShopByCategory } from "@/components/shop-by-category";
import ProfileCard from "@/components/ProfileCard"; // <-- Import your ProfileCard

async function getCategories() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/products/categories`, {
    cache: "no-store",
  });
  return await response.json();
}

const teamMembers = [
  {
    role: "CEO",
    name: "Birla K Abraham",
    quote: "Innovation distinguishes between a leader and a follower.",
    image: "https://static.vecteezy.com/system/resources/previews/051/353/497/large_2x/man-in-checkered-red-shirt-portrait-photo.jpeg", // Example image
  },
  {
    role: "UI/UX Developer",
    name: "Akhil Antony",
    quote: "Innovation distinguishes between a leader and a follower.",
    image: "https://static.vecteezy.com/system/resources/previews/048/989/191/large_2x/fashionable-male-in-a-lightweight-jacket-soft-beige-background-modern-portrait-relaxed-style-contemporary-fashion-free-photo.jpg", // Example image
  },
  {
    role: "Lead Designer",
    name: "Cathy Lee",
    quote: "Design is intelligence made visible.",
    image: "https://static.vecteezy.com/system/resources/previews/069/238/081/non_2x/portrait-of-a-woman-looking-upward-with-blonde-hair-and-fair-skin-free-photo.jpg", // Example image
  },
];

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      {/* <TrustSignals /> */}

      {/* Features Section */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Hand-picked products from trusted sources</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Quick and secure delivery to your doorstep</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">100% Natural</h3>
              <p className="text-sm text-muted-foreground">No artificial colors or preservatives</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Trusted Brand</h3>
              <p className="text-sm text-muted-foreground">Over 10,000 satisfied customers</p>
            </div>
          </div>
        </div>
      </section>
      {/* ... your existing features code ... */}

      {/* Shop By Category */}
      {/* <ShopByCategory categories={categories} /> */}

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <ProfileCard
                key={member.name}
                role={member.role}
                name={member.name}
                quote={member.quote}
                image={member.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      <SocialProof />
      <Footer />
    </div>
  );
}
