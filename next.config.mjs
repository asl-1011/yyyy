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

  // 🚫 Hide Next.js fingerprints
  poweredByHeader: false, // removes "X-Powered-By: Next.js"

  async headers() {
    return [
      {
        source: "/(.*)", // apply to all routes
        headers: [
          // 🛡️ Clickjacking protection
          {
            key: "X-Frame-Options",
            value: "DENY", // never allow embedding
          },

          // 🛡️ Strong Content-Security-Policy (CSP)
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'strict-dynamic' https: 'unsafe-inline';
              style-src 'self' 'unsafe-inline' https:;
              img-src 'self' data: https:;
              font-src 'self' https:;
              connect-src 'self' https: wss:;
              media-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              require-trusted-types-for 'script';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, " ").trim(),
          },

          // 🛡️ MIME sniffing protection
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // 🛡️ Legacy XSS protection (mainly IE/old Chrome)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },

          // 🛡️ Referrer Policy
          {
            key: "Referrer-Policy",
            value: "no-referrer, strict-origin-when-cross-origin",
          },

          // 🛡️ HTTPS Strict Transport Security (HSTS)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // 🛡️ Cross-Origin Isolation (prevents Spectre-style attacks)
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

          // 🛡️ Restrict APIs & features
          {
            key: "Permissions-Policy",
            value: `
              accelerometer=(),
              autoplay=(),
              camera=(),
              clipboard-read=(),
              clipboard-write=(),
              display-capture=(),
              document-domain=(),
              encrypted-media=(),
              fullscreen=(),
              geolocation=(),
              gyroscope=(),
              magnetometer=(),
              microphone=(),
              midi=(),
              payment=(),
              usb=(),
              wake-lock=(),
              xr-spatial-tracking=()
            `.replace(/\s{2,}/g, " ").trim(),
          },

          // 🛡️ Block Adobe Flash/old plugins
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },

          // 🛡️ Optional: Force cache/cookie clearing on logout endpoints
          // {
          //   key: "Clear-Site-Data",
          //   value: '"cache", "cookies", "storage", "executionContexts"',
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
