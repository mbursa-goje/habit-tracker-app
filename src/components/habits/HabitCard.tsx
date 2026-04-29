"use client";

import type { Habit } from "@/types/habit";
import { calculateCurrentStreak } from "@/lib/streaks";
import { getHabitSlug } from "@/lib/slug";
import { CircleCheckBig, Flame, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

type HabitCardProps = {
  habit: Habit;
  today: string;
  completionRate?: number;
  consistencyLabel?: string;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function HabitCard({
  habit,
  today,
  completionRate = 85,
  consistencyLabel = "High",
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const slug = getHabitSlug(habit.name);
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  return (
    <section data-testid={`habit-card-${slug}`} className="w-full">
      <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-slate-400">
        Active Habit
      </p>

      <div className="rounded-[28px] border border-[#d9e2f1] bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">
              {habit.name}
            </h2>

            <div
              data-testid={`habit-streak-${slug}`}
              className="mt-3 flex items-center gap-2 text-slate-600"
            >
              <Flame className="h-5 w-5 text-amber-500" />
              <span className="text-[15px] font-medium">
                {streak} day streak
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              data-testid={`habit-edit-${slug}`}
              onClick={onEdit}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Edit ${habit.name}`}
            >
              <Pencil className="h-5 w-5" />
            </button>

            <button
              type="button"
              data-testid={`habit-delete-${slug}`}
              onClick={() => setIsConfirmingDelete(true)}
              className="rounded-xl p-2 text-red-400 transition hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label={`Delete ${habit.name}`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <span className="h-10 w-4 rounded-full bg-blue-100" />
              <span className="h-10 w-4 rounded-full bg-blue-200" />
              <span className="h-10 w-4 rounded-full bg-blue-300" />
              <span className="h-10 w-4 rounded-full bg-blue-600" />
            </div>

            <div>
              <p className="text-2xl font-semibold text-slate-700">
                Daily Discipline
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {habit.description || "No description added yet"}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid={`habit-complete-${slug}`}
            onClick={onToggleComplete}
            className={`inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-xl font-semibold text-white shadow-[0_12px_24px_rgba(29,78,216,0.18)] transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${isCompletedToday
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-blue-700 hover:bg-blue-800"
              }`}
            aria-pressed={isCompletedToday}
          >
            <CircleCheckBig className="h-7 w-7" />
            {isCompletedToday ? "Completed" : "Complete"}
          </button>
        </div>

        {isConfirmingDelete && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-red-700">
              Delete this habit?
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

              <button
                type="button"
                data-testid="confirm-delete-button"
                onClick={onDelete}
                className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] border border-[#d9e2f1] bg-[#f5f8ff] p-6">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            Completion
          </p>
          <p className="mt-4 text-5xl font-bold text-slate-950">
            {completionRate}%
          </p>
        </div>

        <div className="rounded-[24px] border border-[#d9e2f1] bg-[#f5f8ff] p-6">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            Consistency
          </p>
          <p className="mt-4 text-5xl font-bold text-slate-950">
            {consistencyLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
