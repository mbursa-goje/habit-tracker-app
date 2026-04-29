// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { createUserId, getStoredUsers, isSession } from "../../src/lib/auth";
import { STORAGE_KEYS } from "../../src/lib/constants";
import type { User } from "../../src/types/auth";

afterEach(() => {
  localStorage.clear();
});

describe("auth helpers", () => {
  it("reads stored users from the required localStorage key", () => {
    const users: User[] = [
      {
        id: "user-1",
        email: "alex@example.com",
        password: "password123",
        createdAt: "2026-04-29T00:00:00.000Z",
      },
    ];

    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));

    expect(getStoredUsers()).toEqual(users);
  });

  it("returns an empty user list when storage is missing", () => {
    expect(getStoredUsers()).toEqual([]);
  });

  it("recognizes valid session objects", () => {
    expect(
      isSession({
        userId: "user-1",
        email: "alex@example.com",
      }),
    ).toBe(true);
  });

  it("rejects invalid session objects", () => {
    expect(isSession(null)).toBe(false);
    expect(isSession({ userId: "user-1" })).toBe(false);
    expect(isSession({ userId: 123, email: "alex@example.com" })).toBe(false);
  });

  it("creates a non-empty user id", () => {
    expect(createUserId()).toEqual(expect.any(String));
    expect(createUserId().length).toBeGreaterThan(0);
  });
});
