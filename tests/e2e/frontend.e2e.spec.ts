import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('starter page renders branding and links', async ({ page }) => {
    await page.goto(process.env.E2E_BASE_URL ?? 'http://localhost:3000')
    await expect(page.locator('img[alt="Arthanova Studio"]').first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Open the CMS|Admin/i }).first()).toBeVisible()
  })
})
