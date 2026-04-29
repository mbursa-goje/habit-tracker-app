"use client";

import type { Habit } from "@/types/habit";
import { calculateCurrentStreak } from "@/lib/streaks";
import { Flame, Save, Trash2, RotateCcw, X } from "lucide-react";
import { useState } from "react";

export type HabitFormValues = {
  name: string;
  description: string;
  frequency: "daily";
};

type HabitFormProps = {
  habit?: Habit;
  today: string;
  mode?: "create" | "edit";
  onSave: (values: HabitFormValues) => void;
  onDiscard?: () => void;
  onDelete?: () => void;
};

export default function HabitForm({
  habit,
  today,
  mode = "edit",
  onSave,
  onDiscard,
  onDelete,
}: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? "");
  const [description, setDescription] = useState(habit?.description ?? "");
  const [error, setError] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const streak = habit ? calculateCurrentStreak(habit.completions, today) : 0;
  const completionRate = habit
    ? Math.min(100, Math.round((new Set(habit.completions).size / 30) * 100))
    : 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Habit name is required");
      return;
    }

    if (trimmedName.length > 60) {
      setError("Habit name must be 60 characters or fewer");
      return;
    }

    setError("");
    onSave({
      name: trimmedName,
      description: trimmedDescription,
      frequency: "daily",
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <form
        data-testid="habit-form"
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-5 md:p-8"
      >
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-950">
            Habit Details
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Configure your habit tracking parameters with precision.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="habit-name"
              className="mb-2 block text-sm font-semibold text-slate-950"
            >
              Habit Name
            </label>
            <input
              id="habit-name"
              data-testid="habit-name-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-none border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              placeholder="Morning Meditation"
            />
          </div>

          <div>
            <label
              htmlFor="habit-description"
              className="mb-2 block text-sm font-semibold text-slate-950"
            >
              Description
            </label>
            <textarea
              id="habit-description"
              data-testid="habit-description-input"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              className="w-full resize-y rounded-none border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              placeholder="15-minute mindfulness session..."
            />
          </div>

          <div>
            <label
              htmlFor="habit-frequency"
              className="mb-2 block text-sm font-semibold text-slate-950"
            >
              Frequency
            </label>
            <select
              id="habit-frequency"
              data-testid="habit-frequency-select"
              value="daily"
              onChange={() => { }}
              className="w-full rounded-none border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="daily">Daily</option>
            </select>
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="submit"
              data-testid="habit-save-button"
              className="inline-flex min-h-12 w-full min-w-44 flex-1 items-center justify-center gap-2 rounded-md bg-blue-700 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Save Changes</span>
            </button>

            <button
              type="button"
              onClick={onDiscard}
              className="inline-flex min-h-12 w-full min-w-44 flex-1 items-center justify-center gap-2 rounded-md border border-blue-700 bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <RotateCcw className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Discard</span>
            </button>

            {mode === "edit" && (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="inline-flex min-h-12 w-full min-w-44 flex-1 items-center justify-center gap-2 rounded-md border border-red-500 bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Delete Habit</span>
              </button>
            )}
          </div>

          {isConfirmingDelete && (
            <div className="mt-4 flex flex-col gap-3 rounded border border-red-200 bg-red-50 p-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold text-red-700">
                Are you sure you want to delete this habit?
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="inline-flex items-center gap-2 rounded border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="button"
                  data-testid="confirm-delete-button"
                  onClick={onDelete}
                  className="rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      <aside className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Performance Summary
          </h3>

          <div className="mt-5 rounded bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded bg-emerald-300 text-emerald-900">
                <Flame className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Current Streak
                </p>
                <p className="text-xl font-semibold text-slate-950">
                  {streak} Days
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-950">Completion Rate</p>
              <p className="font-semibold text-blue-700">{completionRate}%</p>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-blue-50">
              <div
                className="h-full rounded-full bg-blue-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <p className="mt-2 text-xs font-semibold uppercase text-slate-400">
              Last 30 days performance
            </p>
          </div>
        </section>
      </aside>
    </div>
  );
}
