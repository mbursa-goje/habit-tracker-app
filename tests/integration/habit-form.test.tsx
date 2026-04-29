// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HabitCard from "../../src/components/habits/HabitCard";
import HabitForm, {
  type HabitFormValues,
} from "../../src/components/habits/HabitForm";
import { toggleHabitCompletion } from "../../src/lib/habits";
import type { Habit } from "../../src/types/habit";

const today = "2026-04-29";

function createHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "habit-1",
    userId: "user-1",
    name: "Drink Water",
    description: "Drink three liters of water",
    frequency: "daily",
    createdAt: "2026-04-01T00:00:00.000Z",
    completions: [],
    ...overrides,
  };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("habit form", () => {
  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();
    const saveHabit = vi.fn();

    render(<HabitForm onSave={saveHabit} onCancel={vi.fn()} />);

    await user.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByText("Habit name is required")).toBeTruthy();
    expect(saveHabit).not.toHaveBeenCalled();
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();

    function HabitCreationHarness() {
      const [habits, setHabits] = useState<Habit[]>([]);

      function saveHabit(values: HabitFormValues) {
        setHabits([
          createHabit({
            id: "habit-created",
            name: values.name,
            description: values.description,
            frequency: values.frequency,
          }),
        ]);
      }

      return (
        <div>
          <HabitForm onSave={saveHabit} onCancel={vi.fn()} />
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              onToggleComplete={vi.fn()}
              onEdit={vi.fn()}
              onDelete={vi.fn()}
            />
          ))}
        </div>
      );
    }

    render(<HabitCreationHarness />);

    await user.type(screen.getByTestId("habit-name-input"), "Drink Water");
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Drink three liters of water",
    );
    await user.click(screen.getByTestId("habit-save-button"));

    const habitCard = screen.getByTestId("habit-card-drink-water");

    expect(habitCard).toBeTruthy();
    expect(
      within(habitCard).getByText("Drink three liters of water"),
    ).toBeTruthy();
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();
    const originalHabit = createHabit({
      completions: [today],
    });
    const saveHabit = vi.fn((values: HabitFormValues) => ({
      ...originalHabit,
      name: values.name,
      description: values.description,
      frequency: values.frequency,
    }));

    render(
      <HabitForm
        habit={originalHabit}
        onSave={saveHabit}
        onCancel={vi.fn()}
      />,
    );

    await user.clear(screen.getByTestId("habit-name-input"));
    await user.type(screen.getByTestId("habit-name-input"), "Evening Reading");
    await user.clear(screen.getByTestId("habit-description-input"));
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Read twenty pages before bed",
    );
    await user.click(screen.getByTestId("habit-save-button"));

    const updatedHabit = saveHabit.mock.results[0].value as Habit;

    expect(updatedHabit).toMatchObject({
      id: originalHabit.id,
      userId: originalHabit.userId,
      createdAt: originalHabit.createdAt,
      completions: originalHabit.completions,
      name: "Evening Reading",
      description: "Read twenty pages before bed",
      frequency: "daily",
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();
    const deleteHabit = vi.fn();

    render(
      <HabitCard
        habit={createHabit()}
        today={today}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={deleteHabit}
      />,
    );

    await user.click(screen.getByTestId("habit-delete-drink-water"));

    expect(deleteHabit).not.toHaveBeenCalled();

    await user.click(screen.getByTestId("confirm-delete-button"));

    expect(deleteHabit).toHaveBeenCalledTimes(1);
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();

    function HabitCompletionHarness() {
      const [habit, setHabit] = useState(createHabit());

      return (
        <HabitCard
          habit={habit}
          today={today}
          onToggleComplete={() =>
            setHabit((currentHabit) =>
              toggleHabitCompletion(currentHabit, today),
            )
          }
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );
    }

    render(<HabitCompletionHarness />);

    expect(screen.getByTestId("habit-streak-drink-water").textContent).toContain(
      "0 day streak",
    );

    await user.click(screen.getByTestId("habit-complete-drink-water"));

    expect(screen.getByTestId("habit-streak-drink-water").textContent).toContain(
      "1 day streak",
    );
    expect(
      screen.getByTestId("habit-complete-drink-water").textContent,
    ).toContain("Completed");
  });
});
