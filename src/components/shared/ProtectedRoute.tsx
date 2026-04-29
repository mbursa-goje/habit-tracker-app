"use client";

import { isSession } from "@/lib/auth";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  removeLocalStorageValue,
  useLocalStorageValue,
} from "@/lib/storage";
import { type ReactNode, useEffect, useSyncExternalStore } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
};

function subscribeToHydration() {
  return () => undefined;
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export default function ProtectedRoute({
  children,
  fallback = <div className="p-8 text-slate-500">Loading...</div>,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const hasCheckedClientStorage = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const storedSession = useLocalStorageValue<unknown>(
    STORAGE_KEYS.session,
    null,
  );
  const session = isSession(storedSession) ? storedSession : null;

  useEffect(() => {
    if (!hasCheckedClientStorage) {
      return;
    }

    if (!storedSession) {
      window.location.href = redirectTo;
      return;
    }

    if (!session) {
      removeLocalStorageValue(STORAGE_KEYS.session);
      window.location.href = redirectTo;
    }
  }, [hasCheckedClientStorage, redirectTo, session, storedSession]);

  if (!hasCheckedClientStorage || !session) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
