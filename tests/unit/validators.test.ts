import { describe, expect, it } from "vitest";
import { validateHabitName } from "../../src/lib/validators";

describe("validateHabitName", () => {
  it("returns an error when habit name is empty", () => {
    expect(validateHabitName("   ")).toEqual({
      valid: false,
      value: "",
      error: "Habit name is required",
    });
  });

  it("returns an error when habit name exceeds 60 characters", () => {
    const longName = "a".repeat(61);

    expect(validateHabitName(longName)).toEqual({
      valid: false,
      value: longName,
      error: "Habit name must be 60 characters or fewer",
    });
  });

  it("returns a trimmed value when habit name is valid", () => {
    expect(validateHabitName("  Morning Meditation  ")).toEqual({
      valid: true,
      value: "Morning Meditation",
      error: null,
    });
  });
});
