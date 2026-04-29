"use client";

import HabitForm, { type HabitFormValues } from "@/components/habits/HabitForm";
import HabitList from "@/components/habits/HabitList";
import { isSession } from "@/lib/auth";
import { STORAGE_KEYS } from "@/lib/constants";
import { toggleHabitCompletion } from "@/lib/habits";
import {
  removeLocalStorageValue,
  setLocalStorageValue,
  useLocalStorageValue,
} from "@/lib/storage";
import { calculateCurrentStreak } from "@/lib/streaks";
import type { Habit } from "@/types/habit";
import {
  Bell,
  CalendarDays,
  LogOut,
  Plus,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

const EMPTY_HABITS: Habit[] = [];

const navItems = [
  { name: "Today", icon: CalendarDays, active: true },
  { name: "Stats", icon: TrendingUp, active: false },
  { name: "Add", icon: Plus, active: false },
  { name: "Profile", icon: User, active: false },
];

function getTodayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

function createHabitId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function subscribeToHydration() {
  return () => undefined;
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export default function Dashboard() {
  const hasCheckedClientStorage = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const storedSession = useLocalStorageValue<unknown>(
    STORAGE_KEYS.session,
    null,
  );
  const habits = useLocalStorageValue<Habit[]>(
    STORAGE_KEYS.habits,
    EMPTY_HABITS,
  );
  const session = isSession(storedSession) ? storedSession : null;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    if (!hasCheckedClientStorage) {
      return;
    }

    if (!storedSession) {
      window.location.href = "/login";
      return;
    }

    if (!session) {
      removeLocalStorageValue(STORAGE_KEYS.session);
      window.location.href = "/login";
    }
  }, [hasCheckedClientStorage, session, storedSession]);

  const today = getTodayIsoDate();

  const userHabits = useMemo(
    () => habits.filter((habit) => habit.userId === session?.userId),
    [habits, session?.userId],
  );

  const activeCount = userHabits.length;
  const doneTodayCount = userHabits.filter((habit) =>
    habit.completions.includes(today),
  ).length;
  const progressPercent =
    activeCount === 0 ? 0 : Math.round((doneTodayCount / activeCount) * 100);
  const bestStreak = userHabits.length
    ? Math.max(
        ...userHabits.map((habit) =>
          calculateCurrentStreak(habit.completions, today),
        ),
      )
    : 0;

  function saveHabits(nextHabits: Habit[]) {
    setLocalStorageValue(STORAGE_KEYS.habits, nextHabits);
  }

  function openCreateForm() {
    setEditingHabit(null);
    setIsFormOpen(true);
  }

  function openEditForm(habit: Habit) {
    setEditingHabit(habit);
    setIsFormOpen(true);
  }

  function closeHabitForm() {
    setEditingHabit(null);
    setIsFormOpen(false);
  }

  function handleSaveHabit(values: HabitFormValues) {
    if (!session) {
      return;
    }

    if (editingHabit) {
      const nextHabits: Habit[] = habits.map((habit) =>
        habit.id === editingHabit.id
          ? {
              ...habit,
              name: values.name,
              description: values.description,
              frequency: values.frequency,
            }
          : habit,
      );

      saveHabits(nextHabits);
      closeHabitForm();
      return;
    }

    const newHabit: Habit = {
      id: createHabitId(),
      userId: session.userId,
      name: values.name,
      description: values.description,
      frequency: "daily",
      createdAt: new Date().toISOString(),
      completions: [],
    };

    saveHabits([...habits, newHabit]);
    closeHabitForm();
  }

  function handleDeleteHabit(habitId: string) {
    saveHabits(habits.filter((habit) => habit.id !== habitId));
  }

  function handleToggleHabit(habitId: string) {
    saveHabits(
      habits.map((habit) =>
        habit.id === habitId ? toggleHabitCompletion(habit, today) : habit,
      ),
    );
  }

  function handleLogout() {
    removeLocalStorageValue(STORAGE_KEYS.session);
    window.location.href = "/login";
  }

  if (!hasCheckedClientStorage || !session) {
    return <div className="p-8 text-slate-500">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]" data-testid="dashboard-page">
      <aside className="fixed hidden h-full w-64 flex-col border-r border-slate-200 bg-white p-5 md:flex">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-blue-700">
            Habit Tracker
          </h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Precision Growth
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={item.name === "Add" ? openCreateForm : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            Signed In
          </p>
          <p className="break-all text-sm font-semibold text-slate-700">
            {session.email}
          </p>
          <button
            type="button"
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:ml-64 md:p-6 lg:p-7">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Performance Dashboard
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {doneTodayCount} of {activeCount} habits completed today
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            <button
              type="button"
              data-testid="create-habit-button"
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              New Habit
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {isFormOpen && (
              <HabitForm
                key={editingHabit?.id ?? "new-habit"}
                habit={editingHabit}
                onSave={handleSaveHabit}
                onCancel={closeHabitForm}
              />
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                <div className="flex items-center gap-4 md:col-span-1">
                  <div
                    className="grid h-24 w-24 place-items-center rounded-full"
                    style={{
                      background: `conic-gradient(#1d4ed8 ${
                        progressPercent * 3.6
                      }deg, #e2e8f0 0deg)`,
                    }}
                  >
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
                      <div className="text-center">
                        <p className="text-4xl font-black text-slate-900">
                          {progressPercent}%
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Daily Goal
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Completed
                  </p>
                  <p className="mt-1 text-4xl font-extrabold text-slate-900">
                    {doneTodayCount}/{activeCount}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Active
                  </p>
                  <p className="mt-1 text-4xl font-extrabold text-slate-900">
                    {activeCount}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Best Streak
                  </p>
                  <p className="mt-1 text-4xl font-extrabold text-slate-900">
                    {bestStreak} Days
                  </p>
                </div>
              </div>
            </div>

            {userHabits.length === 0 ? (
              <div
                data-testid="empty-state"
                className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  No habits yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Create your first daily habit to start tracking progress.
                </p>
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Habit
                </button>
              </div>
            ) : (
              <HabitList
                habits={userHabits}
                today={today}
                onToggleComplete={handleToggleHabit}
                onEdit={openEditForm}
                onDelete={handleDeleteHabit}
              />
            )}
          </div>

          <aside className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-800 p-5 text-white">
              <div className="h-40 rounded-xl bg-gradient-to-b from-slate-500 to-slate-900 p-4">
                <p className="mt-16 text-2xl italic leading-tight">
                  &quot;Discipline is the bridge between goals and accomplishment.&quot;
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                Weekly Consistency
              </h3>
              <div className="mb-4 flex justify-between text-xs font-bold text-slate-400">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <span key={`${day}-${index}`}>{day}</span>
                ))}
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
                <p className="flex justify-between text-slate-600">
                  <span>Completed Today</span>
                  <span className="font-bold text-slate-900">
                    {doneTodayCount}
                  </span>
                </p>
                <p className="flex justify-between text-slate-600">
                  <span>Avg. Completion</span>
                  <span className="font-bold text-slate-900">
                    {progressPercent}%
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-blue-700 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
                Next Up
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                {userHabits.find((habit) => !habit.completions.includes(today))
                  ?.name ?? "All habits complete"}
              </h3>
              <p className="text-sm text-blue-100">
                {activeCount === doneTodayCount
                  ? "Nice work. Come back tomorrow."
                  : "Finish one more daily discipline."}
              </p>
            </div>
          </aside>
        </section>

        <div className="fixed bottom-6 right-6 flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 shadow-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-blue-700 p-3 text-white shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Create habit"
          >
            <Plus size={22} />
          </button>

          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 shadow-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
