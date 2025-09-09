/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)", // apply to all routes
        headers: [
          // Clickjacking protection
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
          // MIME sniffing protection
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Legacy XSS protection (for old browsers)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Safer referrer policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Enforce HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Cross-origin isolation headers
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          // Modern permissions policy (formerly Feature-Policy)
          {
            key: "Permissions-Policy",
            value: "geolocation=(), camera=(), microphone=(), payment=()",
          },
          // Flash/Adobe cross-domain policy (extra hardening)
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
          // Clear site data on logout (optional)
          // {
          //   key: "Clear-Site-Data",
          //   value: '"cache", "cookies", "storage", "executionContexts"',
          // },
        ],
      },
    ]
  },
}

export default nextConfig
