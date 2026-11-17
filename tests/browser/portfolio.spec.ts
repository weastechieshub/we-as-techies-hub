import { test, expect } from '@playwright/test';

test('homepage shows courses, the learning path, channels, and opens the roadmap', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'Learn AI engineering. One short lesson at a time.',
  );
  await expect(page.locator('header nav a')).toHaveText([
    'Courses',
    'Learning path',
    'How it works',
    'Roadmaps',
  ]);
  await expect(page.locator('.lx-course')).toHaveCount(2);
  await expect(page.locator('.lx-course a[href*="youtube.com/playlist"]')).toHaveCount(2);
  await expect(page.locator('.lx-course a[href*="facebook.com/watch"]')).toHaveCount(2);
  await expect(page.locator('.lx-stop h3')).toHaveText([
    'AI engineering',
    'System design',
    'Cloud & data',
    'Software engineering',
  ]);
  // Only Model selection has a roadmap so far; every other chip on the road is "Soon".
  await expect(page.locator('.lx-chip.is-live')).toHaveCount(1);
  await expect(page.locator('.lx-chip.is-live')).toHaveAttribute(
    'href',
    '/roadmaps/model-selection',
  );
  await expect(page.locator('.lx-chip:not(.is-live)')).toHaveCount(18);
  await expect(page.locator('.lx-runner')).toHaveCount(1);
  await expect(page.locator('.lx-channel')).toHaveText([
    'YouTube',
    'LinkedIn',
    'Facebook',
    'Instagram',
  ]);
  await expect(page.locator('.footer-channels a')).toHaveText([
    'YouTube',
    'LinkedIn',
    'Facebook',
    'Instagram',
  ]);
  await expect(
    page.locator('.footer-channels a[target="_blank"][rel="noopener noreferrer"]'),
  ).toHaveCount(4);

  // The guide head stays away in the hero, then follows you into Courses and speaks.
  await expect(page.locator('.lx-guide')).toHaveCount(0);
  await page.locator('#courses').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 200));
  await expect(page.locator('.lx-guide:not(.is-away) .lx-bubble')).toContainText('Start here', {
    timeout: 8000,
  });

  await page.locator('.lx-chip.is-live').click();
  await expect(page).toHaveURL('/roadmaps/model-selection');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Model selection');
  await expect(page.locator('#models .roadmap-title')).toHaveText('Models & inference');
  await expect(page.locator('#models .topic-article:not(.roadmap-more)')).toHaveCount(2);
  await expect(page.locator('#models .roadmap-more')).toHaveText(/More coming soon/);
  await expect(
    page.getByRole('heading', { name: 'Understand a model card', exact: true }),
  ).toBeVisible();
  // YouTube and Facebook link to the series playlists; the LinkedIn PDFs are still planned.
  await expect(page.locator('#models .article-actions a')).toHaveCount(4);
  await expect(
    page.locator('#models .article-actions a[href*="youtube.com/playlist"]'),
  ).toHaveCount(2);
  await expect(page.locator('#models .article-actions a[href*="facebook.com/watch"]')).toHaveCount(
    2,
  );
  await expect(page.locator('#models .article-coming-soon')).toHaveCount(2);
  await expect(page.locator('.roadmap-center button')).toHaveCount(0);
  await page.getByLabel('Search this roadmap').fill('lifecycle');
  await expect(page.locator('#models .article-card')).toHaveCount(1);
  await expect(page.locator('#models .roadmap-more')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('theme persists and mobile has no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveClass(/light/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/light/);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/roadmaps/model-selection', '/terms']) {
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
  expect(urls).toContain('/roadmaps/model-selection');
  expect(urls).toContain('/terms');
  expect(urls).not.toContain('/learn');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Allow: /');
  expect(await robots.text()).not.toContain('Disallow: /');
  // Old pages are gone.
  for (const route of ['/learn', '/writing', '/expertise', '/about', '/api/discover']) {
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
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.goto('/roadmaps/model-selection');
  await page.screenshot({ path: testInfo.outputPath('roadmap.png'), fullPage: true });
});

test('roadmap pages exist only for capabilities with articles', async ({ page }) => {
  await page.goto('/roadmaps');
  await expect(page).toHaveURL('/roadmaps/model-selection');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Model selection');
  await expect(page.getByRole('group', { name: 'Roadmaps' }).getByRole('button')).toHaveText([
    'Model selection',
  ]);
  await page.getByLabel('Search this roadmap').fill('astrophotography');
  await expect(page.getByText('No matching articles.', { exact: false })).toBeVisible();
  // Roadmap pages end with the same Keep learning section as the homepage.
  const keepLearning = page.locator('.lx-cta');
  await expect(keepLearning.getByRole('heading', { level: 2 })).toHaveText(
    'New lessons land on YouTube first.',
  );
  await expect(keepLearning.getByRole('link')).toHaveText([
    'YouTube',
    'LinkedIn',
    'Facebook',
    'Instagram',
  ]);
  for (const slug of ['microsoft-foundry', 'azure', 'typescript', 'model-evaluation']) {
    const response = await page.goto(`/roadmaps/${slug}`);
    expect(response?.status(), slug).toBe(404);
  }
});

test('article cards keep equal dimensions across link states', async ({ page }) => {
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/roadmaps/model-selection');
    const dimensions = await page.locator('.article-card').evaluateAll((cards) =>
      cards.map((card) => {
        const box = card.getBoundingClientRect();
        const actions = card.querySelector('.article-actions');
        return {
          width: Math.round(box.width),
          height: Math.round(box.height),
          overflow: card.scrollWidth > card.clientWidth,
          actionsFit: !actions || actions.getBoundingClientRect().bottom <= box.bottom,
        };
      }),
    );
    expect(dimensions.length).toBeGreaterThan(0);
    expect(new Set(dimensions.map((d) => d.width)).size).toBe(1);
    expect(new Set(dimensions.map((d) => d.height)).size).toBe(1);
    expect(dimensions.every((d) => !d.overflow && d.actionsFit)).toBe(true);
  }
});
