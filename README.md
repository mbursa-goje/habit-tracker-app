# Habit Tracker PWA

Habit Tracker is a local-first Progressive Web App built for the HNG Stage 3 TRD.
It lets a user sign up, log in, manage daily habits, complete or uncomplete
habits for today, view streaks, reload without losing saved state, and load the
cached app shell offline after the app has been opened once.

The implementation is intentionally front-end focused. There is no remote
database and no external auth service. Users, sessions, and habits are stored in
browser `localStorage` using the exact keys required by the TRD.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- localStorage persistence
- Vitest unit tests
- React Testing Library integration tests
- Playwright end-to-end tests
- Basic PWA manifest and service worker

## Setup

Install dependencies:

```bash
npm install
```

Install the Playwright browser once before running E2E tests:

```bash
npx playwright install chromium
```

## Run

Start the development server:

```bash
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

Available routes:

- `/` shows the splash screen, then redirects based on session state.
- `/login` renders the login form.
- `/signup` renders the signup form.
- `/dashboard` renders the protected habit dashboard.

Build for production:

```bash
npm run build
```

Run the production server after building:

```bash
npm run start
```

## Tests

Run unit tests with coverage:

```bash
npm run test:unit
```

Run integration/component tests:

```bash
npm run test:integration
```

Run Playwright end-to-end tests:

```bash
npm run test:e2e
```

Run all required test groups:

```bash
npm run test
```

The unit test coverage threshold is configured for files inside `src/lib`.

## Local Persistence

The app uses three TRD-required localStorage keys.

`habit-tracker-users` stores a JSON array of users:

```ts
type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};
```

`habit-tracker-session` stores either `null` or the active session:

```ts
type Session = {
  userId: string;
  email: string;
};
```

`habit-tracker-habits` stores a JSON array of habits:

```ts
type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[];
};
```

The dashboard filters habits by `session.userId`, so one user only sees their
own habits. Completion dates use `YYYY-MM-DD` strings and are toggled through
the shared `toggleHabitCompletion` helper.

## Dashboard UI Notes

The dashboard keeps the TRD test IDs in place while adding user-facing polish:

- The summary panel uses a blue progress ring, compact metric tiles, and a
  softened blue border. On narrow screens, the ring cell centers the circle and
  lets it grow to the available grid width so the 320px layout does not leave
  awkward trailing space beside the percentage. The ring label uses tighter
  tracking and inner padding so `Daily Goal` does not press against the circle
  on wider screens.
- Habit cards keep action areas responsive so edit, delete, completion, cancel,
  and confirmation controls do not become cramped on wider dashboard columns.
- Icon-only mobile create/logout controls expose hover/focus tooltips. Text
  buttons such as Add, New Habit, Create Habit, and Log Out rely on their
  visible labels instead of redundant tooltips.
- Add and edit actions scroll the habit form into view so the user can
  immediately see the form they just opened.
- Create/edit mode uses the full dashboard width on larger screens, and the
  habit form performance summary fills the remaining right-side space instead
  of leaving a short panel with unused space beside it. Its streak and
  completion content is centered inside the available height and scaled up on
  larger screens so the panel does not feel empty.
- Empty states, dashboard summary tiles, the habit form performance summary,
  and the Next Up rail card use centered or stretched layouts to avoid awkward
  trailing blank space on larger screens. The no-habits panel uses responsive
  top padding and a taller clamp height so the message sits naturally while the
  card occupies more of the available section.
- Developer-only helper copy such as the old Stage Scope card was removed from
  the visible product UI.

## PWA Support

PWA support is implemented with:

- `public/manifest.json` for install metadata.
- `public/icons/icon-192.png` and `public/icons/icon-512.png` for required
  manifest icons.
- `public/sw.js` for the service worker.
- `src/components/shared/ServiceWorkerRegistration.tsx` for client-side
  service worker registration.
- `src/app/layout.tsx` for global manifest metadata and registration mounting.

The service worker caches the app shell routes and successful GET responses.
After the app has loaded once online, the cached shell can render offline
without a hard crash.

## Test File Map

`tests/unit/slug.test.ts` verifies `getHabitSlug` formatting rules.

`tests/unit/validators.test.ts` verifies habit-name validation messages and
normalization.

`tests/unit/streaks.test.ts` verifies current streak calculation, duplicates,
missing days, and today-only current streak behavior.

`tests/unit/habits.test.ts` verifies completion toggling, duplicate prevention,
and immutability.

`tests/unit/storage.test.tsx` verifies the `useSyncExternalStore` localStorage
bridge and same-tab subscription behavior.

`tests/unit/auth.test.ts` verifies shared auth helpers, session shape guards,
stored user reads, and storage key constants.

`tests/integration/auth-flow.test.tsx` verifies signup, duplicate signup,
login, invalid login, session creation, and localStorage auth behavior.

`tests/integration/habit-form.test.tsx` verifies habit form validation, create,
edit preservation rules, delete confirmation, completion toggling, and streak
updates.

`tests/e2e/app.spec.ts` verifies the full browser flow: splash redirects,
dashboard protection, signup, login, user-scoped habit rendering, habit
creation, completion, reload persistence, logout, and offline app shell loading.

## Trade-Offs And Limitations

Passwords are stored in localStorage because the TRD requires deterministic
front-end-only authentication for this stage. This is not production-secure.

Only daily habits are supported. Weekly frequency, reminders, tags, colors, and
advanced analytics are visual or future-scope ideas unless added to the TRD.

The PWA service worker provides a basic cached app shell, not full background
sync or conflict resolution.

The app uses local browser state only. Clearing browser storage removes users,
session, and habits.

## Study Notes

For dense implementation notes, see:

```txt
docs/code-walkthrough.md
```
