# Habit Tracker Code Walkthrough

This file is a dense study guide for the current Habit Tracker codebase.

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

## Recent Dashboard UI Polish

Purpose: document the final user-facing dashboard polish that was added after
the core TRD behavior was already working.

The dashboard still keeps the required TRD behavior and test IDs.

The visual polish does not change localStorage shapes.

The visual polish does not change authentication behavior.

The visual polish does not rename required test IDs.

## Tailwind Utility Glossary Used In This Project

Purpose: explain the Tailwind utility classes that appear repeatedly in the
auth pages, dashboard, habit cards, and habit form.

Tailwind is a utility-first CSS system.

Instead of writing a separate CSS class like:

```css
.dashboard-card {
  display: grid;
  padding: 1.25rem;
}
```

the component writes small utility classes directly in `className`.

Example:

```tsx
className="grid gap-5 rounded-3xl border border-blue-100 bg-white p-5"
```

Each utility controls one CSS idea.

`grid` means `display: grid`.

`gap-5` creates spacing between grid children.

`rounded-3xl` creates a large border radius.

`border` enables a 1px border.

`border-blue-100` colors that border with a light blue.

`bg-white` sets the background color to white.

`p-5` adds padding on all sides.

### Responsive Prefixes: `sm`, `md`, `lg`, `xl`, `2xl`

Tailwind responsive prefixes apply a class only after a screen reaches a
breakpoint.

The app uses mobile-first styling.

That means the unprefixed class is the default for small screens.

Then prefixed classes progressively enhance the layout on wider screens.

Example:

```tsx
className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]"
```

`grid` enables CSS Grid.

`grid-cols-1` makes one column by default.

That is the mobile layout.

`xl:grid-cols-[minmax(0,1fr)_320px]` changes the grid only on `xl` screens and
above.

That is the desktop layout.

The first desktop column uses `minmax(0,1fr)`.

`1fr` means it receives the flexible remaining width.

`minmax(0,1fr)` prevents long content from forcing the column wider than the
available space.

The second desktop column uses `320px`.

That creates a fixed right rail for summary cards.

Example:

```tsx
className="p-5 sm:p-6"
```

`p-5` is the default padding.

`sm:p-6` increases padding from the `sm` breakpoint upward.

This is why cards can breathe more on larger screens without becoming cramped
on 320px screens.

Example:

```tsx
className="flex flex-col md:flex-row"
```

`flex` enables Flexbox.

`flex-col` stacks children vertically by default.

`md:flex-row` places children side by side on medium screens and above.

This pattern is used when a card should stack on mobile but behave like a row
on desktop.

### Grid Utilities

`grid` turns an element into a grid container.

Grid is best when the layout needs rows and columns.

The dashboard uses grid for page sections, metric tiles, and responsive card
groups.

`grid-cols-1` creates one equal-width column.

`grid-cols-2` creates two equal-width columns.

`sm:grid-cols-2` creates two columns only at the `sm` breakpoint and above.

`xl:grid-cols-3` creates three columns only at the `xl` breakpoint and above.

`gap-4`, `gap-5`, and `gap-6` set the spacing between grid items.

`place-items-center` centers children both horizontally and vertically.

It is shorthand for:

```css
align-items: center;
justify-items: center;
```

The progress ring uses this idea so the percentage sits in the middle of the
circle.

`col-span-2` makes a grid item span two columns.

`xl:col-span-2` makes that behavior happen only on extra-large screens.

The project uses this when a main dashboard card should be wider than the
neighboring side card.

### Flex Utilities

`flex` turns an element into a flex container.

Flexbox is best when items need to sit in a row or column and align around one
axis.

`flex-col` stacks children vertically.

`flex-row` places children horizontally.

`items-center` aligns children vertically in a row layout.

When the flex direction is column, `items-center` aligns children horizontally.

`justify-center` centers children along the main axis.

In a row, that means horizontal centering.

In a column, that means vertical centering.

`justify-between` pushes the first child to one side and the last child to the
opposite side.

The habit card top row uses this so the title sits left and the edit/delete
buttons sit right.

`flex-1` tells an item to occupy remaining available space.

The project uses `flex-1` when a card or column should fill leftover height or
width instead of leaving awkward empty space.

`shrink-0` prevents an item from becoming smaller when the container is tight.

This protects icon buttons, avatars, and fixed-width controls from being
squeezed.

`min-w-0` allows a flex child to shrink properly instead of overflowing because
of long text.

It is especially useful around habit names and descriptions.

### Background Utilities And Gradients

`bg-white` sets a white background.

`bg-blue-50` sets a very light blue background.

`bg-blue-600` sets a strong blue background.

`bg-slate-50` sets a very light slate background.

The app uses slate colors for calm neutral surfaces and blue colors for primary
actions.

Arbitrary hex colors use square brackets.

Example:

```tsx
className="bg-[#f0f4ff]"
```

`bg-[#f0f4ff]` creates an exact custom background color.

Square brackets tell Tailwind to generate a class for a custom CSS value.

The same square-bracket pattern appears in shadows, radii, widths, heights, and
grid templates.

Example:

```tsx
className="bg-gradient-to-br from-blue-700 via-blue-700 to-blue-900"
```

`bg-gradient-to-br` creates a gradient that moves toward the bottom-right.

`from-blue-700` is the starting color.

`via-blue-700` is the middle color.

`to-blue-900` is the ending color.

The auth and dashboard surfaces use gradient-style thinking to make large blue
areas feel intentional instead of flat.

Example:

```tsx
className="bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_38%)]"
```

`bg-[...]` passes a custom `background-image` value to Tailwind.

`radial-gradient(...)` creates a soft glow.

`circle_at_top_left` positions the glow near the top-left.

`rgba(37,99,235,0.12)` creates a transparent blue.

`transparent_38%` fades the gradient out by 38%.

Tailwind arbitrary values use underscores where normal CSS would use spaces.

Tailwind converts those underscores back into spaces when generating CSS.

### Spacing Utilities

`p-4`, `p-5`, `p-6`, and `p-7` set padding on all sides.

Padding is internal space.

It keeps content away from the edges of a card.

`px-4` sets horizontal padding.

`py-3` sets vertical padding.

`mt-4` sets margin-top.

`mb-6` sets margin-bottom.

`mx-auto` sets left and right margins to auto.

That centers fixed-width blocks.

`space-y-6` adds vertical spacing between direct children.

The auth forms use this to keep input groups evenly separated.

`gap-3` and `gap-4` are preferred inside grid and flex containers.

`gap` is usually cleaner than adding margin to every child.

### Sizing Utilities

`w-full` means width is 100% of the parent.

`h-full` means height is 100% of the parent.

`min-h-screen` means minimum height is the full viewport height.

The auth pages use `min-h-screen` so the split card can center vertically.

`min-h-20` gives an element a minimum height from Tailwind's spacing scale.

`min-h-[clamp(260px,42vh,420px)]` uses a custom CSS clamp value.

`clamp(min, preferred, max)` means:

- never smaller than `260px`
- prefer `42vh`
- never larger than `420px`

This keeps the empty-state card tall enough to occupy the section without
creating a tiny card followed by a large trailing blank band.

`max-w-sm`, `max-w-[1000px]`, and similar classes cap how wide content can get.

Max-width prevents forms from becoming too stretched on desktop.

### Typography Utilities

`text-sm`, `text-lg`, `text-2xl`, and `text-3xl` control font size.

`text-[11px]` uses an exact custom font size.

Exact sizes are useful for small labels and dashboard metadata.

`font-medium`, `font-semibold`, `font-bold`, and `font-black` control font
weight.

`font-black` is heavier than `font-bold`.

The app uses heavier weights for metrics and section labels.

`uppercase` transforms text into uppercase letters.

`tracking-wider`, `tracking-widest`, and `tracking-[0.2em]` control letter
spacing.

This is the Tailwind class for what people often call "tracking".

If you see "tracing" in notes, that usually means `tracking`.

`tracking-[0.2em]` is an arbitrary letter-spacing value.

It creates a technical dashboard label style.

`leading-none` makes line-height tight.

`leading-relaxed` makes line-height more open.

The app uses relaxed line-height for readable paragraphs and tighter line-height
for compact metric labels.

### Border, Radius, And Shadow Utilities

`border` adds a default 1px border.

`border-blue-100` colors the border light blue.

`border-slate-100` colors the border light slate.

`border-dashed` changes the border style to dashed.

The empty state uses dashed borders to feel like a drop zone or placeholder.

`rounded-lg`, `rounded-2xl`, `rounded-3xl`, and `rounded-full` control corner
rounding.

`rounded-full` makes pills, circles, and avatar shapes.

`rounded-[28px]` uses an exact custom radius.

This is useful when matching a generated UI design that uses a specific large
radius.

`shadow-sm`, `shadow-lg`, and custom `shadow-[...]` utilities control box
shadow.

Example:

```tsx
className="shadow-[0_16px_45px_rgba(37,99,235,0.08)]"
```

The first value is horizontal offset.

The second value is vertical offset.

The third value is blur radius.

The `rgba(...)` value defines the shadow color and opacity.

The app uses soft blue shadows to make cards feel lifted without becoming dark.

### Positioning And Layering Utilities

`relative` makes an element the positioning context for children.

`absolute` positions a child relative to the nearest positioned ancestor.

The tooltip wrapper uses `relative`.

The tooltip bubble uses `absolute`.

That is how the tooltip can sit above the button.

`fixed` positions an element relative to the viewport.

The mobile floating create and logout controls use fixed positioning.

`bottom-6` places a fixed element near the bottom.

`right-6` places it near the right edge.

`z-30` controls stacking order.

A higher z-index helps overlays appear above cards.

### State And Interaction Variants

`hover:bg-blue-800` changes background color on mouse hover.

`hover:text-slate-700` changes text color on hover.

`focus:outline-none` removes the browser's default outline.

This should only be used when another visible focus style is added.

The app pairs it with:

```tsx
focus:ring-2 focus:ring-blue-500
```

`focus:ring-2` adds a visible focus ring.

`focus:ring-blue-500` makes the ring blue.

This keeps keyboard navigation visible and accessible.

`transition` enables smooth changes between normal, hover, and focus states.

`duration-150` or `duration-300` controls how long the transition takes.

`group` marks a parent as a hover/focus coordination group.

`group-hover:opacity-100` changes a child when the parent is hovered.

`group-focus-within:opacity-100` changes a child when any focusable element
inside the parent receives focus.

The tooltip system relies on these group variants.

### Why Some Tailwind Classes Look Unusual

Classes with square brackets are arbitrary-value utilities.

They are still Tailwind classes.

They simply express values that are not part of the default Tailwind scale.

Examples from this project:

```tsx
rounded-[28px]
shadow-[0_16px_45px_rgba(37,99,235,0.08)]
min-h-[clamp(260px,42vh,420px)]
grid-cols-[minmax(0,1fr)_320px]
tracking-[0.2em]
```

These are used when the design needs exact spacing, exact shadows, exact grid
columns, or exact letter spacing.

Use them intentionally.

For normal spacing and colors, prefer standard Tailwind utilities like `p-5`,
`gap-4`, `bg-blue-600`, and `text-slate-500`.

### Dashboard Tooltips

The dashboard now includes a small `DashboardTooltip` helper in:

```txt
src/app/dashboard/page.tsx
```

The helper receives `children`.

`children` is the tooltip text.

The helper also receives an optional `className`.

`className` lets each tooltip choose its position.

The default position places the tooltip above the control.

The tooltip element uses:

```tsx
role="tooltip"
```

This gives the element a clear accessibility role.

The tooltip uses:

```tsx
pointer-events-none
```

This prevents the tooltip itself from stealing mouse hover.

The tooltip uses:

```tsx
absolute z-30
```

`absolute` lets the tooltip position relative to the nearest `relative`
wrapper.

`z-30` keeps it above nearby cards and panels.

The tooltip uses:

```tsx
opacity-0
```

This keeps it hidden by default.

The tooltip uses:

```tsx
group-hover:opacity-100
group-focus-within:opacity-100
```

`group-hover` shows the tooltip when the wrapper is hovered.

`group-focus-within` shows the tooltip when the button receives keyboard focus.

That means mouse users and keyboard users both get the same hint.

Tooltips were kept only on icon-only mobile dashboard controls:

- Mobile floating create button.
- Mobile floating logout button.

The desktop sidebar Add action has visible text.

The header New Habit action has visible text.

The empty-state Create Habit action has visible text.

The sidebar Log Out action has visible text.

Those text actions do not need tooltips because the label is already visible.

That keeps tooltips reserved for places where the control is icon-only and the
meaning is not visible on the screen.

The required `data-testid="create-habit-button"` remains on the header create
button.

The required `data-testid="auth-logout-button"` remains on the sidebar logout
button.

### Add And Edit Scroll Behavior

The dashboard now scrolls the habit form into view when the user opens it.

This applies to create actions.

This also applies to edit actions.

The goal is simple: if the user clicks Add or Edit from lower on the dashboard,
the page should bring them back to the form instead of leaving them below it.

This is a scrollbar behavior.

It uses the browser's normal scrolling API.

The implementation lives in:

```txt
src/app/dashboard/page.tsx
```

The dashboard imports:

```tsx
useRef
```

`useRef` creates a persistent reference object.

The reference survives renders.

Changing the reference does not cause a rerender.

That makes it useful for pointing at a DOM element.

The dashboard creates:

```tsx
const habitFormRegionRef = useRef<HTMLDivElement | null>(null);
```

`habitFormRegionRef` is the reference object.

`HTMLDivElement` tells TypeScript the ref will point at a `div`.

`null` is allowed because the form is not always rendered.

When `isFormOpen` is false, the form wrapper does not exist.

When `isFormOpen` is true, React attaches the `div` node to
`habitFormRegionRef.current`.

The form wrapper uses:

```tsx
<div ref={habitFormRegionRef} className="scroll-mt-6">
```

`ref={habitFormRegionRef}` connects the rendered `div` to the React ref.

`scroll-mt-6` adds scroll margin at the top.

That means the form does not land hard against the top edge of the viewport.

The dashboard defines:

```tsx
function scrollHabitFormIntoView() {
```

This helper centralizes the scrolling behavior.

Both create and edit can call the same helper.

Inside it, the code calls:

```tsx
window.requestAnimationFrame(() => {
```

`requestAnimationFrame` waits until the browser is ready for the next paint.

That matters because clicking Add or Edit first changes React state.

React needs a moment to render the form into the DOM.

Waiting for the next frame gives the ref a chance to point at the newly
rendered form wrapper.

Then the code calls:

```tsx
habitFormRegionRef.current?.scrollIntoView({
  behavior: "smooth",
  block: "start",
});
```

`habitFormRegionRef.current` is the actual DOM element.

The `?.` optional chaining prevents a crash if the ref is still null.

`scrollIntoView` asks the browser to scroll until that element is visible.

`behavior: "smooth"` makes the movement easier to follow.

`block: "start"` aligns the form near the top of the viewport.

The Add flow uses:

```tsx
function openCreateForm() {
  setEditingHabit(null);
  setIsFormOpen(true);
  scrollHabitFormIntoView();
}
```

`setEditingHabit(null)` clears edit mode.

That tells the form it is creating a new habit.

`setIsFormOpen(true)` renders the form.

`scrollHabitFormIntoView()` moves the page to the form.

The Edit flow uses:

```tsx
function openEditForm(habit: Habit) {
  setEditingHabit(habit);
  setIsFormOpen(true);
  scrollHabitFormIntoView();
}
```

`setEditingHabit(habit)` stores the selected habit.

That selected habit is passed into `HabitForm`.

`setIsFormOpen(true)` ensures the form is visible.

`scrollHabitFormIntoView()` moves the user to the edit form.

This does not change the TRD storage contract.

This does not change create, edit, delete, or completion behavior.

This is only an ergonomic improvement so users can see the form immediately.

### Full-Width Form Mode

The dashboard now changes layout when the habit form is open.

This applies to create mode.

This also applies to edit mode.

The goal is to avoid a narrow form area on larger screens.

When the form is closed, the dashboard uses the normal dashboard layout:

```tsx
xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]
```

That creates a main content column and a right rail.

The right rail contains dashboard-level cards such as Daily Insight, Weekly
Consistency, and Next Up.

When the form is open, the dashboard does not apply that `xl` two-column class.

The section stays:

```tsx
grid grid-cols-1 gap-5
```

That makes the form area occupy the full available dashboard width.

The right rail also receives:

```tsx
xl:hidden
```

while the form is open.

That prevents dashboard-level cards from competing with the create/edit form
for horizontal space.

The form itself already has its own performance summary panel.

That means the user still sees habit-specific performance context while
creating or editing.

The `HabitForm` root grid now uses:

```tsx
xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]
```

`xl:grid-cols-[...]` activates the two-column form layout on large screens.

`minmax(0,1fr)` gives the form fields the flexible main column.

`minmax(320px,420px)` gives the performance summary a useful right column.

The summary column can grow up to `420px`.

The summary column does not stay as a short, isolated panel in the left side of
the dashboard.

This layout uses available desktop width more intentionally.

It also keeps mobile simple because the base layout is still one column.

### Empty And Right Rail Space Management

The dashboard also manages vertical empty space on larger screens.

The empty state uses:

```tsx
flex min-h-[clamp(260px,42vh,420px)] flex-col items-center justify-start
```

`flex` creates a flexible container.

`flex-col` stacks the title, helper text, and button vertically.

`items-center` centers the content horizontally.

`justify-start` places the content from the top side of the card instead of
forcing mathematical vertical centering.

The card then uses:

```tsx
pt-[clamp(56px,8vh,96px)]
```

`pt-[clamp(...)]` adds responsive top padding.

This gives the empty-state content a better visual center while still letting
the card occupy more of the available section.

`min-h-[clamp(260px,42vh,420px)]` gives the empty state a responsive minimum
height.

`clamp(...)` means the height has a lower bound, a preferred viewport-relative
size, and an upper bound.

`260px` is the smallest allowed height.

`42vh` lets the panel grow with the viewport.

`420px` prevents the panel from becoming overly tall.

This avoids a tiny empty-state card followed by a large blank band.

The dashboard right rail uses:

```tsx
flex h-full flex-col gap-5
```

`flex` turns the right rail into a vertical flex container.

`h-full` lets it stretch to the height of the grid row.

`flex-col` stacks Daily Insight, Weekly Consistency, and Next Up.

`gap-5` preserves the spacing between rail cards.

The Next Up card uses:

```tsx
flex min-h-36 flex-1 flex-col justify-center
```

`flex-1` lets it occupy remaining vertical space in the right rail.

`min-h-36` keeps it from becoming too short.

`justify-center` centers its content vertically inside the stretched card.

This reduces the trailing space below Next Up when the left habit content is
taller than the right rail cards.

The dashboard summary metric tiles use:

```tsx
flex min-h-24 w-full flex-col items-center justify-center text-center
```

`min-h-24` gives each metric tile enough vertical room on narrow screens.

`w-full` makes each tile occupy the full width of its grid cell.

`items-center` centers the label/value stack horizontally.

`justify-center` centers the label/value stack vertically.

`text-center` centers the text itself.

This keeps Completed, Active, and Best Streak visually balanced beside the
progress ring.

The habit form performance summary uses:

```tsx
aside className="h-full"
section className="flex h-full flex-col ..."
```

`h-full` lets the summary column match the form column height.

The section itself fills that column.

That removes the short-card effect where the performance summary ended early
and left a blank right-side area in create/edit mode.

Inside the summary section, the performance content uses:

```tsx
flex flex-1 flex-col justify-center gap-8 py-8
```

`flex-1` lets the content area occupy the remaining height below the
`Performance Summary` heading.

`flex-col` stacks the streak block and completion block vertically.

`justify-center` centers those blocks inside the available height.

`gap-8` creates stronger vertical rhythm between the streak block and the
completion meter.

`py-8` adds top and bottom breathing room so the centered content does not touch
the panel edges.

The streak tile uses larger icon and text sizes on large screens.

The completion bar uses a taller `h-3` track.

Those size changes make the summary feel intentional in a tall desktop column
instead of looking like small content stuck at the top of an empty panel.

### Dashboard Summary Ring

The dashboard progress ring was enlarged because the first version felt tight.

The outer ring now uses:

```tsx
aspect-square w-full max-w-28
```

`aspect-square` keeps the ring perfectly circular.

`w-full` lets the ring grow to the available width of its grid cell.

`max-w-28` prevents the ring from becoming too large.

The ring wrapper uses:

```tsx
justify-center
```

This centers the ring inside its mobile grid cell.

That removes the trailing side space that appeared beside the percentage on
small screens around 320px wide.

The inner white circle fills the remaining space.

The inner white circle also uses:

```tsx
px-2
```

`px-2` adds horizontal padding inside the circle.

That gives the `Daily Goal` label breathing room.

The label uses:

```tsx
text-[8px] tracking-[0.14em] sm:text-[9px]
```

`text-[8px]` keeps the label compact on the smallest screens.

`sm:text-[9px]` lets it become slightly larger when more width is available.

`tracking-[0.14em]` keeps the premium spaced-label look without stretching the
words so far that they press against the ring.

The percentage uses a stronger text size.

The `Daily Goal` label has a small top margin and tighter line height.

This keeps the ring readable without changing the progress calculation.

The progress calculation still uses:

```tsx
doneTodayCount / activeCount
```

The visual ring still uses:

```tsx
conic-gradient(...)
```

The UI changed.

The data model did not.

### Habit Card Spacing

The habit card action area was adjusted because the horizontal layout became
too cramped inside the dashboard grid.

The edit and delete buttons now use fixed icon hit areas.

That keeps the pencil and trash icons visible.

The habit title and description use `min-w-0` and wrapping classes.

That lets long user-entered text wrap instead of pushing buttons out of shape.

The completion button uses a minimum height and a full-width layout until very
wide screens.

That keeps `Complete` and `Completed` readable.

The habit list now waits until the `2xl` breakpoint before splitting into two
columns.

This matters on Nest Hub Max style widths.

At that size, the dashboard already has a right rail.

If the habit list also split into two columns at `xl`, each card became too
narrow.

The card then looked cramped even though the button itself was technically
working.

`HabitList` therefore uses:

```tsx
grid grid-cols-1 gap-5 2xl:grid-cols-2
```

`grid` creates the card layout.

`grid-cols-1` keeps one full-width habit card by default.

`gap-5` keeps consistent space between habit cards.

`2xl:grid-cols-2` allows two columns only on very wide screens.

That gives each habit card enough horizontal room on medium-large dashboards.

Inside `HabitCard`, the Daily Discipline row uses:

```tsx
flex flex-col gap-5 md:flex-row md:items-center md:justify-between
```

`flex` creates a flexible row/column container.

`flex-col` stacks the discipline text and Complete button on small screens.

`gap-5` keeps space between the stacked pieces.

`md:flex-row` changes the layout back to a row once there is enough width.

That places the Complete button beside the Daily Discipline text.

`md:items-center` vertically aligns the text block and button.

`md:justify-between` pushes the text block to the left and the Complete button
to the right.

The text block uses:

```tsx
flex min-w-0 flex-1 items-center gap-4
```

`flex-1` lets the text side occupy the remaining width.

`min-w-0` allows long descriptions to wrap instead of forcing overflow.

The Complete button uses:

```tsx
w-full md:w-auto md:min-w-48
```

`w-full` makes the button easy to tap on small screens.

`md:w-auto` lets the button shrink to its content on wider screens.

`md:min-w-48` keeps the button wide enough for icon and label.

This combination keeps mobile stacked and desktop aligned.

The delete confirmation controls use a grid on smaller widths.

That prevents `Cancel` and `Confirm Delete` from colliding.

All required habit card test IDs remain unchanged:

- `habit-card-{slug}`
- `habit-streak-{slug}`
- `habit-complete-{slug}`
- `habit-edit-{slug}`
- `habit-delete-{slug}`
- `confirm-delete-button`

### Habit Form Action Spacing

The habit form action buttons were adjusted because the save and discard
buttons were too narrow on wider dashboard columns.

The action row now uses flex wrapping.

Each action button has a minimum width.

Each action button can flex to share available space.

The icon inside each button uses `shrink-0`.

That keeps the save, discard, and trash icons visible.

The button labels use `whitespace-nowrap`.

That prevents labels like `Save Changes` from splitting awkwardly.

The layout can wrap to a new line when space is limited.

That is better than compressing icons and text into an unreadable button.

The required `data-testid="habit-save-button"` remains unchanged.

### Removed Developer-Facing Panel

The visible `Stage Scope` card was removed from the habit form sidebar.

It contained implementation labels such as:

- `Daily Only`
- `Local Storage`
- `TRD Safe`

Those ideas are still true technically.

They belong in documentation, not in the user-facing dashboard.

The dashboard now focuses on habit performance and direct actions.

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

## Next.js From Scratch For This Project

Purpose: explain the Next.js pieces used by this app from first principles.

This section is based on the local Next.js documentation inside:

```txt
node_modules/next/dist/docs/
```

The most relevant local docs for this project are:

- `01-app/01-getting-started/02-project-structure.md`
- `01-app/01-getting-started/03-layouts-and-pages.md`
- `01-app/01-getting-started/04-linking-and-navigating.md`
- `01-app/01-getting-started/05-server-and-client-components.md`
- `01-app/01-getting-started/14-metadata-and-og-images.md`
- `01-app/03-api-reference/04-functions/use-router.md`

### What Next.js Is Doing Here

Next.js is the application framework.

React is the UI library.

TypeScript is the type-checking layer.

Tailwind CSS is the utility-class styling layer.

Next.js connects those pieces into a web application with:

- file-based routing
- server rendering
- client hydration
- build tooling
- static asset serving
- metadata handling
- development server
- production build output

In this project, Next.js is not being used for a backend database.

In this project, Next.js is not being used for remote authentication.

The TRD says persistence must stay local and deterministic.

That is why the app stores users, sessions, and habits in `localStorage`.

### File-Based Routing

Next.js App Router uses file-system routing.

File-system routing means folders and files create URLs.

You do not create a central route table manually.

You do not write something like:

```ts
routes["/login"] = LoginPage;
```

Instead, Next.js reads the folder structure under `src/app`.

The special file name `page.tsx` makes a route public.

The folder path around `page.tsx` becomes the URL.

In this project:

```txt
src/app/page.tsx
```

maps to:

```txt
/
```

This is the root route.

```txt
src/app/login/page.tsx
```

maps to:

```txt
/login
```

```txt
src/app/signup/page.tsx
```

maps to:

```txt
/signup
```

```txt
src/app/dashboard/page.tsx
```

maps to:

```txt
/dashboard
```

That is page routing.

Page routing is the process of matching the browser URL to a route segment and
rendering the `page.tsx` file for that segment.

If the user enters `http://localhost:3000/login`, Next.js looks for:

```txt
src/app/login/page.tsx
```

If the user enters `http://localhost:3000/dashboard`, Next.js looks for:

```txt
src/app/dashboard/page.tsx
```

The route is public only because a `page.tsx` file exists in that folder.

A folder without `page.tsx` can organize files but does not automatically
become a public page.

### Route Segments

The local Next docs describe routes as segments.

A segment is one part of a URL.

For `/dashboard`, the segment is:

```txt
dashboard
```

For `/login`, the segment is:

```txt
login
```

For `/`, there is no child segment.

It is the root segment.

This app currently has simple static segments.

It does not currently use dynamic segments like:

```txt
src/app/habits/[slug]/page.tsx
```

A dynamic segment uses square brackets.

That would match URLs such as:

```txt
/habits/drink-water
```

We discussed that idea earlier for habit detail pages, but the current TRD
implementation keeps habit create, edit, delete, and complete behavior on the
dashboard.

### Layouts

Next.js uses `layout.tsx` for UI shared by routes.

This project has:

```txt
src/app/layout.tsx
```

That file is the root layout.

The root layout is required in the App Router.

The root layout must return:

```tsx
<html>
  <body>{children}</body>
</html>
```

`children` means "the active route page goes here."

When the user visits `/login`, `children` is the login page.

When the user visits `/signup`, `children` is the signup page.

When the user visits `/dashboard`, `children` is the dashboard page.

This project's layout also imports global CSS.

It also exports metadata.

It also renders `ServiceWorkerRegistration`.

Those things belong in the root layout because they apply across the whole app.

### Pages

A page is route-specific UI.

The local Next docs define a page as UI rendered on a specific route.

Every route page must default export a React component.

This project's pages are:

- `src/app/page.tsx`
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/dashboard/page.tsx`

Each page owns its route-level responsibility.

The root page owns the boot splash and redirect decision.

The login page owns the login screen layout.

The signup page owns the signup screen layout.

The dashboard page owns protected habit management.

### Server Components

In the App Router, pages and layouts are Server Components by default.

Server Components run on the server side of the framework.

Server Components can reduce client JavaScript.

Server Components can fetch server data without exposing secrets to the
browser.

Server Components cannot use browser-only APIs.

Server Components cannot use `localStorage`.

Server Components cannot use `window`.

Server Components cannot use `navigator`.

Server Components cannot use React state hooks like `useState`.

Server Components cannot attach event handlers like `onClick`.

This app is localStorage-heavy.

That means several files must be Client Components.

### Client Components

Client Components run in the browser after hydration.

The local Next docs say to use Client Components when you need:

- state
- event handlers
- lifecycle effects
- browser APIs
- custom hooks

Client Components are marked with:

```tsx
"use client";
```

This directive must be at the top of the file before imports.

Once a file is marked `"use client"`, that file and its imports become part of
the client bundle.

That is why we should not mark everything as client by habit.

We mark a file as client only when it needs client behavior.

### Client Components In This Project

`src/app/page.tsx` is a Client Component.

It uses `useEffect`.

It uses `useRouter`.

It reads localStorage through the storage helper.

It waits 1200ms, then redirects to `/dashboard` or `/login`.

`src/app/login/page.tsx` is a Client Component.

It renders interactive login UI.

It imports `LoginForm`, which uses state and localStorage.

`src/app/signup/page.tsx` is a Client Component.

It renders interactive signup UI.

It imports `SignupForm`, which uses state and localStorage.

`src/app/dashboard/page.tsx` is a Client Component.

It reads session and habit data from localStorage.

It opens and closes forms.

It creates, edits, deletes, and toggles habits.

It logs the user out.

All of that requires browser-side interactivity.

`src/components/auth/LoginForm.tsx` is a Client Component.

It tracks form input with `useState`.

It handles submit events.

It reads users from localStorage.

It writes the session to localStorage.

`src/components/auth/SignupForm.tsx` is a Client Component.

It tracks signup form fields.

It checks duplicate emails.

It writes users and session data.

`src/components/habits/HabitForm.tsx` is a Client Component.

It tracks habit form state.

It validates the name before saving.

It reacts when the parent switches between create and edit mode.

`src/components/habits/HabitCard.tsx` is a Client Component.

It holds temporary delete-confirmation state.

It exposes edit, delete, and completion buttons.

`src/components/shared/ServiceWorkerRegistration.tsx` is a Client Component.

It uses the browser `navigator.serviceWorker` API.

`src/lib/storage.ts` is marked `"use client"`.

It uses `window`, `localStorage`, `CustomEvent`, and React's
`useSyncExternalStore`.

### Server Components In This Project

`src/app/layout.tsx` is a Server Component by default.

It does not have `"use client"`.

That is correct.

It exports metadata.

Next metadata exports belong in Server Components.

It renders the client `ServiceWorkerRegistration` component as a child.

That is allowed.

A Server Component can render a Client Component.

The boundary starts at the Client Component.

### Hydration

Hydration is React attaching interactivity to HTML that was already rendered.

Next can send initial HTML to the browser.

That HTML appears before React event handlers are active.

Then the browser downloads JavaScript.

React hydrates the page.

After hydration, buttons, input handlers, effects, and client state work.

Hydration matters in this project because localStorage only exists in the
browser.

The server cannot read localStorage.

So a route like `/dashboard` can initially render before the client has read
the stored session.

That is why dashboard has a hydration gate:

```tsx
const [hasCheckedClientStorage, setHasCheckedClientStorage] = useState(false);
```

The gate prevents a false redirect to `/login` before the client snapshot is
ready.

### Navigation

Next.js supports client-side navigation.

Client-side navigation means changing routes without doing a full page reload.

The preferred component for ordinary navigation is:

```tsx
import Link from "next/link";
```

This project uses `Link` in:

- `LoginForm`
- `SignupForm`

The login form has a link to signup.

The signup form has a link to login.

`Link` lets Next prefetch and transition routes efficiently.

For programmatic navigation, Next provides:

```tsx
import { useRouter } from "next/navigation";
```

This project uses `useRouter` in:

```txt
src/app/page.tsx
```

The root route needs a delayed redirect after the splash screen.

That is a specific requirement where programmatic navigation makes sense.

The root page uses:

```tsx
router.replace(...)
```

`replace` changes the URL without adding the splash page to browser history.

That means Back does not send the user back into the splash redirect loop.

Some auth flows use:

```tsx
window.location.href = "/dashboard";
```

That is a full browser navigation.

It is simple and deterministic for localStorage auth.

The tests use an optional redirect callback to observe that redirect without
forcing jsdom to navigate.

### Metadata

Next metadata is configured in:

```txt
src/app/layout.tsx
```

The app exports:

```tsx
export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track daily habits with local-first progress persistence.",
  manifest: "/manifest.json",
};
```

`title` controls the document title.

`description` controls the page description metadata.

`manifest` links the PWA manifest.

The local Next docs say metadata exports are supported from Server Components.

That is why the root layout remains a Server Component.

### Static Assets

Next serves files in:

```txt
public/
```

from the site root.

This project uses:

```txt
public/manifest.json
```

which is served as:

```txt
/manifest.json
```

This project uses:

```txt
public/sw.js
```

which is served as:

```txt
/sw.js
```

This project uses:

```txt
public/icons/icon-192.png
public/icons/icon-512.png
```

which are served as:

```txt
/icons/icon-192.png
/icons/icon-512.png
```

### `next.config.ts`

Purpose: configure Next.js itself.

```ts
import type { NextConfig } from "next";
```

This imports the TypeScript type for the config object.

```ts
import path from "node:path";
```

This imports Node's path helper.

```ts
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
};
```

`nextConfig` is the configuration object.

`turbopack.root` tells Turbopack the exact project root.

This matters because the environment had another lockfile above the project.

Without an explicit root, Next/Turbopack could infer the wrong workspace root.

That caused it to look outside the project folder.

The explicit root keeps the compiler focused on:

```txt
C:\Users\HP\Desktop\habit-tracker-app
```

```ts
export default nextConfig;
```

This exports the config so Next can read it.

### `tsconfig.json`

Purpose: configure TypeScript for the app.

Important settings for this project:

```json
"strict": true
```

This enables stricter type checking.

It helps catch shape mismatches with TRD types.

```json
"jsx": "react-jsx"
```

This configures JSX transform behavior for React.

```json
"moduleResolution": "bundler"
```

This aligns module resolution with modern bundler behavior.

```json
"paths": {
  "@/*": ["./src/*"]
}
```

This creates the `@` import alias.

So this:

```ts
import type { Habit } from "@/types/habit";
```

means:

```txt
src/types/habit
```

This keeps imports shorter and avoids fragile `../../../` paths in app code.

### `src/app/globals.css`

Purpose: load global styles.

```css
@import "tailwindcss";
```

This loads Tailwind CSS.

Without this line, Tailwind utility classes would not apply.

Earlier, missing Tailwind import caused styles like blue backgrounds and sizing
utilities to appear broken.

```css
@layer base {
  html {
    font-family: "Google Sans", sans-serif;
  }
}
```

This sets a global base font family.

It affects every route because `globals.css` is imported in the root layout.

### React Hook: `useState`

`useState` stores component-local state.

State is data that affects rendering and can change over time.

The shape is:

```tsx
const [value, setValue] = useState(initialValue);
```

`value` is the current state.

`setValue` updates the state.

Calling `setValue` tells React to rerender the component.

In `LoginForm`, `useState` stores:

- `email`
- `password`
- `rememberMe`
- `error`

When the user types in the email input, `setEmail(...)` updates state.

React rerenders the input with the latest value.

In `SignupForm`, `useState` stores:

- `email`
- `password`
- `error`

In `HabitForm`, `useState` stores:

- `name`
- `description`
- `error`

In `HabitCard`, `useState` stores:

- `isConfirmingDelete`

That state is intentionally temporary.

It controls whether the confirmation panel is visible.

It is not saved to localStorage.

In `Dashboard`, `useState` stores:

- `hasCheckedClientStorage`
- `isFormOpen`
- `editingHabit`

`hasCheckedClientStorage` prevents premature auth redirects during hydration.

`isFormOpen` controls whether the habit form appears.

`editingHabit` decides whether the form is in create mode or edit mode.

### React Hook: `useEffect`

`useEffect` runs side effects after render.

A side effect is work that touches something outside the render calculation.

Examples:

- timers
- browser APIs
- subscriptions
- redirects
- service worker registration
- syncing local component state from props

The shape is:

```tsx
useEffect(() => {
  // side effect
  return () => {
    // optional cleanup
  };
}, [dependencies]);
```

The dependency array controls when the effect reruns.

An empty array means the effect runs once after mount.

In `src/app/page.tsx`, `useEffect` starts a timer.

The timer keeps the splash screen visible for 1200ms.

After the timer, the effect checks session storage and redirects.

The cleanup clears the timer if the page unmounts early.

In `Dashboard`, one `useEffect` sets:

```tsx
setHasCheckedClientStorage(true);
```

That marks that the first client-side storage check has happened.

Another dashboard `useEffect` handles auth protection.

It redirects to `/login` when there is no valid session after the storage check.

In `HabitForm`, `useEffect` responds when the `habit` prop changes.

If the user switches from editing one habit to editing another, the form fields
need to update.

That effect resets:

- `name`
- `description`
- `error`

In `ServiceWorkerRegistration`, `useEffect` registers `/sw.js`.

It waits until the component is mounted in the browser.

That is necessary because `navigator.serviceWorker` does not exist on the
server.

### React Hook: `useMemo`

`useMemo` memoizes a calculated value.

Memoization means React can reuse a previous calculation until dependencies
change.

The shape is:

```tsx
const value = useMemo(() => calculateValue(), [dependencies]);
```

In `Dashboard`, `useMemo` calculates:

```tsx
const userHabits = useMemo(
  () => habits.filter((habit) => habit.userId === session?.userId),
  [habits, session?.userId],
);
```

This filters all stored habits down to the active user's habits.

The calculation reruns only when:

- the full `habits` array changes
- the active `session.userId` changes

This is a good fit because user-specific filtering is a derived value.

It should not be stored separately.

It should be calculated from source-of-truth storage.

In `src/lib/storage.ts`, `useMemo` parses the localStorage snapshot:

```tsx
return useMemo(
  () => parseSnapshot(snapshot, fallback),
  [fallback, snapshot],
);
```

This avoids reparsing JSON unless the stored string or fallback changes.

### React Hook: `useSyncExternalStore`

`useSyncExternalStore` connects React to state that lives outside React.

localStorage is outside React.

React does not automatically know when localStorage changes.

That is why this project uses `useSyncExternalStore` in:

```txt
src/lib/storage.ts
```

The shape is:

```tsx
const snapshot = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot,
);
```

`subscribe` tells React how to listen for changes.

`getSnapshot` tells React how to read the current client value.

`getServerSnapshot` tells React what value to use during server rendering.

This project uses:

```tsx
(onStoreChange) => subscribeToLocalStorageKey(key, onStoreChange)
```

That subscribes to one storage key.

It listens to the browser `storage` event.

It also listens to the custom same-tab event.

The browser `storage` event is mainly for other tabs.

Same-tab writes do not reliably trigger `storage`.

So `setLocalStorageValue` dispatches:

```ts
new CustomEvent("habit-tracker-storage", { detail: { key } })
```

That lets components in the same tab update immediately.

`getSnapshotForKey(key)` reads:

```ts
window.localStorage.getItem(key)
```

That gives React the raw stored string.

`parseSnapshot` converts that string into typed JSON data.

This design makes localStorage feel like reactive state while still keeping the
TRD-required persistence layer.

### Next Hook: `useRouter`

`useRouter` comes from:

```tsx
import { useRouter } from "next/navigation";
```

The local Next docs say App Router projects should import it from
`next/navigation`, not `next/router`.

`useRouter` is only for Client Components.

It lets code change routes programmatically.

This project uses it in:

```txt
src/app/page.tsx
```

The root route needs to:

1. show splash immediately
2. wait between 800ms and 2000ms
3. inspect session storage
4. redirect to `/dashboard` or `/login`

That is not a normal clickable link.

That is programmatic navigation.

So `useRouter` is appropriate.

The root route uses:

```tsx
router.replace(hasStoredSession() ? "/dashboard" : "/login");
```

`replace` navigates without adding the current route to browser history.

That is better than `push` for splash boot behavior.

### How The Pieces Work Together

When a new unauthenticated user opens `/`:

1. Next matches `src/app/page.tsx`.
2. The root layout wraps the page.
3. The splash screen renders immediately.
4. The client effect waits 1200ms.
5. The app finds no valid session.
6. `router.replace("/login")` runs.
7. Next renders `src/app/login/page.tsx`.
8. The user sees `LoginForm`.

When a user signs up:

1. Next renders `src/app/signup/page.tsx`.
2. `SignupForm` tracks input state with `useState`.
3. Submit reads `habit-tracker-users`.
4. Duplicate email is rejected if found.
5. A TRD-shaped user is saved.
6. A TRD-shaped session is saved.
7. The browser navigates to `/dashboard`.
8. Dashboard reads session through `useLocalStorageValue`.
9. Dashboard renders protected content.

When a user creates a habit:

1. Dashboard opens `HabitForm`.
2. `HabitForm` tracks name and description with `useState`.
3. Submit calls `validateHabitName`.
4. Dashboard builds a TRD-shaped `Habit`.
5. Dashboard writes `habit-tracker-habits`.
6. `useSyncExternalStore` hears the storage update.
7. Dashboard rerenders.
8. `userHabits` recalculates.
9. `HabitCard` appears with slug-based test IDs.

When a user completes a habit:

1. The user clicks `habit-complete-{slug}`.
2. Dashboard calls `toggleHabitCompletion`.
3. The helper adds today's `YYYY-MM-DD` date.
4. Dashboard writes the updated habits array.
5. `useSyncExternalStore` notifies subscribers.
6. Dashboard rerenders.
7. `HabitCard` recalculates streak.
8. The visible streak updates immediately.

When the app loads offline after one online load:

1. `ServiceWorkerRegistration` registers `/sw.js`.
2. The service worker caches shell routes and successful GET responses.
3. The browser goes offline.
4. Navigation or reload requests hit the service worker.
5. Cached responses are returned.
6. The app shell renders instead of hard-crashing.

## `package.json` Test Scripts

Purpose: expose the exact test script names required by the TRD.

```json
"test:unit": "vitest run --coverage tests/unit"
```

This runs the unit test suite.

`vitest run` executes tests once and exits.

`--coverage` generates a coverage report.

`tests/unit` limits this script to unit tests.

The TRD requires unit coverage for files inside `src/lib`.

```json
"test:integration": "vitest run tests/integration"
```

This reserves the required integration test script name.

The integration tests will cover auth and habit component flows.

They are separate from unit tests because they render components and interact
with UI state.

```json
"test:e2e": "playwright test"
```

This reserves the required end-to-end test script name.

Playwright will later drive the browser through real routes.

```json
"test": "npm run test:unit && npm run test:integration && npm run test:e2e"
```

This runs all required test groups in order.

The command stops if any earlier group fails.

That is useful because unit failures should be fixed before slower browser
tests run.

## `vitest.config.ts`

Purpose: configure Vitest for TypeScript path aliases and coverage.

```ts
import path from "node:path";
```

This imports Node's built-in path module.

The config uses it to build an absolute path to `src`.

```ts
import { defineConfig } from "vitest/config";
```

`defineConfig` gives TypeScript-aware config completion and checking.

```ts
export default defineConfig({
```

This exports the Vitest configuration object.

Vitest reads this file before running tests.

```ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
},
```

This teaches Vitest the same `@/*` alias used by the app.

Without this, files like `src/lib/habits.ts` could fail when they import
`@/types/habit`.

`path.resolve(__dirname, "src")` points `@` at the local `src` folder.

```ts
test: {
  coverage: {
    include: ["src/lib/**/*.ts"],
    provider: "v8",
    thresholds: {
      lines: 80,
    },
  },
},
```

`coverage` configures coverage reporting.

`include` limits the coverage target to library TypeScript files.

That matches the TRD coverage requirement for `src/lib`.

`provider: "v8"` uses V8's native coverage engine.

`thresholds.lines: 80` fails the unit test command when line coverage is below
80%.

## Unit Tests

The unit tests verify pure utility behavior before we test full app flows.

Each required test file uses the exact describe block and exact test titles
from the TRD.

Exact titles matter because mentors may inspect console output.

### `tests/unit/slug.test.ts`

Purpose: test `getHabitSlug`.

```ts
import { describe, expect, it } from "vitest";
```

`describe` groups related tests.

`it` defines one test case.

`expect` makes assertions.

```ts
import { getHabitSlug } from "../../src/lib/slug";
```

This imports the real slug helper.

The test does not duplicate the implementation.

```ts
describe("getHabitSlug", () => {
```

This describe block name is required by the TRD.

```ts
it("returns lowercase hyphenated slug for a basic habit name", () => {
  expect(getHabitSlug("Drink Water")).toBe("drink-water");
});
```

This proves normal habit names become lowercase hyphenated slugs.

`Drink Water` becomes `drink-water`.

```ts
it("trims outer spaces and collapses repeated internal spaces", () => {
  expect(getHabitSlug("   Read    Books   ")).toBe("read-books");
});
```

This proves leading/trailing spaces are removed.

It also proves repeated internal spaces collapse to one hyphen.

```ts
it("removes non alphanumeric characters except hyphens", () => {
  expect(getHabitSlug("Run! 5K - Daily?")).toBe("run-5k---daily");
});
```

This proves punctuation is removed.

The existing hyphen is preserved because the TRD allows hyphens.

### `tests/unit/validators.test.ts`

Purpose: test `validateHabitName`.

The first test passes only spaces.

The validator trims those spaces to an empty string.

It must return `Habit name is required`.

The second test uses 61 characters.

The TRD maximum is 60 characters.

It must return `Habit name must be 60 characters or fewer`.

The third test uses a valid name with outer spaces.

It must return the trimmed value and `error: null`.

### `tests/unit/streaks.test.ts`

Purpose: test `calculateCurrentStreak`.

```ts
/* MENTOR_TRACE_STAGE3_HABIT_A91 */
```

This marker is required by the TRD instructions for this specific file.

It is placed immediately above the describe block.

The empty completions test proves no completions produce a zero streak.

The missing-today test proves yesterday alone does not count as a current
streak.

The consecutive-days test proves the function counts backward from today.

The duplicate-date test proves duplicates do not inflate the streak.

The missing-calendar-day test proves a gap breaks the streak.

### `tests/unit/habits.test.ts`

Purpose: test `toggleHabitCompletion`.

`createHabit` builds a valid TRD habit object for tests.

That keeps every test focused on one behavior.

The add test proves a missing date is added.

The remove test proves an existing date is removed.

The immutability test proves the original habit object is not mutated.

The duplicate test proves returned completions are unique and sorted.

### `tests/unit/storage.test.tsx`

Purpose: test the `useSyncExternalStore` localStorage bridge.

The file uses:

```ts
// @vitest-environment jsdom
```

This tells Vitest to run this file in a browser-like DOM environment.

The storage helper needs `window` and `localStorage`.

The `StoredCount` test component calls `useLocalStorageValue`.

It renders the current `counter` value.

The test wraps `setLocalStorageValue` in `act`.

`act` tells React to flush updates caused by the external store write before
the assertion runs.

The storage tests cover:

- fallback when a key is missing
- fallback when JSON is invalid
- writing JSON values
- removing stored values
- notifying same-tab subscribers
- re-rendering subscribed React components

### `tests/unit/auth.test.ts`

Purpose: test shared auth helpers added during the cleanup pass.

The test runs in jsdom because `getStoredUsers` reads localStorage.

The stored-users test writes a TRD-shaped user array to:

```txt
habit-tracker-users
```

Then it expects `getStoredUsers()` to return that same array.

The missing-storage test confirms the helper returns an empty array when the
key is not present.

The valid-session test confirms `isSession` accepts objects with string
`userId` and string `email`.

The invalid-session test confirms `isSession` rejects missing fields, wrong
types, and `null`.

The id test confirms `createUserId` returns a non-empty string.

This file also imports `STORAGE_KEYS`, which keeps the constants file covered
by the unit suite and prevents coverage from drifting near the TRD threshold.

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

## `src/lib/storage.ts`

Purpose: provide a React-friendly localStorage bridge using
`useSyncExternalStore`.

This file is useful because localStorage is outside React.

React does not automatically re-render when localStorage changes.

`useSyncExternalStore` is React's official hook for subscribing to external
state sources.

```ts
"use client";
```

The storage helper uses browser APIs.

`window` and `localStorage` only exist in the browser.

The helper also imports React hooks.

That makes it a Client Component module.

```ts
import { useMemo, useSyncExternalStore } from "react";
```

`useSyncExternalStore` subscribes React to an external store.

`useMemo` parses the storage snapshot only when the raw stored string changes.

```ts
const STORAGE_CHANGE_EVENT = "habit-tracker-storage";
```

This names a custom browser event.

The native `storage` event fires in other tabs.

The native `storage` event does not fire in the same tab that called
`localStorage.setItem`.

The custom event fills that same-tab gap.

```ts
type StorageChangeDetail = {
  key: string;
};
```

This describes the custom event payload.

The payload stores which localStorage key changed.

That lets subscribers ignore unrelated storage writes.

```ts
function getSnapshotForKey(key: string): string | null {
```

This reads the current raw localStorage value for one key.

`useSyncExternalStore` calls this function to know the current snapshot.

```ts
if (typeof window === "undefined") {
  return null;
}
```

This protects server rendering.

There is no `window` on the server.

Returning `null` gives React a safe server snapshot.

```ts
return window.localStorage.getItem(key);
```

This returns the raw localStorage string.

It returns `null` when the key is missing.

The snapshot intentionally stays as a string.

Returning parsed arrays or objects directly could create a new reference on
every read.

New references can make external store snapshots unstable.

```ts
function emitStorageChange(key: string) {
```

This broadcasts that one localStorage key changed.

It is called after local writes and removals.

```ts
window.dispatchEvent(
  new CustomEvent<StorageChangeDetail>(STORAGE_CHANGE_EVENT, {
    detail: { key },
  }),
);
```

`dispatchEvent` sends the custom event through `window`.

`CustomEvent` carries the changed key in `detail`.

Any subscriber listening for `habit-tracker-storage` can react.

```ts
function parseSnapshot<T>(snapshot: string | null, fallback: T): T {
```

This converts a raw localStorage string into typed data.

`T` is the expected value type.

`fallback` is returned when the key is missing or invalid.

```ts
if (snapshot === null) {
  return fallback;
}
```

Missing localStorage keys become fallback values.

Example: missing `habit-tracker-habits` becomes `[]`.

```ts
try {
  return JSON.parse(snapshot) as T;
} catch {
  return fallback;
}
```

`JSON.parse` converts stored JSON text back into JavaScript data.

The `catch` prevents broken localStorage data from crashing the app.

Returning fallback keeps the UI deterministic.

```ts
export function useLocalStorageValue<T>(key: string, fallback: T): T {
```

This is the hook used by React components.

It subscribes a component to one localStorage key.

When that key changes, React re-renders the component.

```ts
const snapshot = useSyncExternalStore(
  (onStoreChange) => subscribeToLocalStorageKey(key, onStoreChange),
  () => getSnapshotForKey(key),
  () => null,
);
```

The first argument subscribes to changes.

`onStoreChange` is React's callback.

React provides it.

The storage helper calls it when the watched key changes.

The second argument reads the current browser snapshot.

The third argument reads the server snapshot.

The server snapshot returns `null` because localStorage is unavailable on the
server.

```ts
return useMemo(
  () => parseSnapshot(snapshot, fallback),
  [fallback, snapshot],
);
```

The raw string snapshot is parsed into typed data.

`useMemo` avoids parsing again unless the string or fallback changes.

```ts
export function readLocalStorageValue<T>(key: string, fallback: T): T {
```

This is the non-hook read helper.

It is useful inside event handlers or one-time checks.

The root splash route uses it during redirect logic.

Login and signup use it to read existing users before submitting.

```ts
export function setLocalStorageValue<T>(key: string, value: T) {
```

This writes a typed value into localStorage.

```ts
localStorage.setItem(key, JSON.stringify(value));
```

localStorage only stores strings.

`JSON.stringify` converts arrays and objects into strings.

```ts
emitStorageChange(key);
```

After writing, this tells same-tab subscribers to update.

Without this custom event, the dashboard might not re-render immediately after
a local write in the same browser tab.

```ts
export function removeLocalStorageValue(key: string) {
```

This removes a key from localStorage.

Logout uses it for `habit-tracker-session`.

```ts
localStorage.removeItem(key);
emitStorageChange(key);
```

The key is removed.

Subscribers are notified.

```ts
export function subscribeToLocalStorageKey(
  key: string,
  onStoreChange: () => void,
) {
```

This connects React to localStorage changes for one key.

It returns an unsubscribe function.

`useSyncExternalStore` uses that unsubscribe function during cleanup.

```ts
function handleStorage(event: StorageEvent) {
  if (event.key === key || event.key === null) {
    onStoreChange();
  }
}
```

This listens for native browser `storage` events.

Those events usually fire when another tab changes localStorage.

`event.key === key` means the watched key changed.

`event.key === null` can happen when storage is cleared.

```ts
function handleCustomStorage(event: Event) {
```

This listens for the custom same-tab event.

```ts
const customEvent = event as CustomEvent<StorageChangeDetail>;
```

The generic `Event` is narrowed to the custom event shape.

```ts
if (customEvent.detail?.key === key) {
  onStoreChange();
}
```

Only the matching key triggers a React update.

Unrelated localStorage writes are ignored.

```ts
window.addEventListener("storage", handleStorage);
window.addEventListener(STORAGE_CHANGE_EVENT, handleCustomStorage);
```

The helper subscribes to both cross-tab and same-tab updates.

```ts
return () => {
  window.removeEventListener("storage", handleStorage);
  window.removeEventListener(STORAGE_CHANGE_EVENT, handleCustomStorage);
};
```

This cleanup removes both listeners.

React calls it when a component no longer needs the subscription.

## `src/app/dashboard/page.tsx` Storage Refactor

The dashboard now uses `useLocalStorageValue` instead of copying localStorage
into React state manually.

```tsx
const storedSession = useLocalStorageValue<unknown>(
  "habit-tracker-session",
  null,
);
```

This subscribes the dashboard to the session key.

The value is read as `unknown` first because localStorage data is runtime data.

Runtime data must be checked before it is trusted.

```tsx
const habits = useLocalStorageValue<Habit[]>(
  "habit-tracker-habits",
  EMPTY_HABITS,
);
```

This subscribes the dashboard to the habits key.

When a habit is created, edited, deleted, or completed, the key changes.

The storage hook notices the change and React re-renders the dashboard.

```tsx
const session = isSession(storedSession) ? storedSession : null;
```

This validates the unknown storage value.

Only an object with string `userId` and string `email` becomes a session.

```tsx
function saveHabits(nextHabits: Habit[]) {
  setLocalStorageValue("habit-tracker-habits", nextHabits);
}
```

The dashboard no longer calls `setHabits`.

The source of truth is the external store.

Writing localStorage triggers the subscription.

The subscription provides the new value back to React.

```tsx
function handleLogout() {
  removeLocalStorageValue("habit-tracker-session");
  window.location.href = "/login";
}
```

Logout now removes the session through the storage helper.

That removal also notifies subscribers.

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
import { readLocalStorageValue, setLocalStorageValue } from "@/lib/storage";
```

This imports the localStorage helper functions.

`readLocalStorageValue` reads and safely parses a stored value.

`setLocalStorageValue` writes JSON and emits the storage change event.

```tsx
import { readLocalStorageValue, setLocalStorageValue } from "@/lib/storage";
```

This imports the shared localStorage helpers.

`readLocalStorageValue` safely reads existing users.

`setLocalStorageValue` writes users/session and notifies subscribers.

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

This helper reads users through the storage helper.

It returns an array of users.

Keeping this logic in a helper makes submit handling easier to read.

```tsx
return readLocalStorageValue<User[]>("habit-tracker-users", []);
```

This reads the TRD users key.

The expected value is `User[]`.

If the key is missing or invalid, the fallback is `[]`.

The parsing and error handling live in `src/lib/storage.ts`.

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
setLocalStorageValue(
  "habit-tracker-session",
  {
    userId: matchingUser.id,
    email: matchingUser.email,
  },
);
```

This creates the active session.

The key is exactly `habit-tracker-session`.

The stored object matches the TRD `Session` type.

`setLocalStorageValue` converts the object into localStorage text.

It also emits the custom storage event for same-tab subscribers.

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

This helper reads users through the storage helper.

It returns an array every time.

That keeps submit logic simple.

```tsx
return readLocalStorageValue<User[]>("habit-tracker-users", []);
```

This reads the exact TRD storage key for users.

The expected value is `User[]`.

If no users exist yet, the fallback `[]` lets the first signup succeed cleanly.

The parsing and invalid JSON fallback live in `src/lib/storage.ts`.

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
setLocalStorageValue(
  "habit-tracker-users",
  [...users, newUser],
);
```

This writes the updated users array to localStorage.

The key is exactly `habit-tracker-users`.

`[...users, newUser]` creates a new array with the new user appended.

`setLocalStorageValue` converts the array into text for localStorage.

It also emits the same-tab storage change event.

```tsx
setLocalStorageValue(
  "habit-tracker-session",
  {
    userId: newUser.id,
    email: newUser.email,
  },
);
```

This logs the user in immediately after signup.

The key is exactly `habit-tracker-session`.

The stored object matches the TRD `Session` type.

`userId` links the session to the new user.

`email` stores the active user's email.

The storage helper notifies subscribers after writing the session.

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
function isSession(value: unknown): value is Session {
```

This checks whether a localStorage value really matches the TRD session shape.

The dashboard reads session data as `unknown` first.

That is safer than trusting parsed JSON immediately.

The function returns `true` only when `userId` and `email` are strings.

```tsx
const storedSession = useLocalStorageValue<unknown>(
  "habit-tracker-session",
  null,
);
```

This subscribes the dashboard to the session key.

The value starts as `unknown` because localStorage can contain anything.

```tsx
const habits = useLocalStorageValue<Habit[]>(
  "habit-tracker-habits",
  EMPTY_HABITS,
);
```

This subscribes the dashboard to the habits key.

The fallback is the stable empty array constant `EMPTY_HABITS`.

When the storage helper writes new habits, this hook receives the new snapshot.

```tsx
const session = isSession(storedSession) ? storedSession : null;
```

This converts untrusted storage data into a trusted `Session | null`.

Invalid session data becomes `null`.

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
  if (!storedSession) {
    window.location.href = "/login";
    return;
  }
```

This protects `/dashboard` when no session exists.

Unauthenticated users are redirected to `/login`.

```tsx
if (!session) {
  removeLocalStorageValue("habit-tracker-session");
  window.location.href = "/login";
}
```

This handles invalid session shapes.

Bad session data is removed.

Then the user is redirected to `/login`.

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
  setLocalStorageValue("habit-tracker-habits", nextHabits);
}
```

This is the central save function.

It writes the next habits array to localStorage through the storage helper.

The storage helper emits a change event.

`useLocalStorageValue` hears that event and gives React the updated array.

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

## Integration Tests

Purpose: verify real component behavior with React Testing Library.

Unit tests prove the pure helpers work.

Integration tests prove users can interact with forms and cards through the
same labels, inputs, buttons, storage keys, and test IDs that the TRD requires.

Integration tests should stay closer to user behavior than implementation
details.

That is why they use `userEvent` instead of directly calling component
functions.

### Auth Integration Redirect Seam

`LoginForm` and `SignupForm` accept an optional `onSuccessRedirect` prop.

The normal production default is:

```tsx
onSuccessRedirect = (path) => {
  window.location.href = path;
}
```

`path` is the target route.

For login and signup, the successful target is `/dashboard`.

`window.location.href = path` performs a browser navigation in the real app.

Tests should not perform a real jsdom navigation.

jsdom is a simulated browser environment, not a full Next.js browser runtime.

The optional prop lets tests pass `vi.fn()`.

That keeps production behavior unchanged.

It also lets the test assert that the form intended to redirect to
`/dashboard`.

This is a small test seam.

A test seam is a controlled way to observe side effects during tests.

The important rule is that the seam must not weaken the user-facing behavior.

Here it does not weaken behavior because the default still navigates.

### `tests/integration/auth-flow.test.tsx`

Purpose: cover the exact TRD auth-flow test titles.

```tsx
// @vitest-environment jsdom
```

This makes the test file run with browser-like globals.

The auth forms use `localStorage`.

`localStorage` does not exist in a plain Node test environment.

jsdom provides `window`, `document`, form events, inputs, buttons, and
`localStorage`.

```tsx
import { cleanup, render, screen } from "@testing-library/react";
```

`render` mounts React components into the jsdom document.

`screen` queries the rendered document the way a user-facing test should.

`cleanup` unmounts rendered components after each test.

```tsx
import userEvent from "@testing-library/user-event";
```

`userEvent` simulates realistic user actions.

Typing into an input fires keyboard and input events.

Clicking a button fires pointer and click events.

That makes the test closer to real browser behavior than direct state changes.

```tsx
import { afterEach, describe, expect, it, vi } from "vitest";
```

`describe` groups the auth-flow tests.

The describe name must be exactly `auth flow`.

`it` defines each required test title.

`expect` performs assertions.

`vi` creates spies such as `vi.fn()`.

`afterEach` resets test state after every test.

```tsx
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
```

`cleanup()` removes mounted React components.

`localStorage.clear()` prevents one test's stored users or session from leaking
into the next test.

`vi.restoreAllMocks()` resets spies and mocked behavior.

Together these lines make each test deterministic.

```tsx
describe("auth flow", () => {
```

This describe block name is required by the TRD.

Changing the text would make the test output drift from the specification.

#### Signup Success Test

Required title:

```tsx
it("submits the signup form and creates a session", async () => {
```

This test proves signup creates both required localStorage records.

It creates `const user = userEvent.setup()`.

That prepares a user-event controller for async typing and clicking.

It creates `const redirect = vi.fn()`.

That spy records whether the form requested navigation.

It renders:

```tsx
<SignupForm onSuccessRedirect={redirect} />
```

The component is the real signup form.

Only the redirect action is swapped for a spy.

The test types into:

```tsx
auth-signup-email
auth-signup-password
```

Those are the exact TRD signup form test IDs.

The test clicks:

```tsx
auth-signup-submit
```

That runs the real form submit handler.

After submit, the test reads:

```tsx
habit-tracker-users
habit-tracker-session
```

Those are the exact TRD localStorage keys.

It expects one stored user.

It expects the stored user email and password to match the form input.

It expects the session to contain `userId` and `email`.

It expects `userId` to match the newly created user's `id`.

It expects redirect to be called with `/dashboard`.

That covers the TRD signup success behavior.

#### Duplicate Signup Test

Required title:

```tsx
it("shows an error for duplicate signup email", async () => {
```

This test first seeds `habit-tracker-users`.

The seeded user has `taken@example.com`.

The form then tries to sign up with the same email.

The submit handler must reject the duplicate.

The visible message must be:

```txt
User already exists
```

That message is required by the TRD.

The test also confirms no session is created.

That matters because failed signup must not authenticate the user.

#### Login Success Test

Required title:

```tsx
it("submits the login form and stores the active session", async () => {
```

This test seeds one user into `habit-tracker-users`.

The test renders the real `LoginForm`.

It types matching email and password into:

```tsx
auth-login-email
auth-login-password
```

It clicks:

```tsx
auth-login-submit
```

The login handler reads local users.

It finds the matching email/password pair.

It writes `habit-tracker-session`.

The test expects the session to contain:

```ts
{
  userId: "user-1",
  email: "member@example.com",
}
```

It also expects redirect to `/dashboard`.

This covers the TRD login success behavior.

#### Invalid Login Test

Required title:

```tsx
it("shows an error for invalid login credentials", async () => {
```

This test seeds a real user.

It then types the correct email but wrong password.

The handler must reject the credentials.

The visible message must be:

```txt
Invalid email or password
```

That message is required by the TRD.

The test also confirms `habit-tracker-session` remains missing.

That prevents invalid login from accidentally creating a session.

### `tests/integration/habit-form.test.tsx`

Purpose: cover the exact TRD habit-form test titles.

The file uses jsdom because it renders React components and interacts with
buttons, inputs, textareas, and local component state.

```tsx
const today = "2026-04-29";
```

The tests use a fixed date.

Fixed dates make streak behavior deterministic.

Without a fixed date, tests would change depending on when they run.

```tsx
function createHabit(overrides: Partial<Habit> = {}): Habit {
```

This helper creates a valid TRD habit object.

`Partial<Habit>` allows each test to override only the fields it cares about.

The base habit includes:

- `id`
- `userId`
- `name`
- `description`
- `frequency: "daily"`
- `createdAt`
- `completions`

Those fields match the TRD habit storage shape.

The helper keeps tests short without weakening the habit contract.

```tsx
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
```

The habit integration tests do not need localStorage cleanup because they test
components directly.

They still unmount components and reset spies after each test.

```tsx
describe("habit form", () => {
```

This describe block name is required by the TRD.

Changing it would make the mentor-facing test output wrong.

#### Empty Habit Name Test

Required title:

```tsx
it("shows a validation error when habit name is empty", async () => {
```

This test renders `HabitForm` without an existing habit.

That means the form is in create mode.

It clicks `habit-save-button` without typing a name.

The form calls `validateHabitName`.

The validator trims the empty value.

The visible error must be:

```txt
Habit name is required
```

That is the exact TRD validation message.

The test also confirms `onSave` was not called.

That matters because invalid input must not create or update a habit.

#### Create Habit Test

Required title:

```tsx
it("creates a new habit and renders it in the list", async () => {
```

This test uses a small `HabitCreationHarness` component.

The harness owns `const [habits, setHabits] = useState<Habit[]>([])`.

That mimics the dashboard owning the habit list.

The harness passes a real `saveHabit` function into `HabitForm`.

When the form saves, the harness creates a TRD-shaped habit and stores it in
React state.

The harness maps `habits` into real `HabitCard` components.

The test types a habit name and description.

It clicks `habit-save-button`.

It then expects:

```tsx
habit-card-drink-water
```

That proves the card rendered with the slug-based TRD test ID.

The test uses `within(habitCard)` to check the description.

That is important because the same description still exists inside the
textarea.

`within(habitCard)` tells Testing Library to search inside the card only.

#### Edit Habit Test

Required title:

```tsx
it("edits an existing habit and preserves immutable fields", async () => {
```

This test starts with an existing habit.

The existing habit already has a completion date.

The form receives that habit through the `habit` prop.

That puts `HabitForm` into edit mode.

The test clears the name input.

It types a new habit name.

It clears the description textarea.

It types a new description.

It clicks save.

The test builds an updated habit the same way the dashboard edit path should:

- preserve `id`
- preserve `userId`
- preserve `createdAt`
- preserve `completions`
- update `name`
- update `description`
- keep `frequency: "daily"`

Those preservation rules come directly from the TRD edit habit section.

The test checks all of those fields at once with `toMatchObject`.

#### Delete Confirmation Test

Required title:

```tsx
it("deletes a habit only after explicit confirmation", async () => {
```

This test renders a real `HabitCard`.

It passes `deleteHabit = vi.fn()` as `onDelete`.

The test first clicks:

```tsx
habit-delete-drink-water
```

That should not call `onDelete`.

Instead, the card should reveal the confirmation UI.

Then the test clicks:

```tsx
confirm-delete-button
```

Only this second explicit action should call `onDelete`.

That proves deletion requires confirmation, as the TRD demands.

#### Toggle Completion Test

Required title:

```tsx
it("toggles completion and updates the streak display", async () => {
```

This test uses a small `HabitCompletionHarness`.

The harness stores one habit in React state.

The habit starts with an empty `completions` array.

The card receives the fixed date `2026-04-29`.

Before clicking complete, the streak test ID should contain:

```txt
0 day streak
```

The test clicks:

```tsx
habit-complete-drink-water
```

The harness calls:

```tsx
toggleHabitCompletion(currentHabit, today)
```

That is the real TRD helper.

The helper adds today's date.

React state updates.

The card rerenders.

The streak text becomes:

```txt
1 day streak
```

The completion button text becomes:

```txt
Completed
```

That proves the UI updates immediately after toggling completion.

It also proves the card uses the shared streak helper instead of hardcoded
streak text.

## Playwright E2E Tests

Purpose: verify the complete app contract in a real browser.

Unit tests verify pure helper functions.

Integration tests verify React components in jsdom.

Playwright E2E tests verify route navigation, browser localStorage,
redirects, reload behavior, and offline service worker behavior.

The TRD requires the file:

```txt
tests/e2e/app.spec.ts
```

The TRD requires the describe block:

```ts
test.describe("Habit Tracker app", () => {})
```

Every test title in the file must match the TRD wording exactly.

Mentors may scan test output for those exact titles.

### `playwright.config.ts`

Purpose: make `npm run test:e2e` start the app and run browser tests.

```ts
import { defineConfig, devices } from "@playwright/test";
```

`defineConfig` gives typed Playwright configuration.

`devices` provides built-in browser/device presets.

```ts
export default defineConfig({
```

This exports the Playwright configuration object.

The `playwright test` command reads this file automatically.

```ts
testDir: "./tests/e2e",
```

This tells Playwright where E2E specs live.

It keeps E2E tests separate from unit and integration tests.

```ts
timeout: 30_000,
```

Each test can run for up to 30 seconds.

The underscore is numeric separator syntax.

`30_000` is the same number as `30000`.

It is easier to read as milliseconds.

```ts
expect: {
  timeout: 7_500,
},
```

Playwright assertions auto-wait.

This gives each `expect(...)` up to 7.5 seconds.

That matters for route redirects and hydration.

```ts
use: {
  baseURL: "http://localhost:3000",
  trace: "on-first-retry",
},
```

`baseURL` lets tests call `page.goto("/login")` instead of the full URL.

`localhost` is used instead of `127.0.0.1`.

Next dev treats these as different origins.

Using `127.0.0.1` caused Next dev resources to be blocked as cross-origin.

`trace: "on-first-retry"` records debugging traces only when a test retries.

That keeps normal test runs lighter.

```ts
webServer: {
  command: "npm run dev",
  url: "http://localhost:3000",
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
},
```

`webServer` lets Playwright start the Next dev server automatically.

`command` runs the same dev script developers use locally.

`url` tells Playwright when the app is ready.

`reuseExistingServer` avoids starting a second dev server locally if one is
already running.

CI should normally start a fresh server, so reuse is disabled there.

`timeout` gives Next enough time to compile before tests begin.

```ts
projects: [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"] },
  },
],
```

The TRD requires Playwright, not every browser engine.

One Chromium project is enough for this stage.

`Desktop Chrome` gives the tests a desktop viewport.

That keeps the sidebar logout button visible in dashboard tests.

### `public/manifest.json`

Purpose: satisfy the installable PWA manifest contract.

```json
"name": "Habit Tracker"
```

This is the full app name.

The TRD requires the manifest to include `name`.

```json
"short_name": "Habits"
```

This is the shorter display name for constrained install surfaces.

The TRD requires `short_name`.

```json
"start_url": "/"
```

An installed PWA opens at the root route.

The root route then applies the TRD splash and session redirect behavior.

```json
"display": "standalone"
```

This asks the installed app to open without normal browser UI.

The TRD requires `display`.

```json
"background_color": "#f4f7ff"
```

This color matches the light app shell background.

The TRD requires `background_color`.

```json
"theme_color": "#1d4ed8"
```

This defines the browser/theme accent color.

The TRD requires `theme_color`.

```json
"icons": [...]
```

The manifest points to:

- `/icons/icon-192.png`
- `/icons/icon-512.png`

Those are the exact required icon sizes from the TRD.

### `public/sw.js`

Purpose: cache the app shell and avoid hard crashes while offline.

The file lives in `public`.

Next serves files in `public` from the site root.

So `public/sw.js` is available at:

```txt
/sw.js
```

```js
const CACHE_NAME = "habit-tracker-shell-v1";
```

This names the service worker cache.

Changing the name later creates a fresh cache version.

```js
const APP_SHELL_URLS = ["/", "/login", "/signup", "/dashboard", "/manifest.json"];
```

These are the core shell routes and manifest.

The install event pre-caches them.

The dashboard route is included because the TRD requires the protected app
shell not to hard-crash offline after it has been loaded once.

```js
self.addEventListener("install", (event) => {
```

The install event runs when the service worker is first installed.

```js
caches.open(CACHE_NAME)
```

This opens or creates the named cache.

```js
cache.addAll(APP_SHELL_URLS)
```

This fetches and stores the shell URLs.

```js
self.skipWaiting()
```

This lets the new service worker activate without waiting for old tabs to
close.

```js
self.addEventListener("activate", (event) => {
```

The activate event runs after install.

```js
caches.keys()
```

This lists existing cache names.

```js
filter((cacheName) => cacheName !== CACHE_NAME)
```

This finds old cache versions.

```js
caches.delete(cacheName)
```

This removes old caches.

That prevents stale app shells from living forever.

```js
self.clients.claim()
```

This lets the service worker control open pages as soon as it activates.

```js
self.addEventListener("fetch", (event) => {
```

The fetch event intercepts network requests from controlled pages.

```js
if (event.request.method !== "GET") {
  return;
}
```

Only GET requests are cached.

This avoids trying to cache writes or non-idempotent requests.

```js
fetch(event.request)
```

The service worker tries the network first.

Network-first keeps development and fresh assets accurate while online.

```js
const responseCopy = response.clone();
```

Responses can only be read once.

The clone lets one copy go to the browser and one copy go into the cache.

```js
cache.put(event.request, responseCopy);
```

Every successful GET response is stored.

This includes Next JavaScript chunks loaded during the first online visit.

That is what makes later offline reloads able to render the shell.

```js
catch(async () => {
```

This block runs when the network fails.

That is the offline path.

```js
const cachedResponse = await caches.match(event.request);
```

The service worker first looks for an exact cached response.

If the page asks for a cached JavaScript chunk, this returns that chunk.

```js
if (event.request.mode === "navigate") {
  return caches.match("/");
}
```

If the request is a page navigation and no exact match exists, return the root
shell.

This prevents a hard browser crash while offline.

```js
return new Response("", {
  status: 504,
  statusText: "Offline"
});
```

If the request is not cached and not a navigation, return a controlled offline
response.

The app shell can still render.

### `src/components/shared/ServiceWorkerRegistration.tsx`

Purpose: register the service worker from the client.

```tsx
"use client";
```

Service workers are a browser API.

The component must be a Client Component.

```tsx
import { useEffect } from "react";
```

Registration happens after the page renders in the browser.

That is what `useEffect` is for.

```tsx
export default function ServiceWorkerRegistration() {
```

The component renders no visible UI.

It exists only to run the registration side effect.

```tsx
useEffect(() => {
```

The effect runs once after mount.

```tsx
if (!("serviceWorker" in navigator)) {
  return;
}
```

This guards browsers that do not support service workers.

The app should not crash in those browsers.

```tsx
navigator.serviceWorker.register("/sw.js").catch(() => undefined);
```

This registers the public service worker file.

The `catch` prevents a registration failure from crashing the UI.

The TRD requires the app to avoid hard crashes offline.

The same defensive idea applies here.

```tsx
return null;
```

The component does not render markup.

### `src/app/layout.tsx` PWA Updates

Purpose: attach global metadata and service worker registration.

```tsx
import ServiceWorkerRegistration from "@/components/shared/ServiceWorkerRegistration";
```

The root layout imports the client component.

Server Components may render Client Components as children.

The local Next docs confirm the root layout wraps every route.

That makes it the right place for one global service worker registration.

```tsx
import type { Metadata } from "next";
```

This imports the metadata type only.

```tsx
export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track daily habits with local-first progress persistence.",
  manifest: "/manifest.json",
};
```

`metadata` lets Next add document metadata.

`manifest: "/manifest.json"` links the PWA manifest in the page head.

The metadata export stays in the Server Component layout.

That matches Next's metadata rules.

```tsx
<ServiceWorkerRegistration />
```

This mounts the registration side effect for every route.

The component returns `null`, so it does not affect layout or styling.

### Dashboard Hydration Gate

Purpose: prevent false logout redirects on direct dashboard loads.

The dashboard reads session data through `useSyncExternalStore`.

During App Router hydration, the server snapshot is `null`.

The client snapshot updates immediately after hydration.

Without a guard, the dashboard effect can see the first `null` snapshot and
redirect to `/login` before the real localStorage session is read.

The E2E tests caught this.

```tsx
const [hasCheckedClientStorage, setHasCheckedClientStorage] = useState(false);
```

This tracks whether the first client effect has run.

```tsx
useEffect(() => {
  setHasCheckedClientStorage(true);
}, []);
```

This flips the flag after mount.

That gives `useSyncExternalStore` one client render cycle to provide the real
localStorage snapshot.

```tsx
if (!hasCheckedClientStorage) {
  return;
}
```

The redirect effect does nothing until the client storage check has happened.

```tsx
if (!hasCheckedClientStorage || !session) {
  return <div className="p-8 text-slate-500">Loading...</div>;
}
```

The dashboard shows loading while it is still deciding auth state.

It does not render protected content until a valid session exists.

It does not redirect too early.

This keeps `/dashboard` protected and makes reloads with a valid session work.

### `tests/e2e/app.spec.ts`

Purpose: verify the required TRD browser flows.

```ts
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
```

`test` defines browser tests.

`expect` performs auto-waiting browser assertions.

`Page` types helper functions that interact with a tab.

`BrowserContext` types helper functions that control browser-level state such
as offline mode.

```ts
type StoredUser = { ... };
type StoredSession = { ... };
type StoredHabit = { ... };
```

These mirror the TRD localStorage shapes.

The E2E tests seed realistic browser storage.

They do not invent a separate schema.

```ts
const today = new Date().toISOString().split("T")[0];
```

This matches the app's date format.

Completion tests compare against the same `YYYY-MM-DD` value the app uses.

```ts
const primaryUser = { ... };
const secondaryUser = { ... };
```

Two users make it possible to test user-specific habit filtering.

The dashboard should show only `primaryUser` habits after primary login.

```ts
function createHabit(overrides: Partial<StoredHabit> = {}): StoredHabit {
```

This builds valid habit records for localStorage.

Tests override only the field that matters for that scenario.

```ts
async function resetBrowserState(page: Page, context: BrowserContext) {
```

This clears browser state before each test.

It sets the browser online.

It visits `/login` to get onto the app origin.

It clears localStorage.

It unregisters service workers.

It deletes caches.

That keeps tests isolated from each other.

```ts
async function writeAppStorage(page: Page, state: { ... }) {
```

This helper writes TRD storage keys from inside the browser.

It writes:

- `habit-tracker-users`
- `habit-tracker-habits`
- `habit-tracker-session`

It removes the session key when `session` is missing.

This lets tests set up auth state without clicking through signup every time.

```ts
test.beforeEach(async ({ page, context }) => {
  await resetBrowserState(page, context);
});
```

Every E2E test starts from a clean browser state.

#### Splash Redirect Test

Required title:

```ts
shows the splash screen and redirects unauthenticated users to /login
```

The test visits `/`.

It expects `data-testid="splash-screen"` to be visible.

It waits for the root route to redirect to `/login`.

It verifies the login email input is visible.

This proves the unauthenticated boot path.

#### Authenticated Root Redirect Test

Required title:

```ts
redirects authenticated users from / to /dashboard
```

The test seeds a valid user and session.

It visits `/`.

It sees the splash.

It waits for `/dashboard`.

It verifies `data-testid="dashboard-page"`.

This proves the authenticated boot path.

#### Dashboard Protection Test

Required title:

```ts
prevents unauthenticated access to /dashboard
```

The test visits `/dashboard` with no session.

It expects redirect to `/login`.

This proves the protected route behavior.

#### Signup E2E Test

Required title:

```ts
signs up a new user and lands on the dashboard
```

The test fills the signup email and password fields.

It clicks the signup submit button.

It expects `/dashboard`.

It reads `habit-tracker-session` from real browser localStorage.

It checks the session email.

This proves signup works through the browser.

#### Login Filtering Test

Required title:

```ts
logs in an existing user and loads only that user's habits
```

The test seeds two users.

It seeds one habit for each user.

It logs in as the primary user.

It expects the primary habit card to render.

It expects the secondary user's habit card not to exist.

This proves dashboard habit filtering by `session.userId`.

#### Create Habit E2E Test

Required title:

```ts
creates a habit from the dashboard
```

The test starts with a valid session and no habits.

It opens the habit form through `create-habit-button`.

It fills `habit-name-input`.

It fills `habit-description-input`.

It clicks `habit-save-button`.

It expects the slugged habit card test ID to appear.

It reads `habit-tracker-habits` and verifies the saved object.

This proves create behavior in the browser and in persistence.

#### Complete Habit E2E Test

Required title:

```ts
completes a habit for today and updates the streak
```

The test starts with one incomplete habit.

It verifies the streak is zero.

It clicks the slugged completion button.

It expects the streak text to become one day.

It reads localStorage and checks that today's date was added.

This proves UI and persistence update together.

#### Reload Persistence Test

Required title:

```ts
persists session and habits after page reload
```

The test creates a habit through the UI.

It reloads the page.

It expects to remain on dashboard.

It expects the created habit card to still render.

This proves localStorage state survives reload.

#### Logout E2E Test

Required title:

```ts
logs out and redirects to /login
```

The test starts authenticated.

It clicks `auth-logout-button`.

It expects `/login`.

It checks that `habit-tracker-session` is removed.

This proves logout behavior.

#### Offline Shell E2E Test

Required title:

```ts
loads the cached app shell when offline after the app has been loaded once
```

The test visits `/login` while online.

That gives the service worker a chance to register and cache assets.

It waits for `navigator.serviceWorker.ready`.

It reloads online once so the active service worker controls the page.

It switches the browser context offline.

It reloads again.

It expects the login shell to still render.

This proves the PWA shell does not hard-crash offline after first load.

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
import { readLocalStorageValue, removeLocalStorageValue } from "@/lib/storage";
```

This imports storage helpers for the boot route.

The root route does not subscribe because it only needs one delayed decision.

It still uses the helper so parsing and removal behavior stays consistent.

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
const session = readLocalStorageValue<{
  userId?: unknown;
  email?: unknown;
} | null>("habit-tracker-session", null);
```

This reads the exact TRD session key.

The expected value has optional `userId` and `email` fields.

The fallback is `null`.

```tsx
if (!session) {
  return false;
}
```

If the key is missing, there is no active session.

The root page should redirect unauthenticated users to `/login`.

```tsx
if (typeof session.userId === "string" && typeof session.email === "string") {
  return true;
}
```

The session is treated as valid only when both required TRD fields are strings.

`userId` connects the session to the active user.

`email` stores the active user's email.

```tsx
removeLocalStorageValue("habit-tracker-session");
return false;
```

If the stored session shape is invalid, remove it.

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
