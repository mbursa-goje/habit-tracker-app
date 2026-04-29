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
import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

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

function DashboardTooltip({
  children,
  className = "bottom-full left-1/2 mb-2 -translate-x-1/2",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      role="tooltip"
      className={`pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 ${className}`}
    >
      {children}
    </span>
  );
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
  const habitFormRegionRef = useRef<HTMLDivElement | null>(null);

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

  function scrollHabitFormIntoView() {
    window.requestAnimationFrame(() => {
      habitFormRegionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function openCreateForm() {
    setEditingHabit(null);
    setIsFormOpen(true);
    scrollHabitFormIntoView();
  }

  function openEditForm(habit: Habit) {
    setEditingHabit(habit);
    setIsFormOpen(true);
    scrollHabitFormIntoView();
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
    <div
      className="flex min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f3f7ff_52%,_#edf3ff_100%)]"
      data-testid="dashboard-page"
    >
      <aside className="fixed hidden h-full w-64 flex-col border-r border-blue-100 bg-white/90 p-5 backdrop-blur md:flex">
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
            <div key={item.name} className="group relative">
              <button
                type="button"
                onClick={item.name === "Add" ? openCreateForm : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${item.active
                  ? "border border-blue-100 bg-blue-50 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <item.icon size={18} />
                {item.name}
              </button>
            </div>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            Signed In
          </p>
          <p className="break-all text-sm font-semibold text-slate-700">
            {session.email}
          </p>
          <div className="group relative mt-4">
            <button
              type="button"
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:ml-64 md:p-6 lg:p-8">
        <header className="mb-6 rounded-3xl border border-blue-100 bg-white/80 p-5 shadow-[0_12px_40px_rgba(37,99,235,0.08)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

            <div className="group relative">
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
          </div>
          </div>
        </header>

        <section
          className={`grid grid-cols-1 gap-5 ${isFormOpen
            ? ""
            : "xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]"
            }`}
        >
          <div className="space-y-5">
            {isFormOpen && (
              <div ref={habitFormRegionRef} className="scroll-mt-6">
                <HabitForm
                  key={editingHabit?.id ?? "new-habit"}
                  habit={editingHabit ?? undefined}
                  today={today}
                  mode={editingHabit ? "edit" : "create"}
                  onSave={handleSaveHabit}
                  onDiscard={closeHabitForm}
                  onDelete={
                    editingHabit
                      ? () => {
                        handleDeleteHabit(editingHabit.id);
                        closeHabitForm();
                      }
                      : undefined
                  }
                />
              </div>
            )}

            <div className="rounded-3xl border border-blue-200 bg-white px-3 py-4 shadow-[0_18px_50px_rgba(37,99,235,0.08)] sm:px-5 sm:py-5">
              <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-[auto_repeat(3,minmax(0,1fr))] md:items-center md:gap-6">
                <div className="flex min-h-24 items-center justify-center md:col-span-1 md:justify-start">
                  <div
                    className="grid aspect-square w-full max-w-28 place-items-center rounded-full p-1.5 sm:p-2"
                    style={{
                      background: `conic-gradient(#1d4ed8 ${progressPercent * 3.6
                        }deg, #e2e8f0 0deg)`,
                    }}
                  >
                    <div className="grid h-full w-full place-items-center rounded-full bg-white shadow-inner">
                      <div className="text-center">
                        <p className="text-2xl font-black leading-none text-slate-800 sm:text-3xl">
                          {progressPercent}%
                        </p>
                        <p className="mt-1 text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-slate-500 sm:text-[10px]">
                          Daily Goal
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex min-h-24 w-full flex-col items-center justify-center rounded-2xl border border-blue-50 bg-blue-50/40 p-3 text-center sm:p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Completed
                  </p>
                  <p className="mt-2 text-2xl font-extrabold leading-none text-slate-900 sm:text-3xl">
                    {doneTodayCount}/{activeCount}
                  </p>
                </div>

                <div className="flex min-h-24 w-full flex-col items-center justify-center rounded-2xl border border-blue-50 bg-blue-50/40 p-3 text-center sm:p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Active
                  </p>
                  <p className="mt-2 text-2xl font-extrabold leading-none text-slate-900 sm:text-3xl">
                    {activeCount}
                  </p>
                </div>

                <div className="flex min-h-24 w-full flex-col items-center justify-center rounded-2xl border border-blue-50 bg-blue-50/40 p-3 text-center sm:p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Best Streak
                  </p>
                  <p className="mt-2 text-2xl font-extrabold leading-none text-slate-900 sm:text-3xl">
                    {bestStreak}
                    <span className="ml-2 text-xl sm:text-2xl">Days</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Active Habits
                </h3>
                <p className="text-sm text-slate-500">
                  Your current daily disciplines and progress controls.
                </p>
              </div>
            </div>

            {userHabits.length === 0 ? (
              <div
                data-testid="empty-state"
                className="flex min-h-[clamp(220px,34vh,360px)] flex-col items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-white p-8 text-center shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  No habits yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Create your first daily habit to start tracking progress.
                </p>
                <div className="group relative mt-5 inline-flex">
                  <button
                    type="button"
                    onClick={openCreateForm}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Habit
                  </button>
                </div>
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

          <aside
            className={`flex h-full flex-col gap-5 ${isFormOpen ? "xl:hidden" : ""}`}
          >
            <div className="overflow-hidden rounded-3xl border border-blue-100 bg-slate-900 p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
              <div className="rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.35),_rgba(15,23,42,0.85)_65%)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
                  Daily Insight
                </p>
                <p className="mt-16 text-2xl italic leading-tight">
                  &quot;Discipline is the bridge between goals and accomplishment.&quot;
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
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

            <div className="flex min-h-36 flex-1 flex-col justify-center rounded-3xl bg-gradient-to-br from-blue-700 via-blue-700 to-blue-900 p-5 text-white shadow-[0_18px_50px_rgba(29,78,216,0.22)]">
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
          <div className="group relative">
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 shadow-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
            <DashboardTooltip className="bottom-full right-0 mb-2">
              Log out
            </DashboardTooltip>
          </div>

          <div className="group relative">
            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-xl bg-blue-700 p-3 text-white shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Create habit"
            >
              <Plus size={22} />
            </button>
            <DashboardTooltip className="bottom-full right-0 mb-2">
              Create habit
            </DashboardTooltip>
          </div>

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
