import { expect, test, type Page } from '@playwright/test'

import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

test.describe('Admin panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    page = await (await browser.newContext()).newPage()
    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('dashboard shows the welcome heading, live overview and recent pages', async () => {
    await page.goto(`${BASE}/admin`)
    await expect(page.getByRole('heading', { level: 1, name: /Welcome back/ })).toBeVisible()
    await expect(page.locator('.arth-dash__meta')).toContainText('Administrator')
    await expect(page.locator('.arth-overview__cell').first()).toBeVisible()
    await expect(page.getByRole('link', { name: /New page/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Recently edited' })).toBeVisible()
  })

  test('sidebar shows brand, grouped navigation and account area', async () => {
    await expect(page.locator('.arth-nav-brand')).toBeVisible()
    await expect(page.locator('#nav-pages')).toBeVisible()
    await expect(page.locator('.arth-nav-account__name')).toContainText(testUser.name)
  })

  test('can open the users list and the create-user form', async () => {
    await page.goto(`${BASE}/admin/collections/users`)
    await expect(page.locator('h1', { hasText: 'Users' }).first()).toBeVisible()
    await page.goto(`${BASE}/admin/collections/users/create`)
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })
})
