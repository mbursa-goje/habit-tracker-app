import { describe, expect, it } from "vitest";
import { getHabitSlug } from "../../src/lib/slug";

describe("getHabitSlug", () => {
  it("returns lowercase hyphenated slug for a basic habit name", () => {
    expect(getHabitSlug("Drink Water")).toBe("drink-water");
  });

  it("trims outer spaces and collapses repeated internal spaces", () => {
    expect(getHabitSlug("   Read    Books   ")).toBe("read-books");
  });

  it("removes non alphanumeric characters except hyphens", () => {
    expect(getHabitSlug("Run! 5K - Daily?")).toBe("run-5k---daily");
  });
});
