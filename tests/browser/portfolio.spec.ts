import { test, expect } from '@playwright/test';

test('the homepage is the role roadmap, with its menu, channels and footer', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Engineer to AI Engineer to FDE / AI Architect',
  );
  // The homepage is the roadmap, so the menu has no link to it: only the labs, as a label until
  // they open. The logo leads home.
  await expect(page.locator('header nav a')).toHaveCount(0);
  await expect(page.locator('header nav .nav-soon')).toHaveText('Labs Soon');
  await expect(page.locator('header a.brand')).toHaveAttribute('href', '/');
  await expect(page.locator('.rm-sec h2')).toHaveText([
    'Software Engineering Base',
    'Level 1: Practitioner',
    'Level 2: Professional',
    'Level 3: Expert',
    'Beyond: FDE and AI Architect',
  ]);
  // A flag stands at the end of the section that leads to that job title.
  await expect(page.locator('.rm-flag-t')).toHaveCount(3);
  await expect(page.locator('#base .rm-flag-t')).toHaveText('Engineer');
  await expect(page.locator('#level-2 .rm-flag-t')).toHaveText('AI Engineer');
  await expect(page.locator('#level-3 .rm-flag-t')).toHaveText('FDE / AI Architect');
  await expect(page.locator('.lx-channel')).toHaveText([
    'YouTube',
    'LinkedIn',
    'Facebook',
    'Instagram',
  ]);
  await expect(page.locator('.lx-channel[target="_blank"][rel="noopener noreferrer"]')).toHaveCount(
    4,
  );
  // The footer keeps only Terms and Back to top.
  await expect(page.locator('footer a')).toHaveText(['Terms', 'Back to top']);
  // The guide head drops into the corner and speaks.
  await expect(page.locator('.lx-guide:not(.is-away) .lx-bubble')).toContainText('Glowing skills', {
    timeout: 8000,
  });
  expect(errors).toEqual([]);
});

test('a skill with lessons opens them, lab first, with every link marked coming soon', async ({
  page,
}) => {
  await page.goto('/');
  // Only a skill with lessons is lit.
  const lit = page.locator('.rm-blk.is-live');
  await expect(lit).toHaveCount(1);
  await expect(lit).toContainText('Foundry and models');
  await lit.click();
  const lessons = page.getByRole('dialog', { name: 'Foundry and models lessons' });
  await expect(lessons.locator('.rm-row')).toHaveCount(7);
  // No lesson link is up yet, so nothing in the list links out.
  await expect(lessons.locator('a')).toHaveCount(0);
  for (const channel of ['YouTube', 'Facebook', 'LinkedIn'])
    await expect(lessons.getByRole('img', { name: `${channel}: coming soon` })).toHaveCount(7);
  // The lab comes first in every lesson.
  await expect(lessons.locator('.rm-acts > :first-child')).toHaveText(Array(7).fill('Lab soon'));
  await page.keyboard.press('Escape');
  await expect(lessons).toHaveCount(0);
  await expect(lit).toBeFocused();
});

test('theme persists and mobile has no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveClass(/light/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/light/);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/terms']) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  }
});

test('metadata, indexing, and removed pages', async ({ request, page }) => {
  const home = await request.get('/');
  const html = await home.text();
  expect(html).not.toContain('noindex');
  expect(html).not.toContain('preview-banner');
  expect(html).toContain('rel="canonical"');
  expect(html).toContain('"@type":"WebSite"');
  const sitemap = await request.get('/sitemap.xml');
  const urls = await sitemap.text();
  expect(urls).toContain('/terms');
  expect(urls).not.toContain('/roadmaps');
  expect(urls).not.toContain('/learn');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Allow: /');
  expect(await robots.text()).not.toContain('Disallow: /');
  // Old pages are gone.
  for (const route of [
    '/learn',
    '/writing',
    '/expertise',
    '/about',
    '/api/discover',
    '/roadmaps',
    '/roadmaps/model-selection',
  ]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(404);
  }
});

test('capture desktop and mobile previews', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: testInfo.outputPath('homepage-dark.png'), fullPage: true });
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.screenshot({ path: testInfo.outputPath('homepage-light.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: testInfo.outputPath('homepage-mobile.png'), fullPage: true });
});
