import { test, expect } from '@playwright/test'

test('/review 진입 시 사이드바 메뉴가 활성화되고 페이지 제목이 보인다', async ({ page }) => {
  await page.goto('/review')

  await expect(page.getByRole('link', { name: '후기', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(page.getByRole('heading', { name: '활동 후기 관리', exact: true })).toBeVisible()
})

test('/blog-review 진입 시 블로그 후기 메뉴와 별도 페이지가 보인다', async ({ page }) => {
  await page.goto('/blog-review')

  await expect(page.getByRole('link', { name: '블로그 후기', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(page.getByRole('heading', { name: '블로그 후기 관리', exact: true })).toBeVisible()
  await expect(page.getByText('프론트엔드 파트 활동 후기')).toBeVisible()
})

test('/ 진입 시 학회 소개 페이지로 이동한다', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/introduction$/)
  await expect(page.getByRole('heading', { name: '학회 소개', exact: true })).toBeVisible()
})

test('리스트에 후기 행이 렌더링된다', async ({ page }) => {
  await page.goto('/review')

  await expect(page.getByText('큐시즘 34기 서류 합격 후기').first()).toBeVisible()
})

test('추가하기 클릭 시 활동 후기 등록 모달이 열리고, 저장하면 목록에 새 행이 추가된다', async ({
  page,
}) => {
  await page.goto('/review')

  await page.getByRole('button', { name: '추가하기' }).click()
  await expect(page.getByRole('dialog', { name: '활동 후기 등록' })).toBeVisible()

  await page.getByLabel('이름').fill('테스트유저')
  await page.getByLabel('내용').fill('E2E 테스트 후기 내용입니다')
  await page.getByRole('button', { name: '저장하기' }).click()

  await expect(page.getByRole('dialog', { name: '활동 후기 등록' })).not.toBeVisible()
  await expect(page.getByText('테스트유저')).toBeVisible()
})

test('마지막 페이지의 마지막 행을 삭제하면 이전 페이지로 이동한다', async ({ page }) => {
  await page.goto('/review')

  for (const name of ['테스트유저1', '테스트유저2', '테스트유저3']) {
    await page.getByRole('button', { name: '추가하기' }).click()
    await page.getByLabel('이름').fill(name)
    await page.getByLabel('내용').fill('페이지네이션 테스트 후기 내용입니다')
    await page.getByRole('button', { name: '저장하기' }).click()
  }

  await page.getByRole('button', { name: '2' }).click()
  await page.getByRole('button', { name: '삭제' }).click()

  await expect(page.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('button', { name: '2' })).toHaveCount(0)
})
