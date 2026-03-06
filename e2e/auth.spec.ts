/**
 * E2E tests for Authentication flows
 *
 * Covers: sign up (buyer & creator), login, forgot password
 */

import { test, expect } from '@playwright/test';

// ─── Helpers ────────────────────────────────────────────────────────────────

const uniqueEmail = () => `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`;

// ─── Sign Up ────────────────────────────────────────────────────────────────

test.describe('Sign Up', () => {
  test('buyer can sign up successfully', async ({ page }) => {
    await page.goto('/signup');

    const email = uniqueEmail();

    await page.getByLabel(/full name/i).fill('E2E Buyer');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill('StrongPass1');

    // Select buyer role ("Shop Live")
    await page.getByText('Shop Live').click();

    // Submit
    await page.getByRole('button', { name: /create my account/i }).click();

    // Should redirect to login or show success
    await expect(page.getByText(/account created|welcome|log in/i)).toBeVisible({ timeout: 10000 });
  });

  test('creator can sign up successfully', async ({ page }) => {
    await page.goto('/signup');

    const email = uniqueEmail();

    await page.getByLabel(/full name/i).fill('E2E Creator');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill('StrongPass1');

    // Select creator role ("Go Live")
    await page.getByText('Go Live').click();

    await page.getByRole('button', { name: /create my account/i }).click();

    await expect(page.getByText(/account created|welcome|log in/i)).toBeVisible({ timeout: 10000 });
  });

  test('sign up shows validation errors for empty form', async ({ page }) => {
    await page.goto('/signup');

    await page.getByRole('button', { name: /create my account/i }).click();

    // Should show validation messages
    await expect(page.getByText(/name is required|email is required/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('sign up shows error for duplicate email', async ({ page }) => {
    // First, create an account
    await page.goto('/signup');
    const email = uniqueEmail();

    await page.getByLabel(/full name/i).fill('First User');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill('StrongPass1');
    await page.getByText('Shop Live').click();
    await page.getByRole('button', { name: /create my account/i }).click();

    await page.waitForTimeout(2000);

    // Try to sign up with the same email
    await page.goto('/signup');
    await page.getByLabel(/full name/i).fill('Second User');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill('StrongPass1');
    await page.getByText('Shop Live').click();
    await page.getByRole('button', { name: /create my account/i }).click();

    await expect(page.getByText(/already exists|duplicate/i)).toBeVisible({ timeout: 10000 });
  });
});

// ─── Login ──────────────────────────────────────────────────────────────────

test.describe('Login', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });

  test('login shows validation errors for empty form', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page.getByText(/email is required|password is required/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('login shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill('nonexistent@test.com');
    await page.getByLabel(/password/i).fill('WrongPassword1');
    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page.getByText(/invalid|incorrect|not found|credentials/i)).toBeVisible({
      timeout: 10000,
    });
  });
});

// ─── Forgot Password ───────────────────────────────────────────────────────

test.describe('Forgot Password', () => {
  test('forgot password page renders and accepts email', async ({ page }) => {
    await page.goto('/forgot-password');

    await expect(page.getByLabel(/email/i)).toBeVisible();

    await page.getByLabel(/email/i).fill('user@test.com');
    await page.getByRole('button', { name: /reset|send/i }).click();

    // Should confirm link has been sent (or similar)
    await expect(page.getByText(/reset link|email|sent/i)).toBeVisible({ timeout: 10000 });
  });
});
