"use client";

import Button from "@/components/Button";
import { useCallback, useEffect, useState } from "react";
import { WhatsNewCard } from "./WhatsNewCard";

/**
 * Bump this semver whenever you change the release notes below. Users who
 * have not acknowledged this version yet get the sheet once on their next open.
 */
export const WHATS_NEW_VERSION = "2.1.0";

const STORAGE_KEY = "piwo_whats_new_ack_version";

const SEMVER_RE = /^\d+\.\d+\.\d+$/u;

/** Semver compare: positive when a is newer than b. */
function compareSemver(a: string, b: string): number {
  const pa = a.split(".").map((x) => Number.parseInt(x, 10));
  const pb = b.split(".").map((x) => Number.parseInt(x, 10));
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) return da - db;
  }
  return 0;
}

function readSeenVersion(): string {
  if (typeof window === "undefined") return "0.0.0";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null || !SEMVER_RE.test(raw)) return "0.0.0";
    return raw;
  } catch {
    return "0.0.0";
  }
}

export type WhatsNewOverlayProps = {
  /**
   * `gate` (default): full-screen once after update, uses localStorage.
   * `inline`: same content in a card, always visible (e.g. changelogs screen).
   */
  mode?: "gate" | "inline";
};

export function WhatsNewOverlay({ mode = "gate" }: WhatsNewOverlayProps) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    if (mode === "inline") return;
    const seen = readSeenVersion();
    // Must run after mount: localStorage is unavailable during SSR and would
    // mismatch hydration if we read it during the initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-mount gate
    setOpen(compareSemver(WHATS_NEW_VERSION, seen) > 0);
  }, [mode]);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, WHATS_NEW_VERSION);
    } catch {
      /* ignore quota / private mode */
    }
    setOpen(false);
  }, []);

  if (mode === "inline") {
    return (
      <div className="mx-auto w-full flex justify-center items-center">
        <div className="w-full max-w-lg">
          <WhatsNewCard
            embedded
            headingId="whats-new-inline-title"
            footer={null}
          />
        </div>
      </div>
    );
  }

  if (open !== true || compareSemver(WHATS_NEW_VERSION, readSeenVersion()) <= 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col bg-background-100/95 backdrop-blur-sm p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whats-new-title"
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-lg flex-1 flex-col">
        <WhatsNewCard
          embedded={false}
          headingId="whats-new-title"
          footer={
            <div className="shrink-0 border-t border-greyYellow/30 p-4">
              <Button type="button" onClick={dismiss}>
                Begrepen
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
}
