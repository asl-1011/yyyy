/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

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

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 🛡️ Clickjacking protection
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // 🛡️ CSP
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : "'unsafe-inline'"} https: http:;
              style-src 'self' 'unsafe-inline' https:;
              img-src 'self' data: https:;
              font-src 'self' https:;
              connect-src 'self' https: wss:;
              media-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, " ").trim(),
          },

          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "no-referrer, strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
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
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
