// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import LoginForm from "../../src/components/auth/LoginForm";
import SignupForm from "../../src/components/auth/SignupForm";
import type { Session, User } from "../../src/types/auth";

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("auth flow", () => {
  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    const redirect = vi.fn();

    render(<SignupForm onSuccessRedirect={redirect} />);

    await user.type(screen.getByTestId("auth-signup-email"), "new@example.com");
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    const users = JSON.parse(
      localStorage.getItem("habit-tracker-users") ?? "[]",
    ) as User[];
    const session = JSON.parse(
      localStorage.getItem("habit-tracker-session") ?? "null",
    ) as Session;

    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({
      email: "new@example.com",
      password: "password123",
    });
    expect(session).toEqual({
      userId: users[0].id,
      email: "new@example.com",
    });
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for duplicate signup email", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify([
        {
          id: "user-1",
          email: "taken@example.com",
          password: "password123",
          createdAt: "2026-04-29T00:00:00.000Z",
        },
      ]),
    );

    render(<SignupForm onSuccessRedirect={vi.fn()} />);

    await user.type(screen.getByTestId("auth-signup-email"), "taken@example.com");
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    expect(screen.getByText("User already exists")).toBeTruthy();
    expect(localStorage.getItem("habit-tracker-session")).toBeNull();
  });

  it("submits the login form and stores the active session", async () => {
    const user = userEvent.setup();
    const redirect = vi.fn();

    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify([
        {
          id: "user-1",
          email: "member@example.com",
          password: "password123",
          createdAt: "2026-04-29T00:00:00.000Z",
        },
      ]),
    );

    render(<LoginForm onSuccessRedirect={redirect} />);

    await user.type(screen.getByTestId("auth-login-email"), "member@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "password123");
    await user.click(screen.getByTestId("auth-login-submit"));

    expect(
      JSON.parse(localStorage.getItem("habit-tracker-session") ?? "null"),
    ).toEqual({
      userId: "user-1",
      email: "member@example.com",
    });
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify([
        {
          id: "user-1",
          email: "member@example.com",
          password: "password123",
          createdAt: "2026-04-29T00:00:00.000Z",
        },
      ]),
    );

    render(<LoginForm onSuccessRedirect={vi.fn()} />);

    await user.type(screen.getByTestId("auth-login-email"), "member@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "wrong-password");
    await user.click(screen.getByTestId("auth-login-submit"));

    expect(screen.getByText("Invalid email or password")).toBeTruthy();
    expect(localStorage.getItem("habit-tracker-session")).toBeNull();
  });
});
