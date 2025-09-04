"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import Hero from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { SocialProof } from "@/components/social-proof";
import Footer from "@/components/footer";
import { Award, Truck, Shield, Star, ArrowUp } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

// ✅ Scroll to Top Button
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-3 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:text-primary hover:shadow-xl focus:outline-none z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <ArrowUp className="h-5 w-5" />
    </motion.button>
  );
}

// ✅ Team Members Data
const teamMembers = [
  {
    role: "CEO",
    name: "Birla K Abraham",
    quote: "Innovation distinguishes between a leader and a follower.",
    image:
      "https://static.vecteezy.com/system/resources/previews/051/353/497/large_2x/man-in-checkered-red-shirt-portrait-photo.jpeg",
  },
  {
    role: "UI/UX Developer",
    name: "Akhil Antony",
    quote: "Innovation distinguishes between a leader and a follower.",
    image:
      "https://static.vecteezy.com/system/resources/previews/048/989/191/large_2x/fashionable-male-in-a-lightweight-jacket-soft-beige-background-modern-portrait-relaxed-style-contemporary-fashion-free-photo.jpg",
  },
  {
    role: "Lead Designer",
    name: "Cathy Lee",
    quote: "Design is intelligence made visible.",
    image:
      "https://static.vecteezy.com/system/resources/previews/069/238/081/non_2x/portrait-of-a-woman-looking-upward-with-blonde-hair-and-fair-skin-free-photo.jpg",
  },
];

// ✅ Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const { scrollY } = useScroll();

  // ✅ Subtle parallax for Hero
  const heroY = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero with Parallax */}
      <motion.div style={{ y: heroY }}>
        <Hero />
      </motion.div>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }} // 👈 replay animation
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We deliver exceptional quality and service that exceeds expectations
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }} // 👈 replay
            variants={staggerContainer}
          >
            {[
              {
                icon: Award,
                title: "Premium Quality",
                desc: "Hand-picked products from trusted sources",
                color: "text-yellow-600",
                bg: "bg-yellow-50",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "Quick and secure delivery to your doorstep",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Shield,
                title: "100% Natural",
                desc: "No artificial colors or preservatives",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Star,
                title: "Trusted Brand",
                desc: "Over 10,000 satisfied customers",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="text-center space-y-4 p-6 rounded-xl bg-white shadow-sm hover:shadow-md border border-gray-100"
                variants={fadeInUp}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}
              >
                <div
                  className={`w-16 h-16 ${item.bg} rounded-xl flex items-center justify-center mx-auto`}
                >
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }} // 👈 replay
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working together to create extraordinary
              experiences
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }} // 👈 replay
            variants={staggerContainer}
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
              >
                <ProfileCard
                  role={member.role}
                  name={member.name}
                  quote={member.quote}
                  image={member.image}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Testimonials />
      <SocialProof />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
