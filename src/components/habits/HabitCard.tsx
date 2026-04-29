"use client";

import type { Habit } from "@/types/habit";
import { calculateCurrentStreak } from "@/lib/streaks";
import { getHabitSlug } from "@/lib/slug";
import { CheckCircle2, Flame, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

type HabitCardProps = {
  habit: Habit;
  today: string;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function HabitCard({
  habit,
  today,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const slug = getHabitSlug(habit.name);
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);
  const completionRate = Math.min(
    100,
    Math.round((new Set(habit.completions).size / 30) * 100),
  );

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
        isCompletedToday ? "border-emerald-300" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
            Daily Discipline
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">
            {habit.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {habit.description || "No description added yet."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            data-testid={`habit-edit-${slug}`}
            onClick={onEdit}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Edit ${habit.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            data-testid={`habit-delete-${slug}`}
            onClick={() => setIsConfirmingDelete(true)}
            className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label={`Delete ${habit.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          data-testid={`habit-streak-${slug}`}
          className="flex items-center gap-2 text-sm font-bold text-amber-600"
        >
          <Flame className="h-5 w-5" />
          <span>{streak} day streak</span>
        </div>

        <button
          type="button"
          data-testid={`habit-complete-${slug}`}
          onClick={onToggleComplete}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isCompletedToday
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
          aria-pressed={isCompletedToday}
        >
          <CheckCircle2 className="h-5 w-5" />
          {isCompletedToday ? "Completed" : "Complete"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Completion
          </p>
          <p className="mt-1 text-xl font-bold text-slate-950">
            {completionRate}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Frequency
          </p>
          <p className="mt-1 text-xl font-bold capitalize text-slate-950">
            {habit.frequency}
          </p>
        </div>
      </div>

      {isConfirmingDelete && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            Delete this habit? This action cannot be undone.
          </p>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              data-testid="confirm-delete-button"
              onClick={onDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Confirm Delete
            </button>

            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
