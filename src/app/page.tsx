"use client";

import SplashScreen from "@/components/shared/SplashScreen";
import { readLocalStorageValue, removeLocalStorageValue } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SPLASH_DELAY_MS = 1200;

function hasStoredSession() {
  const session = readLocalStorageValue<{
    userId?: unknown;
    email?: unknown;
  } | null>("habit-tracker-session", null);

  if (!session) {
    return false;
  }

  if (typeof session.userId === "string" && typeof session.email === "string") {
    return true;
  }

  removeLocalStorageValue("habit-tracker-session");
  return false;
}

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      router.replace(hasStoredSession() ? "/dashboard" : "/login");
    }, SPLASH_DELAY_MS);

    return () => window.clearTimeout(redirectTimer);
  }, [router]);

  return <SplashScreen />;
}
