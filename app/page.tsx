"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { Navigation } from "@/components/navigation";
import Hero from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { SocialProof } from "@/components/social-proof";
import Footer from "@/components/footer";
import { Award, Truck, Shield, Star, ArrowUp } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

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
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

// ✅ Team Section
function TeamSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 2000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Passionate individuals working together to create extraordinary
            experiences
          </p>
        </motion.div>

        <div className="block md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex-[0_0_100%] px-4">
                  <ProfileCard {...member} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <ProfileCard {...member} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ✅ Popular Spices Section with SEO + Animation
function PopularSpices() {
  const spices = [
    { name: "Turmeric Powder", image: "/termuric.webp", desc: "Rich in curcumin, perfect for cooking and health benefits." },
    { name: "Cardamom", image: "/Cardamom_ambiente.webp", desc: "Aromatic spice often used in Indian desserts and teas." },
    { name: "Black Pepper", image: "/pepper.webp", desc: "Bold and spicy, known as the 'King of Spices'." },
    { name: "Tea Powder", image: "/chai_tea.webp", desc: "Strong, refreshing, and perfect for masala chai." },
  ];

  return (
    <section 
      className="py-16 bg-white"
      aria-labelledby="popular-spices-heading"
    >
      <div className="container mx-auto px-4">
        {/* ✅ Section Heading Animation */}
        <motion.h2
          id="popular-spices-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Popular Spices
        </motion.h2>

        {/* ✅ Spice Grid Animation */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1, 
              transition: { staggerChildren: 0.15 } 
            },
          }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {spices.map((spice, index) => (
            <motion.article
              key={spice.name}
              className="text-center group"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              aria-label={spice.name}
              itemScope
              itemType="https://schema.org/Product"
            >
              <img
                src={spice.image}
                alt={`${spice.name} - ${spice.desc}`}
                loading="lazy"
                className="w-full h-40 object-cover rounded-lg shadow group-hover:shadow-lg transition-shadow"
                itemProp="image"
              />
              <h3 
                className="mt-2 text-sm font-semibold text-gray-800" 
                itemProp="name"
              >
                {spice.name}
              </h3>
              <p className="text-xs text-gray-600" itemProp="description">
                {spice.desc}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* ✅ Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: spices.map((spice, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: spice.name,
              image: spice.image,
              description: spice.desc,
            })),
          }),
        }}
      />
    </section>
  );
}

export default function HomePage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ SEO Head */}
      <Head>
        <title>Wanted Spices | Buy Authentic Indian Spices, Dry Fruits & Tea Online</title>
        <meta
          name="description"
          content="Wanted Spices brings you premium Indian spices, dry fruits, and teas. Hand-picked, 100% natural, and delivered fresh to your doorstep."
        />
        <meta
          name="keywords"
          content="Wanted Spices, buy spices online, Indian spices, dry fruits, premium tea, organic spices"
        />
        <meta name="author" content="Wanted Spices" />

        {/* Open Graph */}
        <meta property="og:title" content="Wanted Spices | Premium Indian Spices & Dry Fruits" />
        <meta
          property="og:description"
          content="Buy authentic turmeric, cardamom, cumin, black pepper, and more from Wanted Spices."
        />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://spices-beige.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Wanted Spices",
              url: "https://spices-beige.vercel.app",
              logo: "https://spices-beige.vercel.app/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-7510616989",
                contactType: "customer service",
              },
            }),
          }}
        />
      </Head>

      <Navigation />

      {/* Hero */}
      <motion.div style={{ y: heroY }}>
        <Hero />
      </motion.div>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Why Choose Us</h2>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
              We deliver exceptional quality and service that exceeds expectations
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
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
                className="text-center space-y-2 p-4 rounded-lg bg-white shadow-sm hover:shadow-md border border-gray-100"
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div
                  className={`w-12 h-12 ${item.bg} rounded-lg flex items-center justify-center mx-auto`}
                >
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Spices */}
      <PopularSpices />

      {/* Team */}
      <TeamSection />

      <Testimonials />
      <SocialProof />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
