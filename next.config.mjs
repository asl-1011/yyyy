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
          {
            key: "X-Frame-Options",
            value: "DENY", // prevents embedding in iframes
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none';", // modern replacement for X-Frame-Options
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // prevents MIME type sniffing
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block", // basic XSS protection (older browsers)
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // safer referrer handling
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload", // HSTS, requires HTTPS
          },
        ],
      },
    ]
  },
}

export default nextConfig
