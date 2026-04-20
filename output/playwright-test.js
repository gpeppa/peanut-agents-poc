const { chromium } = require('playwright');
const path = require('path');

const FILE_URL = `file://${path.resolve('index.html')}`;

const cases = [
  { input: 'user@example.com',          expectValid: true  },
  { input: 'name.surname@domain.co.uk', expectValid: true  },
  { input: 'notanemail',                expectValid: false },
  { input: 'missing@domain',            expectValid: false },
  { input: '@nodomain.com',             expectValid: false },
  { input: 'two@@at.com',              expectValid: false },
  { input: 'has space@email.com',       expectValid: false },
];

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  // Launch in headed mode with slowMo so every action is visible
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 800, height: 500 });

  console.log('🌐 Opening index.html in browser...');
  await page.goto(FILE_URL);
  await sleep(1000); // pause so user can see the initial page

  let passed = 0, failed = 0;

  for (const { input, expectValid } of cases) {
    console.log(`\n▶ Scenario: "${input}"`);

    // Clear input, type the value character by character so it looks natural
    await page.fill('#email-input', '');
    await page.type('#email-input', input, { delay: 80 });
    await sleep(400);

    // Click validate
    await page.click('#validate-btn');
    await sleep(600); // pause so result is visible

    const text = await page.textContent('#result');
    const classList = await page.$eval('#result', el => el.className);
    const isValid = classList.includes('valid') && !classList.includes('invalid');

    const ok = isValid === expectValid;
    console.log(`  ${ok ? '✓ PASS' : '✗ FAIL'} — result: "${text?.trim()}"`);
    ok ? passed++ : failed++;

    // Check result clears when typing starts again
    await page.type('#email-input', 'x', { delay: 80 });
    await sleep(300);
    const clearedClass = await page.$eval('#result', el => el.className);
    if (clearedClass.includes('valid') || clearedClass.includes('invalid')) {
      console.log('  ✗ FAIL — result did not clear when typing started');
      failed++;
    } else {
      console.log('  ✓ PASS — result cleared on new input');
      passed++;
    }

    await sleep(500); // pause between scenarios
  }

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`  ${passed} passed, ${failed} failed out of ${cases.length * 2} checks`);
  console.log('─'.repeat(40));

  await sleep(2000); // leave browser open so user can see final state
  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
