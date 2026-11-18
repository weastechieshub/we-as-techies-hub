import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('primary pages meet automated WCAG AA checks in both themes', async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const theme of ['dark', 'light']) {
    for (const route of ['/', '/terms']) {
      await page.goto(route);
      if (
        theme === 'light' &&
        (await page.locator('html').getAttribute('class'))?.includes('dark')
      ) {
        await page.getByRole('button', { name: 'Switch to light theme' }).click();
      }
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect
        .soft(
          results.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
          })),
          `${route} ${theme}`,
        )
        .toEqual([]);
    }
  }
});
