"use client";

import * as React from "react";

/**
 * Cloudflare Turnstile widget.
 *
 * Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in .env.local to enable.
 * The widget renders a hidden challenge and exposes the token via
 * `onSuccess(token)`.
 */

export function Turnstile({ onSuccess }: { onSuccess: (token: string) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  // ready state reserved for future loading indicator
  void ready;

  React.useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey || !ref.current) return;

    // Load Turnstile script if not already present
    let script: HTMLScriptElement | undefined;
    if (!document.querySelector('script[src*="challenges.cloudflare.com"]')) {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const init = () => {
      if (!ref.current || !window.turnstile) return;
      window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: onSuccess,
        "error-callback": () => {
          console.warn("[turnstile] verification failed");
        },
      });
      setReady(true);
    };

    if (window.turnstile) {
      init();
    } else if (script) {
      script.addEventListener("load", init);
    }
  }, [onSuccess]);

  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return null;

  return <div ref={ref} className="flex justify-center py-2" />;
}

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId: number) => void;
    };
  }
}
