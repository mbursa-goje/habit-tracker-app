import { CheckCircle2 } from "lucide-react";

export default function SplashScreen() {
  return (
    <main
      data-testid="splash-screen"
      className="grid min-h-screen place-items-center bg-[#f4f7ff] px-6 text-slate-950"
    >
      <section className="flex flex-col items-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 shadow-sm">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-blue-700">
          Habit Tracker
        </h1>

        <p className="mt-3 max-w-xs text-sm font-medium leading-6 text-slate-500">
          Preparing your daily progress workspace.
        </p>

        <div className="mt-8 h-1.5 w-44 overflow-hidden rounded-full bg-blue-100">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-700" />
        </div>
      </section>
    </main>
  );
}
