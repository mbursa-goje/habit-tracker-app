"use client";

import SplashScreen from "@/components/shared/SplashScreen";
import { isSession } from "@/lib/auth";
import { SPLASH_DELAY_MS, STORAGE_KEYS } from "@/lib/constants";
import { readLocalStorageValue, removeLocalStorageValue } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function hasStoredSession() {
  const session = readLocalStorageValue<unknown>(STORAGE_KEYS.session, null);

  if (!session) {
    return false;
  }

  if (isSession(session)) {
    return true;
  }

  removeLocalStorageValue(STORAGE_KEYS.session);
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
