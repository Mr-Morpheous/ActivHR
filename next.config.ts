import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // There is a stray package-lock.json in the Windows home directory, so
  // Next inferred C:\Users\PAC as the workspace root and warned on every
  // build. Harmless locally; on a standalone/Railway build it decides which
  // files get traced and copied, so an inferred root two levels too high
  // either bloats the output or misses files. Pinned to this directory.
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),

  // PowerSync's Web SDK ships wa-sqlite as WebAssembly loaded from a worker.
  // Turbopack needs static image optimisation off so the .wasm assets copied
  // into public/@powersync/ by the postinstall are served untouched.
  images: { disableStaticImages: true },
  turbopack: {},

  // Only consulted for `next build --webpack` / older tooling; Turbopack
  // ignores this block. Kept so a webpack build doesn't fail on the .wasm.
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },

  /**
   * No headers were set at all before this.
   *
   * It matters more here than in a typical app: src/lib/supabase/cookies.ts
   * deliberately does NOT set httpOnly, because the browser Supabase client has
   * to read the session, and its stated mitigation is "nothing renders
   * untrusted HTML". That is true today — there is no dangerouslySetInnerHTML,
   * innerHTML, eval or new Function anywhere in src/ — so these are the second
   * layer for the day it stops being true.
   *
   * STRICT-TRANSPORT-SECURITY IS DELIBERATELY ABSENT.
   *
   * Vercel already sends `max-age=63072000; includeSubDomains; preload`, which
   * is two years and preload-eligible. The value this project's own security
   * plan specified was one year without preload — setting it here would
   * override the platform's with something weaker. Verified against the live
   * deployment before leaving it out.
   *
   * CSP is Report-Only for now: the motion layer and the Supabase client need a
   * real measurement pass before anything is enforced, and a CSP that breaks
   * sign-in is worse than none. Promote it once the reports are quiet.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Clickjacking. sameSite=lax already stops the auth cookie riding a
          // cross-site frame, so this is belt to that braces.
          { key: "X-Frame-Options", value: "DENY" },
          // geolocation stays self-enabled: /checkin cannot work without it.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
