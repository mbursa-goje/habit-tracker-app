"use client";

import SplashScreen from "@/components/shared/SplashScreen";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SPLASH_DELAY_MS = 1200;

function hasStoredSession() {
  const sessionData = localStorage.getItem("habit-tracker-session");

  if (!sessionData) {
    return false;
  }

  try {
    const session = JSON.parse(sessionData) as {
      userId?: unknown;
      email?: unknown;
    };

    return typeof session.userId === "string" && typeof session.email === "string";
  } catch {
    localStorage.removeItem("habit-tracker-session");
    return false;
  }
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
