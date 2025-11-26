"use client";

import { useEffect, useState } from "react";
import { persistCookieConsent } from "@/lib/cookie-utils";

interface CookieBannerProps {
  initialConsent: boolean;
}

export function CookieBanner({ initialConsent }: CookieBannerProps) {
  const [hasConsent, setHasConsent] = useState(initialConsent);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const handleConsent = () => setHasConsent(true);
    window.addEventListener(
      "msl-cookie-consent-granted",
      handleConsent as EventListener,
    );
    return () =>
      window.removeEventListener(
        "msl-cookie-consent-granted",
        handleConsent as EventListener,
      );
  }, []);

  const handleAccept = () => {
    persistCookieConsent();
    setHasConsent(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("msl-cookie-consent-granted"));
    }
  };

  if (hasConsent) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
        <p className="text-sm font-semibold text-slate-900">
          This site uses cookies for puzzle progress.
        </p>
        <p className="text-sm text-slate-600">
          We store a single cookie so that we can remember which Mini Sudoku
          levels you have completed. No ad-tech, tracking, or third-party data
          sharing is involved. By accepting, you agree to this storage.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Accept & continue
          </button>
          <a
            href="https://gdpr.eu/what-is-gdpr/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-500 underline"
          >
            Learn about GDPR
          </a>
        </div>
      </div>
    </div>
  );
}

