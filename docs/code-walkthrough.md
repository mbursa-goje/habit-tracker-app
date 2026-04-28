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

## Current Remaining Work

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
