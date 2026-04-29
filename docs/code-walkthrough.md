# Habit Tracker Code Walkthrough

This file is a dense study guide for the current Habit Tracker codebase.
Use it as a reference while coding, debugging, reviewing commits, or preparing
for mentor questions.

The production files should stay readable and professional. This document is
where the deep line-by-line explanation lives.

## TRD Source Of Truth

The Technical Requirements Document, or TRD, controls the app behavior.

The app must support these routes:

- `/` renders a splash screen, waits long enough to be testable, then redirects.
- `/login` renders the login form.
- `/signup` renders the signup form.
- `/dashboard` renders the protected dashboard.

The app must use these localStorage keys:

- `habit-tracker-users`
- `habit-tracker-session`
- `habit-tracker-habits`

The app must keep auth local and deterministic:

- Signup creates a user in `habit-tracker-users`.
- Signup creates a session in `habit-tracker-session`.
- Login checks `habit-tracker-users`.
- Login creates a session in `habit-tracker-session`.
- Logout removes `habit-tracker-session`.

The app must keep habit persistence local and deterministic:

- Habits live in `habit-tracker-habits`.
- Each habit belongs to one user through `userId`.
- Dashboard must only show habits for the active `session.userId`.
- Completion is stored as calendar dates in `YYYY-MM-DD` format.

## App Router Mental Model

The project uses the Next.js App Router.

`src/app/layout.tsx` is the root layout. It wraps every route.

`src/app/page.tsx` is the `/` route.

`src/app/login/page.tsx` is the `/login` route.

`src/app/signup/page.tsx` is the `/signup` route.

`src/app/dashboard/page.tsx` is the `/dashboard` route.

You do not manually import the login page into `layout.tsx`.

You do not manually import the signup page into `layout.tsx`.

You do not manually import the dashboard page into `layout.tsx`.

Next.js reads the folder structure and renders the correct `page.tsx` file
based on the URL.

`layout.tsx` should stay global and boring:

- Import global CSS.
- Define global metadata if needed.
- Render `<html>`, `<body>`, and `{children}`.

`page.tsx` files should contain route-specific behavior.

## Commit Message Reference

Use this format:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

The type is lowercase:

- `feat` means user-facing feature.
- `fix` means user-facing bug fix.
- `docs` means documentation-only change.
- `style` means visual or formatting change that does not alter behavior.
- `refactor` means behavior stays the same but code structure changes.
- `test` means tests are added or corrected.
- `config` means configuration changes.
- `build` means build system or dependency-related changes.
- `chore` means maintenance work.

The subject should be imperative:

- Good: `feat(auth): add login flow`
- Avoid: `feat(auth): added login flow`

The subject should not end with a period.

The body should explain what and why.

The footer can mention TRD alignment, issue references, or breaking changes.

## `next.config.ts`

Purpose: keep Next.js and Turbopack pointed at this project folder.

```ts
import type { NextConfig } from "next";
import path from "node:path";
```

`import type { NextConfig } from "next";`
imports only the TypeScript type for the Next config object.

`import type` disappears from JavaScript output because it is only used for
type checking.

`import path from "node:path";`
imports Node's built-in path helper.

`node:path` is the explicit Node module name.

The config uses `path.resolve(__dirname)` to create an absolute path to the
folder containing `next.config.ts`.

```ts
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
};
```

`const nextConfig` creates the config object.

`: NextConfig` tells TypeScript this object must match Next.js config shape.

`turbopack` configures the Turbopack compiler.

`root` tells Turbopack what folder should count as the project root.

This matters because Next detected another lockfile at `C:\Users\HP` and tried
to treat that parent folder as the workspace root.

When Turbopack selected `C:\Users\HP`, the build failed with an access denied
error while reading folders outside the app.

`path.resolve(__dirname)` makes the root explicit and keeps compilation inside
`C:\Users\HP\Desktop\habit-tracker-app`.

```ts
export default nextConfig;
```

This exports the config so Next.js can read it.

## `src/types/auth.ts`

Purpose: define the exact auth data shapes required by the TRD.

```ts
export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};
```

`export type User` makes the `User` type available to other files.

`id: string` is the unique identifier for a user.

`email: string` stores the user's email address.

`password: string` stores the user's password for this local-only stage.

This is not production-secure auth. It is required by the front-end-focused
TRD for deterministic localStorage behavior.

`createdAt: string` stores the creation timestamp.

The timestamp should be an ISO string, usually from `new Date().toISOString()`.

```ts
export type Session = {
  userId: string;
  email: string;
};
```

`export type Session` makes the session type available to other files.

`userId: string` links the session to one user.

`email: string` stores the active user's email for convenience.

The TRD session shape does not include `name`.

Adding `name` to this type would drift away from the mentor contract.

## `src/types/habit.ts`

Purpose: define the exact habit data shape required by the TRD.

```ts
export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[];
};
```

`export type Habit` makes the `Habit` type available to dashboard, forms, and
utility functions.

`id: string` is the unique habit identifier.

`userId: string` stores the owner of the habit.

`userId` must match `session.userId` before the habit is shown on dashboard.

`name: string` stores the visible habit name.

`description: string` stores optional supporting text.

The field is still a string even when empty.

`frequency: "daily"` is a string literal type.

That means the only valid value is exactly `"daily"`.

Weekly, monthly, custom schedules, repeat days, and reminders are out of scope
for this TRD stage.

`createdAt: string` stores the creation timestamp.

`completions: string[]` stores the calendar dates when the habit was completed.

Each completion must use `YYYY-MM-DD`.

The app should prevent duplicate dates in `completions`.

## `src/lib/slug.ts`

Purpose: turn a habit name into a stable test-id-safe slug.

```ts
export function getHabitSlug(name: string): string {
```

`export function` makes the helper available to components and tests.

`getHabitSlug` is the exact function name required by the TRD.

`name: string` means the function expects habit name text.

`: string` means the function returns text.

```ts
  return name
```

The function returns the transformed version of the input name.

The transformation is chained so each line handles one rule.

```ts
    .trim()
```

`trim()` removes leading and trailing spaces.

Example: `"  Drink Water  "` becomes `"Drink Water"`.

```ts
    .toLowerCase()
```

`toLowerCase()` normalizes casing.

Example: `"Drink Water"` becomes `"drink water"`.

```ts
    .replace(/\s+/g, "-")
```

This replaces one or more whitespace characters with a single hyphen.

`\s+` means one or more whitespace characters.

`g` means global, so it applies to all matches.

Example: `"read   books"` becomes `"read-books"`.

```ts
    .replace(/[^a-z0-9-]/g, "");
```

This removes characters that are not lowercase letters, numbers, or hyphens.

`^` inside `[]` means "not these characters."

`a-z` allows lowercase letters.

`0-9` allows digits.

`-` allows hyphens.

Example: `"Drink Water!"` becomes `"drink-water"`.

```ts
}
```

This closes the function.

## `src/lib/validators.ts`

Purpose: validate habit names with exact TRD messages.

```ts
export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
```

`validateHabitName` is the exact function name required by the TRD.

`name: string` is the incoming raw input.

The return object has three fields.

`valid` tells the caller whether the value passed validation.

`value` returns the normalized trimmed value.

`error` is either a message or `null`.

```ts
  const value = name.trim();
```

This removes outer spaces before validation.

The trimmed value is what the app should save when valid.

```ts
  if (!value) {
```

This checks for an empty string after trimming.

`!value` is true for `""`.

```ts
    return {
      valid: false,
      value,
      error: "Habit name is required",
    };
```

This returns the required TRD empty-input message.

The message must stay exactly `Habit name is required`.

```ts
  if (value.length > 60) {
```

This checks the maximum habit name length.

The TRD limit is 60 characters.

```ts
    return {
      valid: false,
      value,
      error: "Habit name must be 60 characters or fewer",
    };
```

This returns the required TRD long-input message.

The message must stay exactly `Habit name must be 60 characters or fewer`.

```ts
  return {
    valid: true,
    value,
    error: null,
  };
```

This is the success path.

`valid: true` means the name can be saved.

`value` is the trimmed habit name.

`error: null` means no validation error exists.

## `src/lib/streaks.ts`

Purpose: calculate the current streak from completion dates.

```ts
function getPreviousDate(date: string): string {
```

This helper is private because it is not exported.

It receives one `YYYY-MM-DD` date string.

It returns the previous calendar date in `YYYY-MM-DD` format.

```ts
  const currentDate = new Date(`${date}T00:00:00.000Z`);
```

This creates a Date object at midnight UTC for the input date.

Adding `T00:00:00.000Z` prevents JavaScript from guessing a local time format.

```ts
  currentDate.setUTCDate(currentDate.getUTCDate() - 1);
```

`getUTCDate()` reads the day of the month in UTC.

Subtracting `1` moves one calendar day backward.

`setUTCDate(...)` updates the Date object.

JavaScript handles month and year boundaries automatically.

Example: previous day from `2026-05-01` becomes `2026-04-30`.

```ts
  return currentDate.toISOString().split("T")[0];
```

`toISOString()` returns a string like `2026-04-28T00:00:00.000Z`.

`split("T")` divides the string at `T`.

`[0]` keeps only the date portion.

The result is `YYYY-MM-DD`.

```ts
export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
```

`calculateCurrentStreak` is the exact function name required by the TRD.

`completions` is the habit's list of completed dates.

`today?` is optional so tests can pass a fixed date.

`: number` means the function returns the streak count.

```ts
  const currentDay = today ?? new Date().toISOString().split("T")[0];
```

If `today` is provided, use it.

If `today` is missing, calculate today's ISO date.

`??` means "use the right side only when the left side is null or undefined."

```ts
  const completedDates = new Set(completions);
```

`Set` removes duplicate completion dates.

This satisfies the TRD requirement to ignore duplicates before calculating.

```ts
  if (!completedDates.has(currentDay)) {
    return 0;
  }
```

If today is not completed, the current streak is zero.

This is a TRD rule.

Example: `[yesterday]` returns `0`, not `1`.

```ts
  let streak = 0;
  let dateToCheck = currentDay;
```

`streak` counts consecutive completed days.

`dateToCheck` starts at today and moves backward one day at a time.

```ts
  while (completedDates.has(dateToCheck)) {
```

The loop continues while the date being checked exists in completions.

```ts
    streak += 1;
```

Each matching date adds one day to the streak.

```ts
    dateToCheck = getPreviousDate(dateToCheck);
```

After counting one date, move to the previous calendar day.

```ts
  return streak;
```

The loop stops when a missing date breaks the chain.

The final value is the current streak.

## `src/lib/habits.ts`

Purpose: toggle one completion date on a habit without mutating the original.

```ts
import type { Habit } from "@/types/habit";
```

This imports the `Habit` type.

`import type` means the import is used only by TypeScript.

```ts
export function toggleHabitCompletion(habit: Habit, date: string): Habit {
```

`toggleHabitCompletion` is the exact function name required by the TRD.

`habit` is the habit being updated.

`date` is the `YYYY-MM-DD` completion date being toggled.

The return type is `Habit`.

```ts
  const completions = new Set(habit.completions);
```

This copies existing completion dates into a Set.

The Set removes duplicates.

This also avoids mutating `habit.completions` directly.

```ts
  if (completions.has(date)) {
    completions.delete(date);
  } else {
    completions.add(date);
  }
```

If the date already exists, remove it.

That means the habit becomes uncompleted for that date.

If the date does not exist, add it.

That means the habit becomes completed for that date.

```ts
  return {
    ...habit,
    completions: Array.from(completions).sort(),
  };
```

This returns a new habit object.

`...habit` copies all existing fields.

`completions` is replaced with the updated dates.

`Array.from(completions)` converts the Set back to an array.

`sort()` keeps dates stable and deterministic.

The original `habit` object is not mutated.

## `src/components/auth/LoginForm.tsx`

Purpose: render and process the `/login` form.

The file starts with:

```tsx
"use client";
```

This marks the component as a Client Component.

This is required because the form uses state, event handlers, and
`localStorage`.

Server Components cannot use `useState`.

Server Components cannot directly access browser-only APIs like localStorage.

```tsx
import type { User } from "@/types/auth";
```

This imports the TRD `User` type.

The login form uses it to type the parsed `habit-tracker-users` array.

```tsx
import { AlertCircle, ArrowRight } from "lucide-react";
```

This imports icons from Lucide.

`AlertCircle` appears beside the invalid login message.

`ArrowRight` appears in the submit button.

```tsx
import Link from "next/link";
```

`Link` provides client-side navigation to `/signup`.

It is preferred over a plain `<a>` for internal Next routes.

```tsx
import { FormEvent, useState } from "react";
```

`FormEvent` types the submit event.

`useState` stores form input values and error state.

```tsx
function getStoredUsers(): User[] {
```

This helper reads users from localStorage.

It returns an array of users.

Keeping this logic in a helper makes submit handling easier to read.

```tsx
  const usersData = localStorage.getItem("habit-tracker-users");
```

This reads the TRD users key.

If no user has signed up yet, the value may be `null`.

```tsx
  if (!usersData) {
    return [];
  }
```

If localStorage has no users value, return an empty array.

This prevents JSON parsing `null`.

```tsx
  try {
    return JSON.parse(usersData) as User[];
  } catch {
    return [];
  }
```

`JSON.parse` converts stored JSON text back into JavaScript objects.

`as User[]` tells TypeScript what shape we expect.

The `catch` protects the page from crashing if localStorage has invalid JSON.

Returning `[]` makes invalid stored users behave like no users.

```tsx
export default function LoginForm() {
```

This exports the login form as the default component.

`src/app/login/page.tsx` imports and renders it.

```tsx
const [email, setEmail] = useState("");
```

`email` stores the current email input.

`setEmail` updates it as the user types.

The initial value is an empty string.

```tsx
const [password, setPassword] = useState("");
```

`password` stores the password input.

It is compared against the stored local user password.

```tsx
const [rememberMe, setRememberMe] = useState(false);
```

`rememberMe` stores the checkbox state.

The checkbox is currently visual state only.

The TRD session behavior is deterministic and does not require different
remember-me persistence.

```tsx
const [error, setError] = useState("");
```

`error` stores the visible login error message.

The empty string means no error is shown.

```tsx
function handleSubmit(event: FormEvent<HTMLFormElement>) {
```

This function runs when the user submits the form.

`FormEvent<HTMLFormElement>` tells TypeScript the event came from a form.

```tsx
event.preventDefault();
```

This stops the browser from doing a full page reload.

React handles the login in JavaScript.

```tsx
const normalizedEmail = email.trim();
```

This removes accidental spaces around the email.

Example: `" user@example.com "` becomes `"user@example.com"`.

```tsx
const users = getStoredUsers();
```

This loads all local users.

```tsx
const matchingUser = users.find(
  (user) => user.email === normalizedEmail && user.password === password,
);
```

`find` searches for the first user matching both email and password.

Both fields must match.

This implements the TRD login rule.

```tsx
if (!matchingUser) {
  setError("Invalid email or password");
  return;
}
```

If no user matches, show the exact required TRD error.

The message must stay `Invalid email or password`.

`return` stops the successful login path.

```tsx
localStorage.setItem(
  "habit-tracker-session",
  JSON.stringify({
    userId: matchingUser.id,
    email: matchingUser.email,
  }),
);
```

This creates the active session.

The key is exactly `habit-tracker-session`.

The stored object matches the TRD `Session` type.

`JSON.stringify` converts the object into localStorage text.

```tsx
window.location.href = "/dashboard";
```

This redirects to the protected dashboard after successful login.

```tsx
return (
  <div className="w-full">
```

The component returns JSX.

`w-full` makes the form container fill the width provided by the page layout.

```tsx
<div className="mb-8 text-center md:text-left">
```

`mb-8` adds bottom spacing before the form.

`text-center` centers heading text on mobile.

`md:text-left` left-aligns text on desktop and wider screens.

```tsx
<h1 className="text-3xl font-bold text-slate-950">Welcome back</h1>
```

`text-3xl` sets the heading size.

`font-bold` makes it strong.

`text-slate-950` makes it near-black.

```tsx
<p className="mt-2 text-base text-slate-600">
```

`mt-2` creates spacing above the paragraph.

`text-base` keeps body copy readable.

`text-slate-600` lowers contrast compared to the heading.

```tsx
<form className="space-y-5" onSubmit={handleSubmit}>
```

`space-y-5` adds vertical spacing between direct children.

`onSubmit` connects the form to the login logic.

```tsx
{error && (...)}
```

This condition renders the error alert only when `error` has text.

```tsx
role="alert"
```

This helps assistive technology announce the error.

```tsx
data-testid="auth-login-email"
```

This is required by the TRD.

Tests use it to find the email input.

```tsx
type="email"
```

This gives browser-level email keyboard and validation behavior.

```tsx
value={email}
```

The input value comes from React state.

```tsx
onChange={(event) => setEmail(event.target.value)}
```

Every keystroke updates React state.

```tsx
required
```

This prevents empty submission at the browser level.

The TRD also requires email to be required.

```tsx
data-testid="auth-login-password"
```

This is required by the TRD.

Tests use it to find the password input.

```tsx
type="password"
```

This masks the password while typing.

```tsx
data-testid="auth-login-submit"
```

This is required by the TRD.

Tests use it to submit the login form.

```tsx
<Link href="/signup">
```

This lets a user without an account move to signup.

It also satisfies the expected auth navigation flow.

## `src/app/login/page.tsx`

Purpose: render the `/login` route shell around `LoginForm`.

```tsx
"use client";
```

The page is a Client Component because it renders a client form and uses
client-friendly visual behavior.

```tsx
import LoginForm from "@/components/auth/LoginForm";
```

This imports the reusable login form component.

Keeping form logic in `LoginForm` makes the route page mostly layout.

```tsx
import { CheckCircle2, Flame } from "lucide-react";
```

These icons support the brand panel.

`CheckCircle2` communicates habits/checklists.

`Flame` communicates streak.

```tsx
export default function LoginPage() {
```

This exports the page for the `/login` route.

Next.js renders this file automatically when the URL is `/login`.

```tsx
<main className="min-h-screen bg-[#f4f7ff] px-5 py-10 ...">
```

`min-h-screen` makes the page at least as tall as the viewport.

`bg-[#f4f7ff]` applies the soft light background from the design.

`px-5` adds horizontal padding on mobile.

`py-10` adds vertical breathing room on mobile.

`md:grid md:place-items-center` centers the desktop card.

```tsx
<section className="mx-auto grid w-full max-w-[1120px] ...">
```

`mx-auto` centers the card horizontally.

`grid` enables grid layout.

`w-full` lets the card shrink on small screens.

`max-w-[1120px]` caps the desktop width.

`overflow-hidden` clips the blue panel to the rounded border.

`rounded-lg` gives the card a restrained radius.

`border border-slate-300` gives the card a visible boundary.

`bg-white` makes the form side white.

`shadow-sm` adds a subtle lift.

`md:min-h-[640px]` sets the desktop card height.

`md:grid-cols-2` creates the split-screen desktop layout.

```tsx
<aside className="relative hidden overflow-hidden bg-blue-800 ...">
```

`relative` allows decorative absolute children inside.

`hidden` hides the brand panel on mobile.

`md:flex` shows it on desktop.

`overflow-hidden` clips the decorative shape.

`bg-blue-800` creates the strong brand panel.

`p-10` adds internal spacing.

`text-white` makes all text white by default.

`md:flex-col md:justify-between` pushes brand text to the top and stats to the
bottom.

```tsx
<section className="flex min-h-screen flex-col justify-between ...">
```

This is the form side.

On mobile it becomes a full-screen centered login experience.

On desktop it fills the right half of the split card.

`px-6 py-10` gives mobile padding.

`md:px-16` gives wider desktop padding.

```tsx
<div className="mx-auto w-full max-w-[440px]">
```

This keeps the form at a comfortable reading width.

`max-w-[440px]` matches the reference design's compact login form.

```tsx
<div className="mb-8 text-center md:hidden">
```

This mobile-only brand block replaces the hidden desktop blue panel.

`md:hidden` removes it on desktop.

```tsx
<LoginForm />
```

This renders the actual form fields, validation, and login behavior.

```tsx
<footer className="mt-12 text-center text-xs text-slate-500 md:hidden">
```

This mobile footer matches the mobile reference.

It is hidden on desktop because the split card already carries enough brand
context.

## `src/components/auth/SignupForm.tsx`

Purpose: render and process the `/signup` form required by the TRD.

```tsx
"use client";
```

This marks the file as a Client Component.

The component needs browser APIs.

It uses `useState`.

It reads and writes `localStorage`.

Those operations cannot run inside a Server Component.

```tsx
import type { User } from "@/types/auth";
```

This imports the exact TRD `User` type.

The form uses it to type the array stored under `habit-tracker-users`.

`import type` keeps the import out of runtime JavaScript.

```tsx
import { AlertCircle, ArrowRight } from "lucide-react";
```

`AlertCircle` is used beside the visible error message.

`ArrowRight` is used in the submit button.

Icons help the form read as interactive without adding extra copy.

```tsx
import Link from "next/link";
```

`Link` is the Next.js component for internal navigation.

The signup form uses it for the `/login` link.

```tsx
import { FormEvent, useState } from "react";
```

`FormEvent` gives the submit event a precise TypeScript type.

`useState` stores email, password, and error values.

```tsx
function getStoredUsers(): User[] {
```

This helper reads users from `localStorage`.

It returns an array every time.

That keeps submit logic simple.

```tsx
const usersData = localStorage.getItem("habit-tracker-users");
```

This reads the exact TRD storage key for users.

The value is either JSON text or `null`.

```tsx
if (!usersData) {
  return [];
}
```

If no users exist yet, return an empty array.

This lets the first signup succeed cleanly.

```tsx
try {
  return JSON.parse(usersData) as User[];
} catch {
  return [];
}
```

`JSON.parse` converts stored text into JavaScript data.

`as User[]` tells TypeScript the expected shape.

The `catch` protects the page if localStorage contains invalid JSON.

Returning `[]` is a safe fallback for this local-only stage.

```tsx
function createUserId(): string {
```

This helper creates a unique user id.

The TRD requires `id` to be a string.

```tsx
if (typeof crypto !== "undefined" && crypto.randomUUID) {
  return crypto.randomUUID();
}
```

`crypto.randomUUID()` creates a strong browser-generated unique id.

The guard checks that `crypto` exists before using it.

This keeps the helper safe in unusual environments.

```tsx
return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
```

This fallback still returns a unique-ish string.

`Date.now()` adds the current timestamp.

`Math.random()` adds random text.

The fallback is not a security feature.

It is only an id generator for localStorage records.

```tsx
export default function SignupForm() {
```

This exports the signup form as the default component.

`src/app/signup/page.tsx` imports and renders it.

```tsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
```

`email` stores the current email input.

`setEmail` updates email state.

`password` stores the current password input.

`setPassword` updates password state.

`error` stores the visible form error.

An empty error string means no error is shown.

```tsx
function handleSubmit(event: FormEvent<HTMLFormElement>) {
```

This function runs when the signup form is submitted.

The event type says this is a form submit event.

```tsx
event.preventDefault();
```

This prevents the browser's default full-page form submission.

React handles the signup in JavaScript.

```tsx
const normalizedEmail = email.trim().toLowerCase();
```

`trim()` removes accidental outer spaces.

`toLowerCase()` makes duplicate email checks deterministic.

Example: `USER@EXAMPLE.COM` and `user@example.com` become the same email.

```tsx
const users = getStoredUsers();
```

This loads the current local users.

```tsx
const existingUser = users.find((user) => user.email === normalizedEmail);
```

This checks for duplicate signup email.

The TRD requires duplicate signup to be rejected.

```tsx
if (existingUser) {
  setError("User already exists");
  return;
}
```

This shows the exact TRD duplicate message.

The message must remain `User already exists`.

`return` stops the rest of signup from running.

```tsx
if (!normalizedEmail || !password) {
  setError("Email and password are required");
  return;
}
```

This handles missing values in JavaScript.

The inputs also use `required`, but this keeps the logic explicit.

The TRD requires both email and password.

```tsx
const newUser: User = {
  id: createUserId(),
  email: normalizedEmail,
  password,
  createdAt: new Date().toISOString(),
};
```

This creates the new user object.

`: User` forces the object to match the TRD type.

`id` uses the helper above.

`email` stores the normalized email.

`password` stores the entered password for this local-only stage.

`createdAt` stores an ISO timestamp.

```tsx
localStorage.setItem(
  "habit-tracker-users",
  JSON.stringify([...users, newUser]),
);
```

This writes the updated users array to localStorage.

The key is exactly `habit-tracker-users`.

`[...users, newUser]` creates a new array with the new user appended.

`JSON.stringify` converts the array into text for localStorage.

```tsx
localStorage.setItem(
  "habit-tracker-session",
  JSON.stringify({
    userId: newUser.id,
    email: newUser.email,
  }),
);
```

This logs the user in immediately after signup.

The key is exactly `habit-tracker-session`.

The stored object matches the TRD `Session` type.

`userId` links the session to the new user.

`email` stores the active user's email.

```tsx
window.location.href = "/dashboard";
```

This redirects to the protected dashboard after successful signup.

```tsx
data-testid="auth-signup-email"
```

This is required by the TRD.

Tests use it to find the signup email input.

```tsx
data-testid="auth-signup-password"
```

This is required by the TRD.

Tests use it to find the signup password input.

```tsx
data-testid="auth-signup-submit"
```

This is required by the TRD.

Tests use it to submit the signup form.

```tsx
type="button"
disabled
```

The social buttons are explicitly non-submit buttons.

They are disabled because the TRD only allows local deterministic auth.

Google or Apple auth would be outside this stage.

## `src/app/signup/page.tsx`

Purpose: render the `/signup` route shell and visual split layout.

The page imports `SignupForm`.

The page imports `CheckCircle2` for the brand mark.

The route itself no longer owns signup logic.

That logic lives in `SignupForm`.

The top-level `<main>` creates the full-screen centered background.

The card uses `grid grid-cols-1 md:grid-cols-2`.

That means mobile has one stacked column.

Desktop has two equal columns.

The left `<aside>` is the blue brand panel.

The right `<section>` centers the form.

The avatar images are decorative.

Their `alt=""` keeps screen readers from announcing meaningless avatar
content.

The page remains responsible for layout and branding.

The form component remains responsible for state, validation, persistence, and
redirect behavior.

## `src/components/habits/HabitForm.tsx`

Purpose: render the TRD create/edit habit form.

The form supports both create and edit mode through an optional `habit` prop.

It does not store extra fields outside the TRD shape.

It only saves `name`, `description`, and `frequency: "daily"`.

```tsx
"use client";
```

The component uses `useState`, `useEffect`, and form event handlers.

Those are client-side React features.

The directive tells Next.js this file must run in the browser.

```tsx
import type { Habit } from "@/types/habit";
```

This imports the TRD `Habit` type.

The type is used for the optional `habit` being edited.

```tsx
import { validateHabitName } from "@/lib/validators";
```

This imports the required validator helper.

Using the helper keeps the form aligned with the exact TRD validation
messages.

```tsx
export type HabitFormValues = {
  name: string;
  description: string;
  frequency: "daily";
};
```

This type describes the values the form sends upward.

`name` maps to `habit.name`.

`description` maps to `habit.description`.

`frequency` is locked to `"daily"`.

The form does not send `id`, `userId`, `createdAt`, or `completions`.

Those fields are owned by the dashboard logic.

That separation matters because edit behavior must preserve immutable fields.

```tsx
type HabitFormProps = {
  habit?: Habit | null;
  onSave: (values: HabitFormValues) => void;
  onCancel: () => void;
};
```

`habit` is present when editing and missing when creating.

`onSave` lets the parent decide whether to create or update.

`onCancel` closes the form without saving.

```tsx
const [name, setName] = useState(habit?.name ?? "");
```

When editing, the input starts with the habit name.

When creating, it starts empty.

`?? ""` prevents uncontrolled input warnings.

```tsx
const [description, setDescription] = useState(habit?.description ?? "");
```

The description works the same way as name.

The TRD says description is optional, but it is still stored as a string.

```tsx
const [error, setError] = useState<string | null>(null);
```

The form stores one validation error at a time.

`null` means no visible error.

```tsx
useEffect(() => {
  setName(habit?.name ?? "");
  setDescription(habit?.description ?? "");
  setError(null);
}, [habit]);
```

This effect resets the form whenever the selected habit changes.

If the user edits Habit A, closes it, then edits Habit B, the fields update.

The error is cleared so old validation messages do not leak into the new form.

```tsx
function handleSubmit(event: FormEvent<HTMLFormElement>) {
```

This handles form submission.

The type says the event comes from an HTML form.

```tsx
event.preventDefault();
```

This stops the browser from doing a full page reload.

React and localStorage handle the save.

```tsx
const result = validateHabitName(name);
```

The raw name goes through the TRD validator.

The validator trims the value and checks empty/length rules.

```tsx
if (!result.valid) {
  setError(result.error);
  return;
}
```

Invalid names stop the save.

The exact validator message is shown.

```tsx
onSave({
  name: result.value,
  description: description.trim(),
  frequency: "daily",
});
```

The form sends normalized values to the parent.

`result.value` is the trimmed habit name.

`description.trim()` removes accidental outer spaces.

`frequency` is always `"daily"` because weekly is outside the TRD stage.

```tsx
data-testid="habit-form"
```

This marks the form for tests.

```tsx
data-testid="habit-name-input"
```

This marks the habit name input for tests.

```tsx
data-testid="habit-description-input"
```

This marks the description textarea for tests.

```tsx
data-testid="habit-frequency-select"
```

This marks the frequency select for tests.

The select only contains `Daily`.

```tsx
data-testid="habit-save-button"
```

This marks the save button for tests.

## `src/components/habits/HabitCard.tsx`

Purpose: render one habit and expose the required habit action test IDs.

```tsx
const slug = getHabitSlug(habit.name);
```

The slug is derived from the habit name.

If the habit is `Drink Water`, the slug is `drink-water`.

The slug is used to build deterministic test IDs.

```tsx
const isCompletedToday = habit.completions.includes(today);
```

This checks whether today's `YYYY-MM-DD` date exists in `completions`.

If it exists, the habit is complete for today.

If it does not exist, the habit is incomplete for today.

```tsx
const streak = calculateCurrentStreak(habit.completions, today);
```

This calculates the visible current streak.

The helper returns zero if today is not completed.

The helper counts backward from today while dates are consecutive.

```tsx
const completionRate = Math.min(
  100,
  Math.round((new Set(habit.completions).size / 30) * 100),
);
```

This creates a simple recent performance percentage for the visual card.

`new Set(...)` removes duplicate dates.

The rate compares unique completions against 30 days.

`Math.min(100, ...)` prevents values over 100%.

This value is derived from `completions`.

It is not persisted as a new field.

```tsx
data-testid={`habit-card-${slug}`}
```

This satisfies the TRD habit card test ID requirement.

```tsx
data-testid={`habit-edit-${slug}`}
```

This marks the edit button for the habit.

Clicking it calls the parent `onEdit`.

The dashboard then opens `HabitForm` with this habit.

```tsx
data-testid={`habit-delete-${slug}`}
```

This marks the delete button for the habit.

Clicking it does not delete immediately.

It opens a confirmation panel.

This satisfies the TRD rule that deletion requires explicit confirmation.

```tsx
data-testid={`habit-streak-${slug}`}
```

This marks the visible streak display for tests.

```tsx
data-testid={`habit-complete-${slug}`}
```

This marks the completion toggle button.

Clicking it toggles today's date only.

```tsx
aria-pressed={isCompletedToday}
```

This makes the completion state accessible.

Assistive technologies can tell whether the toggle is active.

```tsx
data-testid="confirm-delete-button"
```

This marks the final destructive confirmation button.

The test ID is not slugged because the TRD requires this exact value.

The button only appears after the first delete button is clicked.

## `src/app/dashboard/page.tsx`

Purpose: implement the protected dashboard and local habit behavior.

```tsx
import HabitCard from "@/components/habits/HabitCard";
import HabitForm, { type HabitFormValues } from "@/components/habits/HabitForm";
```

The dashboard renders habit cards and the create/edit form.

`HabitFormValues` types the object received from the form on save.

```tsx
import { toggleHabitCompletion } from "@/lib/habits";
```

This imports the TRD completion toggle helper.

Using it keeps duplicate prevention and immutability centralized.

```tsx
import { calculateCurrentStreak } from "@/lib/streaks";
```

The dashboard uses this to calculate the best streak summary.

Each card also calculates its own streak.

```tsx
function getTodayIsoDate() {
  return new Date().toISOString().split("T")[0];
}
```

This returns today's date in `YYYY-MM-DD` format.

That is the date format required by the TRD for `completions`.

```tsx
function createHabitId(): string {
```

This creates a unique id for new habits.

The TRD requires habit IDs to be unique strings.

```tsx
function readStoredHabits(): Habit[] {
```

This reads `habit-tracker-habits`.

If the key is missing, it returns an empty array.

If the stored JSON is broken, it resets the key to `[]`.

This prevents the dashboard from crashing on bad localStorage data.

```tsx
function readStoredSession(): Session | null {
```

This reads `habit-tracker-session`.

If no valid session exists, it returns `null`.

The dashboard uses `null` to redirect to `/login`.

```tsx
const [session, setSession] = useState<Session | null>(null);
```

`session` stores the logged-in user session.

It starts as `null` until localStorage is read.

```tsx
const [habits, setHabits] = useState<Habit[]>([]);
```

`habits` stores all habits from localStorage.

This includes habits for all users.

Filtering happens separately.

```tsx
const [isFormOpen, setIsFormOpen] = useState(false);
```

This decides whether `HabitForm` is visible.

```tsx
const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
```

`editingHabit` is `null` when creating a new habit.

It contains a habit object when editing.

```tsx
useEffect(() => {
  const storedSession = readStoredSession();
```

The dashboard reads the session after the browser renders.

This must happen client-side because localStorage is browser-only.

```tsx
if (!storedSession) {
  window.location.href = "/login";
  return;
}
```

This protects `/dashboard`.

Unauthenticated users are redirected to `/login`.

```tsx
setSession(storedSession);
setHabits(readStoredHabits());
```

Once authenticated, the dashboard stores the session and loads habits.

```tsx
const userHabits = useMemo(
  () => habits.filter((habit) => habit.userId === session?.userId),
  [habits, session?.userId],
);
```

This filters all stored habits down to the logged-in user's habits.

This satisfies the TRD rule that dashboard only renders the active user's
habits.

`useMemo` avoids recalculating unless habits or session user changes.

```tsx
const activeCount = userHabits.length;
```

This is the number of habits owned by the active user.

```tsx
const doneTodayCount = userHabits.filter((habit) =>
  habit.completions.includes(today),
).length;
```

This counts how many user habits are completed today.

```tsx
const progressPercent =
  activeCount === 0 ? 0 : Math.round((doneTodayCount / activeCount) * 100);
```

This calculates dashboard progress.

If there are no habits, progress is zero.

The zero guard prevents division by zero.

```tsx
const bestStreak = userHabits.length
  ? Math.max(...userHabits.map(...))
  : 0;
```

This calculates the best current streak across the user's habits.

If there are no habits, the best streak is zero.

```tsx
function saveHabits(nextHabits: Habit[]) {
  setHabits(nextHabits);
  localStorage.setItem("habit-tracker-habits", JSON.stringify(nextHabits));
}
```

This is the central save function.

It updates React state.

It writes the same data to localStorage.

Every create, edit, delete, and toggle goes through this function.

```tsx
function openCreateForm() {
  setEditingHabit(null);
  setIsFormOpen(true);
}
```

This opens the form in create mode.

`editingHabit` is cleared so the form starts empty.

```tsx
function openEditForm(habit: Habit) {
  setEditingHabit(habit);
  setIsFormOpen(true);
}
```

This opens the form in edit mode.

The selected habit is passed into `HabitForm`.

```tsx
function handleSaveHabit(values: HabitFormValues) {
```

This receives normalized form values.

It decides whether to create or edit based on `editingHabit`.

```tsx
if (editingHabit) {
  const nextHabits = habits.map((habit) =>
    habit.id === editingHabit.id
      ? { ...habit, name: values.name, description: values.description, frequency: "daily" }
      : habit,
  );
```

Edit mode updates only the editable fields.

`id` is preserved.

`userId` is preserved.

`createdAt` is preserved.

`completions` is preserved.

This satisfies the TRD edit rules.

```tsx
const newHabit: Habit = {
  id: createHabitId(),
  userId: session.userId,
  name: values.name,
  description: values.description,
  frequency: "daily",
  createdAt: new Date().toISOString(),
  completions: [],
};
```

Create mode builds a complete TRD habit object.

The habit belongs to the active session user.

Frequency is always daily.

New habits start with no completions.

```tsx
function handleDeleteHabit(habitId: string) {
  saveHabits(habits.filter((habit) => habit.id !== habitId));
}
```

This removes a habit from localStorage and state.

It only runs after the card confirmation button is clicked.

```tsx
function handleToggleHabit(habitId: string) {
  saveHabits(
    habits.map((habit) =>
      habit.id === habitId ? toggleHabitCompletion(habit, today) : habit,
    ),
  );
}
```

This toggles today's completion for one habit.

Other habits remain unchanged.

The helper prevents duplicate dates and avoids mutation.

```tsx
data-testid="dashboard-page"
```

This marks the protected dashboard container for tests.

```tsx
data-testid="create-habit-button"
```

This marks the primary create habit button.

```tsx
data-testid="empty-state"
```

This appears only when the active user has no habits.

The TRD requires this empty state marker.

```tsx
data-testid="auth-logout-button"
```

This marks the logout control.

Logout removes the session and redirects to `/login`.

## Current Remaining Work

## `src/components/shared/SplashScreen.tsx`

Purpose: render the testable splash screen required by the `/` route.

```tsx
import { CheckCircle2 } from "lucide-react";
```

This imports the checklist-style icon used in the splash brand mark.

Lucide icons render as SVG React components.

```tsx
export default function SplashScreen() {
```

This exports the component as the default export.

The root route imports and renders it immediately.

```tsx
return (
  <main
    data-testid="splash-screen"
    className="grid min-h-screen place-items-center bg-[#f4f7ff] px-6 text-slate-950"
  >
```

`data-testid="splash-screen"` is required by the TRD.

Tests can use this attribute to confirm the splash is visible before redirect.

`grid` turns the page into a CSS grid container.

`min-h-screen` makes the splash fill at least the viewport height.

`place-items-center` centers the splash content horizontally and vertically.

`bg-[#f4f7ff]` applies the soft light background used by the login design.

`px-6` adds horizontal padding so content does not touch small mobile edges.

`text-slate-950` sets the default text color to near-black.

```tsx
<section className="flex flex-col items-center text-center">
```

`section` groups the splash content semantically.

`flex flex-col` stacks the icon, title, copy, and progress bar vertically.

`items-center` centers children horizontally.

`text-center` centers text.

```tsx
<div className="grid h-20 w-20 place-items-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 shadow-sm">
```

This creates the icon tile.

`grid place-items-center` centers the icon inside the tile.

`h-20 w-20` makes the tile 80px by 80px.

`rounded-2xl` gives it a soft rounded shape.

`border border-blue-200` adds a light blue outline.

`bg-blue-50` gives the tile a pale blue background.

`text-blue-700` controls the icon color.

`shadow-sm` adds a subtle lift.

```tsx
<CheckCircle2 className="h-10 w-10" />
```

This renders the imported icon.

`h-10 w-10` makes the icon 40px by 40px.

```tsx
<h1 className="mt-6 text-3xl font-bold tracking-tight text-blue-700">
  Habit Tracker
</h1>
```

The TRD requires the splash screen to show the app name `Habit Tracker`.

`mt-6` creates spacing above the title.

`text-3xl` makes the title prominent without becoming oversized.

`font-bold` increases weight.

`tracking-tight` slightly tightens the title spacing.

`text-blue-700` ties the title to the app accent color.

```tsx
<p className="mt-3 max-w-xs text-sm font-medium leading-6 text-slate-500">
```

This supporting copy makes the splash feel intentional.

`mt-3` spaces it below the title.

`max-w-xs` keeps the sentence narrow and readable.

`text-sm` keeps the copy secondary.

`font-medium` improves legibility.

`leading-6` gives the text comfortable line height.

`text-slate-500` lowers emphasis.

```tsx
<div className="mt-8 h-1.5 w-44 overflow-hidden rounded-full bg-blue-100">
```

This creates the loading track.

`mt-8` separates it from the copy.

`h-1.5` makes the bar thin.

`w-44` gives it a stable width.

`overflow-hidden` clips the inner bar to the rounded track.

`rounded-full` makes both ends pill-shaped.

`bg-blue-100` gives the track a pale blue color.

```tsx
<div className="h-full w-2/3 animate-pulse rounded-full bg-blue-700" />
```

This creates the visible loading fill.

`h-full` fills the track height.

`w-2/3` fills about two thirds of the track.

`animate-pulse` adds simple loading motion.

`rounded-full` matches the parent pill shape.

`bg-blue-700` makes the fill the primary blue accent.

## `src/app/page.tsx`

Purpose: implement the TRD splash and boot redirect route at `/`.

```tsx
"use client";
```

The root page must read `localStorage`.

`localStorage` only exists in the browser.

The file also uses `useEffect` and `useRouter`.

Those APIs require a Client Component.

```tsx
import SplashScreen from "@/components/shared/SplashScreen";
```

This imports the visual splash component.

Keeping the UI in a separate component makes the root page focused on boot
logic.

```tsx
import { useRouter } from "next/navigation";
```

This imports the App Router navigation hook.

The bundled Next docs say `useRouter` should come from `next/navigation` in
the App Router.

```tsx
import { useEffect } from "react";
```

`useEffect` runs browser-side after the splash first renders.

That order matters because the TRD requires the splash screen to render
immediately.

```tsx
const SPLASH_DELAY_MS = 1200;
```

This controls how long the splash remains visible.

The TRD target duration is between 800ms and 2000ms.

`1200` sits safely inside that range.

```tsx
function hasStoredSession() {
```

This helper checks whether a valid session exists.

The helper keeps the effect easier to read.

```tsx
const sessionData = localStorage.getItem("habit-tracker-session");
```

This reads the exact TRD session key.

If the user is logged in, this should contain JSON session text.

```tsx
if (!sessionData) {
  return false;
}
```

If the key is missing, there is no active session.

The root page should redirect unauthenticated users to `/login`.

```tsx
try {
  const session = JSON.parse(sessionData) as {
    userId?: unknown;
    email?: unknown;
  };
```

`JSON.parse` converts the stored text into an object.

The temporary type uses `unknown` because localStorage data cannot be trusted.

The code validates the fields before accepting the session.

```tsx
return typeof session.userId === "string" && typeof session.email === "string";
```

The session is treated as valid only when both required TRD fields are strings.

`userId` connects the session to the active user.

`email` stores the active user's email.

```tsx
} catch {
  localStorage.removeItem("habit-tracker-session");
  return false;
}
```

If the stored session is invalid JSON, remove it.

Then report that no valid session exists.

This prevents a broken localStorage value from trapping the app.

```tsx
export default function HomePage() {
```

This exports the `/` route component.

Next.js renders this file when the user visits the root URL.

```tsx
const router = useRouter();
```

This gets the router object.

The page uses it to redirect after the splash delay.

```tsx
useEffect(() => {
```

This effect runs after the component renders in the browser.

That lets the splash screen appear first.

```tsx
const redirectTimer = window.setTimeout(() => {
  router.replace(hasStoredSession() ? "/dashboard" : "/login");
}, SPLASH_DELAY_MS);
```

`window.setTimeout` waits before redirecting.

The delay makes the splash screen visible long enough for tests.

`hasStoredSession()` decides where to send the user.

If a session exists, the user goes to `/dashboard`.

If no session exists, the user goes to `/login`.

`router.replace` navigates without adding `/` as a new browser history entry.

This means pressing Back from `/login` or `/dashboard` does not bounce the user
back to the splash screen.

```tsx
return () => window.clearTimeout(redirectTimer);
```

This cleanup cancels the timer if the component unmounts early.

It is a normal React safety pattern for timers.

```tsx
}, [router]);
```

The effect depends on `router`.

React uses the dependency array to know when the effect should rerun.

```tsx
return <SplashScreen />;
```

The root route always renders the splash immediately.

The redirect happens afterward in the effect.

The login route is functional.

The TRD utility files are functional.

The next major required step is the root splash route:

- Create or finish `src/components/shared/SplashScreen.tsx`.
- Render `data-testid="splash-screen"`.
- Update `src/app/page.tsx`.
- Show splash immediately.
- Wait between 800ms and 2000ms.
- Redirect based on `habit-tracker-session`.

After that, the signup flow needs real behavior:

- Read `habit-tracker-users`.
- Reject duplicate emails with `User already exists`.
- Create a user with `id`, `email`, `password`, `createdAt`.
- Store a session with `userId` and `email`.
- Redirect to `/dashboard`.

Then the dashboard habit flow needs real behavior:

- Load habits from `habit-tracker-habits`.
- Filter habits by active `session.userId`.
- Create a habit through `HabitForm`.
- Edit only `name` and `description`.
- Keep `frequency` as `"daily"`.
- Delete only after confirmation.
- Toggle today's completion through `toggleHabitCompletion`.
- Recalculate streak through `calculateCurrentStreak`.

Then tests and PWA work follow.
