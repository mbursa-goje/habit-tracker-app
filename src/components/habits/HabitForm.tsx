"use client";

import type { Habit } from "@/types/habit";
import { validateHabitName } from "@/lib/validators";
import { Save, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export type HabitFormValues = {
  name: string;
  description: string;
  frequency: "daily";
};

type HabitFormProps = {
  habit?: Habit | null;
  onSave: (values: HabitFormValues) => void;
  onCancel: () => void;
};

export default function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? "");
  const [description, setDescription] = useState(habit?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(habit?.name ?? "");
    setDescription(habit?.description ?? "");
    setError(null);
  }, [habit]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateHabitName(name);

    if (!result.valid) {
      setError(result.error);
      return;
    }

    setError(null);
    onSave({
      name: result.value,
      description: description.trim(),
      frequency: "daily",
    });
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {habit ? "Edit Habit" : "Create Habit"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Keep this stage focused on daily habits.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close habit form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="habit-name"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Habit Name
          </label>
          <input
            id="habit-name"
            data-testid="habit-name-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Drink Water"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="habit-description"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Description
          </label>
          <textarea
            id="habit-description"
            data-testid="habit-description-input"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional note about this habit"
            rows={4}
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="habit-frequency"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            value="daily"
            onChange={() => undefined}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Save className="h-4 w-4" />
          {habit ? "Save Changes" : "Save Habit"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Discard
        </button>
      </div>
    </form>
  );
}
