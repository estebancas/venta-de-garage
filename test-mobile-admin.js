const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12'];
  const context = await browser.newContext({
    ...iPhone,
  });

  const page = await context.newPage();

  // Navigate to admin login
  console.log('Navigating to admin login...');
  await page.goto('http://localhost:3000/admin');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Fill in login credentials
  console.log('Logging in...');
  await page.fill('input[type="email"]', 'admin@gmail.com');
  await page.fill('input[type="password"]', 'Qwerty123');
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
  console.log('Successfully logged in to dashboard');

  // Take screenshot of dashboard
  await page.screenshot({ path: 'dashboard-mobile.png', fullPage: true });
  console.log('Screenshot saved: dashboard-mobile.png');

  // Navigate to products page
  console.log('Navigating to products page...');
  await page.click('a[href="/admin/products"]');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'products-mobile.png', fullPage: true });
  console.log('Screenshot saved: products-mobile.png');

  // Navigate to categories page
  console.log('Navigating to categories page...');
  await page.click('a[href="/admin/categories"]');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'categories-mobile.png', fullPage: true });
  console.log('Screenshot saved: categories-mobile.png');

  // Navigate to orders page
  console.log('Navigating to orders page...');
  await page.click('a[href="/admin/orders"]');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'orders-mobile.png', fullPage: true });
  console.log('Screenshot saved: orders-mobile.png');

  console.log('\nMobile testing complete! Check the screenshots.');
  console.log('Keeping browser open for manual inspection...');

  // Keep browser open for manual inspection
  // await browser.close();
})();
