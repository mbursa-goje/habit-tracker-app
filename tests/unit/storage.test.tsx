// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  readLocalStorageValue,
  removeLocalStorageValue,
  setLocalStorageValue,
  subscribeToLocalStorageKey,
  useLocalStorageValue,
} from "../../src/lib/storage";

function StoredCount() {
  const value = useLocalStorageValue<{ count: number }>("counter", {
    count: 0,
  });

  return <p>{value.count}</p>;
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("localStorage helpers", () => {
  it("returns a fallback value when the key is missing", () => {
    expect(readLocalStorageValue("missing-key", [])).toEqual([]);
  });

  it("returns a fallback value when stored JSON is invalid", () => {
    localStorage.setItem("broken-key", "{not-json");

    expect(readLocalStorageValue("broken-key", "fallback")).toBe("fallback");
  });

  it("writes and reads JSON values", () => {
    setLocalStorageValue("profile", { email: "user@example.com" });

    expect(readLocalStorageValue("profile", null)).toEqual({
      email: "user@example.com",
    });
  });

  it("removes stored values", () => {
    setLocalStorageValue("session", { userId: "user-1" });

    removeLocalStorageValue("session");

    expect(readLocalStorageValue("session", null)).toBeNull();
  });

  it("notifies subscribers for matching key changes", () => {
    const onStoreChange = vi.fn();
    const unsubscribe = subscribeToLocalStorageKey("habits", onStoreChange);

    setLocalStorageValue("habits", []);
    setLocalStorageValue("users", []);

    expect(onStoreChange).toHaveBeenCalledTimes(1);

    unsubscribe();
    setLocalStorageValue("habits", [{ id: "habit-1" }]);

    expect(onStoreChange).toHaveBeenCalledTimes(1);
  });

  it("updates subscribed React components after same-tab writes", () => {
    render(<StoredCount />);

    expect(screen.getByText("0")).toBeTruthy();

    act(() => {
      setLocalStorageValue("counter", { count: 3 });
    });

    expect(screen.getByText("3")).toBeTruthy();
  });
});
