"use client";

import LoginForm from "@/components/auth/LoginForm";
import { CheckCircle2, Flame } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f4f7ff] px-5 py-10 text-slate-950 md:grid md:place-items-center md:px-8">
      <section className="mx-auto grid w-full max-w-[1120px] overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm md:min-h-[640px] md:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-blue-800 p-10 text-white md:flex md:flex-col md:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_36%),linear-gradient(145deg,rgba(37,99,235,0.38),transparent_48%)]" />
          <div className="absolute inset-x-0 top-20 h-96 opacity-15">
            <div className="mx-auto h-full w-96 rotate-45 border-[42px] border-white" />
          </div>

          <div className="relative">
            <div className="mb-10 flex items-center gap-3">
              <CheckCircle2 className="h-7 w-7" />
              <span className="text-2xl font-bold">Habit Tracker</span>
            </div>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Master your day with precision consistency.
            </h1>
          </div>

          <div className="relative space-y-5">
            <div className="rounded border border-white/30 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded border border-white/60 bg-white/10">
                  <Flame className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold">14 Days</p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>Daily Progress</span>
                <span>85%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/25">
                <div className="h-full w-[85%] rounded-full bg-white/70" />
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-h-screen flex-col justify-between px-6 py-10 md:min-h-0 md:justify-center md:px-16">
          <div className="mx-auto w-full max-w-[440px]">
            <div className="mb-8 text-center md:hidden">
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-lg border border-slate-300 bg-blue-50 text-blue-700">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-700">
                Habit Tracker
              </p>
            </div>

            <LoginForm />
          </div>

          <footer className="mt-12 text-center text-xs text-slate-500 md:hidden">
            <p>2026 Habit Tracker. Precision in growth.</p>
            <div className="mt-5 flex justify-center gap-8">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>
            </div>
          </footer>
        </section>
      </section>
    </main>
  );
}
