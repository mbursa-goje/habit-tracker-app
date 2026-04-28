"use client";

import type { User } from "@/types/auth";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

function getStoredUsers(): User[] {
  const usersData = localStorage.getItem("habit-tracker-users");

  if (!usersData) {
    return [];
  }

  try {
    return JSON.parse(usersData) as User[];
  } catch {
    return [];
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();
    const users = getStoredUsers();
    const matchingUser = users.find(
      (user) => user.email === normalizedEmail && user.password === password,
    );

    if (!matchingUser) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem(
      "habit-tracker-session",
      JSON.stringify({
        userId: matchingUser.id,
        email: matchingUser.email,
      }),
    );

    window.location.href = "/dashboard";
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-950">Welcome back</h1>
        <p className="mt-2 text-base text-slate-600">
          Log in to continue tracking your daily progress.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div
            className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Email Address
          </label>
          <input
            id="login-email"
            data-testid="auth-login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className="w-full rounded border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-slate-900"
            >
              Password
            </label>
            <button
              type="button"
              className="text-sm font-semibold text-blue-700 transition hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Forgot?
            </button>
          </div>
          <input
            id="login-password"
            data-testid="auth-login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="w-full rounded border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        <label className="flex w-fit items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
          />
          Keep me logged in
        </label>

        <button
          type="submit"
          data-testid="auth-login-submit"
          className="inline-flex w-full items-center justify-center gap-3 rounded bg-blue-700 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Log In
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <div className="my-8 border-t border-slate-200" />

      <div className="space-y-5">
        <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Or continue with
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled
            className="rounded border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-400"
          >
            Google
          </button>
          <button
            type="button"
            disabled
            className="rounded border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-400"
          >
            Apple
          </button>
        </div>

        <p className="text-center text-base text-slate-700">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-blue-700">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
