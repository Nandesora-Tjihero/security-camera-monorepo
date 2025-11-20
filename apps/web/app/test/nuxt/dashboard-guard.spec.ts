import { expect } from '@nuxt/test-utils/playwright';
import { createPage, setup } from '@nuxt/test-utils/e2e';
import { describe, it } from 'vitest';

describe.todo('Dashboard Page Guard', async () => {
  await setup({});

  it('redirects unauthenticated users to /auth', async () => {
    const page = await createPage('/dashboard');

    expect(page.url()).toMatch(/\/auth/);
    await expect(page.getByTestId('auth-page')).toBeVisible();
  });

  it('createPage:allows authenticated users to access /dashboard', async () => {
    const page = await createPage('/dashboard', {
      extraHTTPHeaders: {
        'x-testing': 'true',
      },
    });

    // Expect dashboard content
    expect(page.url()).toMatch(/\/dashboard/);
    await expect(page.getByTestId('dashboard-title')).toBeVisible();
  });
});
