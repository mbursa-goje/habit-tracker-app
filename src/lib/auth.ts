import { STORAGE_KEYS } from "@/lib/constants";
import { readLocalStorageValue } from "@/lib/storage";
import type { Session, User } from "@/types/auth";

export function createUserId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getStoredUsers(): User[] {
  return readLocalStorageValue<User[]>(STORAGE_KEYS.users, []);
}

export function isSession(value: unknown): value is Session {
  return (
    typeof value === "object" &&
    value !== null &&
    "userId" in value &&
    "email" in value &&
    typeof value.userId === "string" &&
    typeof value.email === "string"
  );
}
