"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_CHANGE_EVENT = "habit-tracker-storage";

type StorageChangeDetail = {
  key: string;
};

function getSnapshotForKey(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

function emitStorageChange(key: string) {
  window.dispatchEvent(
    new CustomEvent<StorageChangeDetail>(STORAGE_CHANGE_EVENT, {
      detail: { key },
    }),
  );
}

function parseSnapshot<T>(snapshot: string | null, fallback: T): T {
  if (snapshot === null) {
    return fallback;
  }

  try {
    return JSON.parse(snapshot) as T;
  } catch {
    return fallback;
  }
}

export function useLocalStorageValue<T>(key: string, fallback: T): T {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => subscribeToLocalStorageKey(key, onStoreChange),
    () => getSnapshotForKey(key),
    () => null,
  );

  return useMemo(
    () => parseSnapshot(snapshot, fallback),
    [fallback, snapshot],
  );
}

export function readLocalStorageValue<T>(key: string, fallback: T): T {
  return parseSnapshot(getSnapshotForKey(key), fallback);
}

export function setLocalStorageValue<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  emitStorageChange(key);
}

export function removeLocalStorageValue(key: string) {
  localStorage.removeItem(key);
  emitStorageChange(key);
}

export function subscribeToLocalStorageKey(
  key: string,
  onStoreChange: () => void,
) {
  function handleStorage(event: StorageEvent) {
    if (event.key === key || event.key === null) {
      onStoreChange();
    }
  }

  function handleCustomStorage(event: Event) {
    const customEvent = event as CustomEvent<StorageChangeDetail>;

    if (customEvent.detail?.key === key) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_CHANGE_EVENT, handleCustomStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_CHANGE_EVENT, handleCustomStorage);
  };
}
