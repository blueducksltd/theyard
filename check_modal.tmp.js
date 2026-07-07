const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));

  await page.goto('http://localhost:3001/v2/gallery', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  // Click the first gallery tile
  const tiles = page.locator('div.grid.grid-cols-6 > div.relative.rounded-lg');
  const count = await tiles.count();
  console.log('TILE_COUNT=' + count);
  if (count === 0) {
    console.log('NO_TILES_FOUND');
    await page.screenshot({ path: 'C:/Users/nsude/AppData/Local/Temp/claude/c--Dev-theyard/bb1c5a74-4916-46a9-b3b2-1bf5790df602/scratchpad/gallery-page.png', fullPage: true });
    await browser.close();
    return;
  }

  await tiles.first().click();
  await page.waitForTimeout(800);

  // Find the fixed overlay (dark backdrop)
  const overlay = page.locator('div.fixed.bg-black\\/40').first();
  const overlayExists = await overlay.count();
  console.log('OVERLAY_EXISTS=' + overlayExists);

  if (overlayExists > 0) {
    const box = await overlay.boundingBox();
    console.log('OVERLAY_BOX=' + JSON.stringify(box));
    const viewport = page.viewportSize();
    console.log('VIEWPORT=' + JSON.stringify(viewport));
  }

  await page.screenshot({ path: 'C:/Users/nsude/AppData/Local/Temp/claude/c--Dev-theyard/bb1c5a74-4916-46a9-b3b2-1bf5790df602/scratchpad/modal-open.png', fullPage: false });

  console.log('CONSOLE_ERRORS=' + JSON.stringify(consoleErrors));

  await browser.close();
})();
