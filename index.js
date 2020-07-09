const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // 不使用 headless 模式，就會開啟瀏覽器來實際動作
    slowMo: 100, // 每個動作的間隔時間，方便觀察實際動作
  });

  const page = await browser.newPage(); // 開啟新分頁

  await page.goto('https://littlehorseboy.github.io/angular-for-puppeteer/dist/angular-for-puppeteer/');

  const accountInput = await page.waitFor('body > app-root > app-login > div > div > form > div:nth-child(1) > input');
  await accountInput.type('123');

  const passwordInput = await page.$('body > app-root > app-login > div > div > form > div:nth-child(2) > input');
  await passwordInput.type('321');

  await page.keyboard.press('Enter');

  await page.waitFor('body > app-root > app-record > button');

  await page.waitFor(2000);

  browser.close();
})();
