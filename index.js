/* eslint-disable no-console */
const puppeteer = require('puppeteer');

const state = {
  browser: null,
  page: null,
};

/**
 * 啟用 browser，開啟一個分頁 page
 * @returns browser, page
 */
async function launchBrowser() {
  if (!state.browser) {
    state.browser = await puppeteer.launch({
      headless: false, // 不使用 headless 模式，就會開啟瀏覽器來實際動作
      slowMo: 100, // 每個動作的間隔時間，方便觀察實際動作
    });
  }

  if (!state.page) {
    state.page = await state.browser.newPage(); // 開啟新分頁
  }

  return {
    browser: state.browser,
    page: state.page,
  };
}

async function closeBrowser() {
  const { browser } = await launchBrowser();

  if (browser.close) {
    browser.close();
  } else {
    console.error('未開啟瀏覽器');
  }
}

(async () => {
  const { page } = await launchBrowser();

  console.log('進入目標頁面進行登入動作');

  await page.goto('https://littlehorseboy.github.io/angular-for-puppeteer/dist/angular-for-puppeteer/');

  console.log('表單欄位輸入帳號密碼');

  const accountInput = await page.waitFor('body > app-root > app-login > div > div > form > div:nth-child(1) > input');
  await accountInput.type('123');

  const passwordInput = await page.$('body > app-root > app-login > div > div > form > div:nth-child(2) > input');
  await passwordInput.type('32');

  console.log('輸入完畢，按下 Enter');

  await page.keyboard.press('Enter');

  console.log('跳轉頁面');

  await page.waitFor('body > app-root > app-record > button');

  console.log('按下送出按鈕');

  await page.click('body > app-root > app-record > button');

  console.log('關閉瀏覽器');

  await page.waitFor(2000);

  await closeBrowser();
})();
