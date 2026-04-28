import type { Habit } from "@/types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = new Set(habit.completions);

  if (completions.has(date)) {
    completions.delete(date);
  } else {
    completions.add(date);
  }

  return {
    ...habit,
    completions: Array.from(completions).sort(),
  };
}
