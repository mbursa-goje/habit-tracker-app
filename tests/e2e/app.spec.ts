import { expect, test, type BrowserContext, type Page } from "@playwright/test";

type StoredUser = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

type StoredSession = {
  userId: string;
  email: string;
};

type StoredHabit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[];
};

const today = new Date().toISOString().split("T")[0];

const primaryUser: StoredUser = {
  id: "user-primary",
  email: "alex@example.com",
  password: "password123",
  createdAt: "2026-04-29T00:00:00.000Z",
};

const secondaryUser: StoredUser = {
  id: "user-secondary",
  email: "casey@example.com",
  password: "password123",
  createdAt: "2026-04-29T00:00:00.000Z",
};

function createHabit(overrides: Partial<StoredHabit> = {}): StoredHabit {
  return {
    id: "habit-primary",
    userId: primaryUser.id,
    name: "Morning Meditation",
    description: "Start the day with focus",
    frequency: "daily",
    createdAt: "2026-04-29T00:00:00.000Z",
    completions: [],
    ...overrides,
  };
}

async function resetBrowserState(page: Page, context: BrowserContext) {
  await context.setOffline(false);
  await context.clearCookies();

  await page.goto("/login", { waitUntil: "domcontentloaded" });

  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }
  });
}

async function writeAppStorage(
  page: Page,
  state: {
    users?: StoredUser[];
    session?: StoredSession | null;
    habits?: StoredHabit[];
  },
) {
  await page.evaluate((nextState) => {
    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify(nextState.users ?? []),
    );
    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify(nextState.habits ?? []),
    );

    if (nextState.session) {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify(nextState.session),
      );
    } else {
      localStorage.removeItem("habit-tracker-session");
    }
  }, state);
}

test.beforeEach(async ({ page, context }) => {
  await resetBrowserState(page, context);
});

test.describe("Habit Tracker app", () => {
  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId("auth-login-email")).toBeVisible();
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await writeAppStorage(page, {
      users: [primaryUser],
      session: {
        userId: primaryUser.id,
        email: primaryUser.email,
      },
    });

    await page.goto("/");

    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId("auth-login-email")).toBeVisible();
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.getByTestId("auth-signup-email").fill("new@example.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    const session = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("habit-tracker-session") ?? "null"),
    );

    expect(session).toMatchObject({
      email: "new@example.com",
    });
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await writeAppStorage(page, {
      users: [primaryUser, secondaryUser],
      habits: [
        createHabit(),
        createHabit({
          id: "habit-secondary",
          userId: secondaryUser.id,
          name: "Hidden Habit",
          description: "Belongs to another user",
        }),
      ],
    });

    await page.goto("/login");
    await page.getByTestId("auth-login-email").fill(primaryUser.email);
    await page.getByTestId("auth-login-password").fill(primaryUser.password);
    await page.getByTestId("auth-login-submit").click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByTestId("habit-card-morning-meditation"),
    ).toBeVisible();
    await expect(page.getByTestId("habit-card-hidden-habit")).toHaveCount(0);
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await writeAppStorage(page, {
      users: [primaryUser],
      session: {
        userId: primaryUser.id,
        email: primaryUser.email,
      },
    });

    await page.goto("/dashboard");
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Read Books");
    await page
      .getByTestId("habit-description-input")
      .fill("Read twenty pages");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-read-books")).toBeVisible();

    const habits = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("habit-tracker-habits") ?? "[]"),
    );

    expect(habits).toHaveLength(1);
    expect(habits[0]).toMatchObject({
      userId: primaryUser.id,
      name: "Read Books",
      description: "Read twenty pages",
      frequency: "daily",
      completions: [],
    });
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await writeAppStorage(page, {
      users: [primaryUser],
      session: {
        userId: primaryUser.id,
        email: primaryUser.email,
      },
      habits: [createHabit()],
    });

    await page.goto("/dashboard");

    await expect(
      page.getByTestId("habit-streak-morning-meditation"),
    ).toContainText("0 day streak");

    await page.getByTestId("habit-complete-morning-meditation").click();

    await expect(
      page.getByTestId("habit-streak-morning-meditation"),
    ).toContainText("1 day streak");

    const completions = await page.evaluate(() => {
      const habits = JSON.parse(
        localStorage.getItem("habit-tracker-habits") ?? "[]",
      );
      return habits[0].completions;
    });

    expect(completions).toContain(today);
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await writeAppStorage(page, {
      users: [primaryUser],
      session: {
        userId: primaryUser.id,
        email: primaryUser.email,
      },
    });

    await page.goto("/dashboard");
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Journal");
    await page
      .getByTestId("habit-description-input")
      .fill("Write one paragraph");
    await page.getByTestId("habit-save-button").click();

    await page.reload();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-journal")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await writeAppStorage(page, {
      users: [primaryUser],
      session: {
        userId: primaryUser.id,
        email: primaryUser.email,
      },
      habits: [createHabit()],
    });

    await page.goto("/dashboard");
    await page.getByTestId("auth-logout-button").click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId("auth-login-email")).toBeVisible();

    const session = await page.evaluate(() =>
      localStorage.getItem("habit-tracker-session"),
    );

    expect(session).toBeNull();
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    await page.goto("/login");
    await expect(page.getByTestId("auth-login-email")).toBeVisible();

    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });

    await page.reload();
    await expect(page.getByTestId("auth-login-email")).toBeVisible();

    await context.setOffline(true);
    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("auth-login-email")).toBeVisible();

    await context.setOffline(false);
  });
});
