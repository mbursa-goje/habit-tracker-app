# Habit Tracker PWA Roadmap

## Phase 1: Foundation & Authentication (In Progress)
- [x] Project initialization with Next.js, TypeScript, and Tailwind CSS.
- [x] Folder structure setup (App Router, Components, Lib, Types).
- [x] Core utility functions:
    - [x] Streak calculation logic.
    - [x] Slug generation.
- [x] Authentication:
    - [x] Local authentication logic (using `localStorage`).
    - [x] Login page and component.
    - [x] Signup page and component.
- [x] Type definitions for Auth and Habits.
- [x] Unit tests for streak logic.
- [x] Integration tests for auth flow.

## Phase 2: Habit Management (CRUD)
- [ ] Habit Data Model implementation.
- [ ] Habit Creation Form:
    - [ ] Name, Icon/Emoji selection.
    - [ ] Frequency (Daily, Weekly).
    - [ ] Goal setting.
- [ ] Habit List View:
    - [ ] Dashboard layout.
    - [ ] Habit cards with status toggles.
- [ ] Habit Details/Edit:
    - [ ] View individual habit progress.
    - [ ] Update habit details.
    - [ ] Delete habit functionality.
- [ ] Persistent storage integration with `localStorage`.

## Phase 3: UI/UX & Figma Implementation (In Progress)
- [/] Implement Mobile-First Responsive Design:
    - [ ] Bottom navigation for mobile.
    - [/] Sidebar/Header navigation for desktop.
- [/] Theming & Aesthetics:
    - [ ] Match "Habitly" blue/white color palette.
    - [ ] Implement card shadows and spacing from design.
- [/] Visual Components (Based on provided image):
    - [ ] Daily Streak card with fire emoji.
    - [ ] Habit cards with circular checkboxes and dropdown menus.
    - [ ] Floating Action Button (FAB) for mobile.
    - [ ] PWA Install Banner.

## Phase 4: PWA & Offline Support
- [ ] Service worker registration.
- [ ] Manifest file configuration.
- [ ] Offline data persistence and sync logic.
- [ ] "Add to Home Screen" prompt logic.

## Phase 5: Testing & Optimization
- [ ] Expand unit tests for all utility functions.
- [ ] End-to-end (E2E) testing with Playwright for core user flows.
- [ ] Accessibility (a11y) audit and fixes (WCAG 2.1).
- [ ] Performance optimization (Lighthouse score 90+).
- [ ] Final UI polish and pixel-perfection.
