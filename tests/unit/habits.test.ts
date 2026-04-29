import { describe, expect, it } from "vitest";
import { toggleHabitCompletion } from "../../src/lib/habits";
import type { Habit } from "../../src/types/habit";

function createHabit(completions: string[] = []): Habit {
  return {
    id: "habit-1",
    userId: "user-1",
    name: "Drink Water",
    description: "Drink three liters of water",
    frequency: "daily",
    createdAt: "2026-04-29T00:00:00.000Z",
    completions,
  };
}

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const habit = createHabit();

    expect(toggleHabitCompletion(habit, "2026-04-29").completions).toEqual([
      "2026-04-29",
    ]);
  });

  it("removes a completion date when the date already exists", () => {
    const habit = createHabit(["2026-04-29"]);

    expect(toggleHabitCompletion(habit, "2026-04-29").completions).toEqual([]);
  });

  it("does not mutate the original habit object", () => {
    const habit = createHabit();

    toggleHabitCompletion(habit, "2026-04-29");

    expect(habit.completions).toEqual([]);
  });

  it("does not return duplicate completion dates", () => {
    const habit = createHabit(["2026-04-28", "2026-04-29", "2026-04-29"]);

    expect(toggleHabitCompletion(habit, "2026-04-27").completions).toEqual([
      "2026-04-27",
      "2026-04-28",
      "2026-04-29",
    ]);
  });
});
