import { expect, test } from '@playwright/test'

const adminResponse = (refreshToken = 'refresh', authority = 'MANAGER') => ({
  code: 200,
  message: '성공',
  data: { accessToken: 'test-access', refreshToken, authority },
})

test('비로그인 관리 페이지는 로그인으로 이동한다', async ({ page }) => {
  await page.goto('/review')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByLabel('로그인 아이디')).toBeVisible()
})

test('관리자 로그인 후 새로고침으로 세션을 복원하고 로그아웃한다', async ({ page }) => {
  await page.route('**/api/auth/**', async (route) => {
    const path = new URL(route.request().url()).pathname
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
      return
    }
    await route.fulfill({
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      json:
        path === '/api/auth/refresh' ? adminResponse('rotated-refresh') : adminResponse('refresh'),
    })
  })

  await page.goto('/login')
  await page.getByLabel('로그인 아이디').fill('admin')
  await page.getByLabel('비밀번호').fill('password')
  await page.getByRole('button', { name: '로그인', exact: true }).click()

  await expect(page).toHaveURL(/\/introduction$/)
  await expect(page.getByRole('heading', { name: '학회 소개', exact: true })).toBeVisible()
  expect(await page.evaluate(() => sessionStorage.getItem('kusitms-admin-refresh-token'))).toBe(
    'refresh',
  )

  await page.reload()
  await expect(page.getByRole('heading', { name: '학회 소개', exact: true })).toBeVisible()
  expect(await page.evaluate(() => sessionStorage.getItem('kusitms-admin-refresh-token'))).toBe(
    'rotated-refresh',
  )

  const logoutRequest = page.waitForRequest('**/api/auth/logout')
  await page.getByRole('button', { name: '로그아웃' }).click()
  expect((await logoutRequest).headers().authorization).toBe('Bearer test-access')
  await expect(page).toHaveURL(/\/login$/)
  expect(
    await page.evaluate(() => sessionStorage.getItem('kusitms-admin-refresh-token')),
  ).toBeNull()
})

test('일반 회원 계정은 관리자 페이지에 들어갈 수 없다', async ({ page }) => {
  await page.route('**/api/auth/signin', async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      json: adminResponse('member-refresh', 'MEMBER'),
    })
  })
  await page.goto('/login')
  await page.getByLabel('로그인 아이디').fill('member')
  await page.getByLabel('비밀번호').fill('password')
  await page.getByRole('button', { name: '로그인', exact: true }).click()

  await expect(page.getByRole('alert')).toHaveText('관리자 권한이 없는 계정입니다.')
  await expect(page).toHaveURL(/\/login$/)
  expect(
    await page.evaluate(() => sessionStorage.getItem('kusitms-admin-refresh-token')),
  ).toBeNull()
})
