"use client";

import SignupForm from "@/components/auth/SignupForm";
import { CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f4ff] p-4 md:p-8">
      <section className="grid min-h-[600px] w-full max-w-[1000px] grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <aside className="relative flex h-full flex-col justify-between overflow-hidden bg-[#0056b3] p-12 text-white">
          <div>
            <div className="mb-12 flex items-center gap-2">
              <CheckCircle2 size={28} />
              <span className="text-xl font-bold tracking-tight">
                Habit Tracker
              </span>
            </div>

            <h1 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">
              Precision Growth <br /> Starts with Today.
            </h1>

            <p className="max-w-sm text-lg leading-relaxed text-blue-100">
              The analytical instrument for your personal evolution. Track,
              analyze, and master your daily disciplines.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["A", "B", "C"].map((item) => (
                <div
                  key={item}
                  className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#0056b3] bg-blue-50 text-[10px] font-black text-blue-700"
                >
                  {item}
                </div>
              ))}
            </div>

            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
              Join 12,000+ High-Performers
            </p>
          </div>
        </aside>

        <section className="flex h-full flex-col justify-center p-8 md:p-12">
          <SignupForm />
        </section>
      </section>
    </main>
  );
}
