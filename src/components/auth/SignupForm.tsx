"use client";

import type { User } from "@/types/auth";
import { readLocalStorageValue, setLocalStorageValue } from "@/lib/storage";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

function getStoredUsers(): User[] {
  return readLocalStorageValue<User[]>("habit-tracker-users", []);
}

function createUserId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const existingUser = users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      setError("User already exists");
      return;
    }

    if (!normalizedEmail || !password) {
      setError("Email and password are required");
      return;
    }

    const newUser: User = {
      id: createUserId(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    setLocalStorageValue(
      "habit-tracker-users",
      [...users, newUser],
    );

    setLocalStorageValue(
      "habit-tracker-session",
      {
        userId: newUser.id,
        email: newUser.email,
      },
    );

    window.location.href = "/dashboard";
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h2 className="mb-2 text-2xl font-bold text-slate-800">
        Create an account
      </h2>
      <p className="mb-8 text-sm text-slate-500">
        Enter your details to begin your journey.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div
            className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-email"
            className="mb-2 block pr-2 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400"
          >
            Email Address
          </label>
          <input
            id="signup-email"
            data-testid="auth-signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-200 p-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="name@company.com"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-password"
            className="mb-2 block pr-2 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400"
          >
            Password
          </label>
          <input
            id="signup-password"
            data-testid="auth-signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-slate-200 p-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            required
          />
          <p className="mt-2 block text-[10px] tracking-[0.1em] text-slate-400">
            Stored locally for this stage of the app.
          </p>
        </div>

        <button
          type="submit"
          data-testid="auth-signup-submit"
          className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#0056b3] py-3.5 font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign Up
          <ArrowRight className="h-5 w-5" />
        </button>

        <div className="relative my-8">
          <div className="flex items-center justify-center gap-1">
            <span className="my-4 w-full border-t border-slate-200 text-slate-500" />
            <div className="relative flex flex-1 shrink-0 items-center justify-center whitespace-nowrap bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Or continue with
            </div>
            <span className="my-4 w-full border-t border-slate-200 text-slate-500" />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-slate-400 transition-all"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-slate-400 transition-all"
          >
            <span>Apple</span>
          </button>
        </div>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-blue-600 hover:underline">
          Log In
        </Link>
      </p>

      <div className="my-4 w-full border-t border-slate-200 text-slate-500" />
      <div className="flex items-center justify-center gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Privacy Policy
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Terms of Service
        </p>
      </div>
    </div>
  );
}
