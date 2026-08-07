/** @type {import('next').NextConfig} */

// Content Security Policy. Kept relatively permissive because the app is a
// client-rendered SPA that talks to Supabase + several AI provider APIs, but
// it removes the most dangerous sinks (no wildcard object/embed, framing
// denied, base-uri locked). Tighten `connect-src` to your exact hosts.
const ContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js requires inline/eval for its runtime in dev; in prod 'unsafe-eval'
  // can be dropped if you are not using it.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.groq.com https://integrate.api.nvidia.com https://generativelanguage.googleapis.com https://api.oxlo.ai",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // NOTE: These two flags hide real type/lint errors from the production build
  // and should be removed once the existing errors are fixed. Left in place for
  // now only to avoid breaking the current deploy pipeline.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
