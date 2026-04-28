"use client";

import { Habit } from "@/types/habit";
import { Session } from "@/types/auth";
import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircleIcon,
  LogOut,
  Plus,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";

const navItems = [
  { name: "Today", icon: CalendarDays, active: true },
  { name: "Stats", icon: TrendingUp, active: false },
  { name: "Add", icon: Plus, active: false },
  { name: "Profile", icon: User, active: false },
];

function getTodayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const sessionData = localStorage.getItem("habit-tracker-session");
    if (!sessionData) {
      window.location.href = "/login";
      return;
    }

    const parsedSession = JSON.parse(sessionData) as Session;
    setSession(parsedSession);

    const habitsData = localStorage.getItem("habit-tracker-habits");
    const allHabits = habitsData ? (JSON.parse(habitsData) as Habit[]) : [];
    setHabits(allHabits);
  }, []);

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
  const previewHabits = userHabits.slice(0, 4);

  if (!session) return <div className="p-8 text-slate-500">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]" data-testid="dashboard-page">
      <aside className="hidden md:flex fixed h-full w-64 flex-col border-r border-slate-200 bg-white p-5">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-blue-700">Habit Tracker</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.name}
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
            Pro Plan
          </p>
          <div className="mb-3 h-2 w-full rounded-full bg-slate-200">
            <div className="h-full w-4/5 rounded-full bg-blue-700" />
          </div>
          <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">
            Manage Subscription
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:ml-64 md:p-6 lg:p-7">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">
              Performance Dashboard
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Monday, Oct 23 • Day {doneTodayCount + 10} Streak
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50">
              <Bell size={18} />
            </button>
            <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
              + New Habit
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                <div className="flex items-center gap-4 md:col-span-1">
                  <div
                    className="grid h-24 w-24 place-items-center rounded-full"
                    style={{
                      background: `conic-gradient(#1d4ed8 ${progressPercent * 3.6}deg, #e2e8f0 0deg)`,
                    }}
                  >
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
                      <div className="text-center">
                        <p className="text-4xl font-black text-slate-900">{progressPercent}%</p>
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
                    {doneTodayCount}/{activeCount || 1}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Total Time
                  </p>
                  <p className="mt-1 text-4xl font-extrabold text-slate-900">
                    {(activeCount * 0.35).toFixed(1)}h
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Best Streak
                  </p>
                  <p className="mt-1 text-4xl font-extrabold text-slate-900">
                    {Math.max(14, doneTodayCount + 8)} Days
                  </p>
                </div>
              </div>
            </div>

            {userHabits.length === 0 ? (
              <div
                data-testid="empty-state"
                className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500"
              >
                No habits yet. Click the new habit button to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {previewHabits.map((habit) => {
                  const isDoneToday = habit.completions.includes(today);
                  return (
                    <div
                      key={habit.id}
                      className={`rounded-2xl border bg-white p-4 ${
                        isDoneToday ? "border-emerald-300" : "border-slate-200"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{habit.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {habit.description || "No description"}
                          </p>
                        </div>
                        <CheckCircleIcon
                          size={20}
                          className={isDoneToday ? "text-emerald-500" : "text-slate-300"}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                          {habit.completions.length} day streak
                        </p>
                        <p className="text-xs font-semibold uppercase text-slate-400">Daily</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-800 p-5 text-white">
              <div className="h-40 rounded-xl bg-gradient-to-b from-slate-500 to-slate-900 p-4">
                <p className="mt-16 text-2xl italic leading-tight">
                  "Discipline is the bridge between goals and accomplishment."
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Weekly Consistency</h3>
              <div className="mb-4 flex justify-between text-xs font-bold text-slate-400">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                  <span key={`${day}-${idx}`}>{day}</span>
                ))}
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
                <p className="flex justify-between text-slate-600">
                  <span>Peak Performance</span>
                  <span className="font-bold text-slate-900">Wednesdays</span>
                </p>
                <p className="flex justify-between text-slate-600">
                  <span>Avg. Completion</span>
                  <span className="font-bold text-slate-900">{progressPercent}%</span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-blue-700 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Next Up</p>
              <h3 className="mt-2 text-2xl font-bold">Evening Reflection</h3>
              <p className="text-sm text-blue-100">Scheduled for 9:00 PM</p>
              <button className="mt-4 w-full rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400">
                Set Reminder
              </button>
            </div>
          </div>
        </section>

        <div className="fixed bottom-6 right-6 flex items-center gap-2">
          <button
            data-testid="auth-logout-button"
            className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50"
            onClick={() => {
              localStorage.removeItem("habit-tracker-session");
              window.location.href = "/login";
            }}
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
          <button
            data-testid="create-habit-button"
            className="rounded-xl bg-blue-700 p-3 text-white shadow-lg hover:bg-blue-800"
            aria-label="Create habit"
          >
            <Plus size={22} />
          </button>
          <button
            className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}