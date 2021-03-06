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
  await passwordInput.type('321');

  console.log('輸入完畢');

  // 監聽登入失敗的 alert
  const loginDialog = () => new Promise((resolve) => {
    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
      resolve(dialog.message());
    });
  });

  // 執行監聽，用新變數來等待 Promise {<pending>} 的狀態改變
  const startLoginDialog = loginDialog();

  console.log('按下 Enter');

  await page.keyboard.press('Enter');

  // 登入成功 - 跳轉頁面，可以取得頁面上的送出按鈕
  // 登入失敗 - 跳出 alert 訊息框，提前結束動作，關閉瀏覽器
  const elementOrMessage = await Promise.race([
    page.waitFor('body > app-root > app-record > button'),
    startLoginDialog,
  ]);

  if (elementOrMessage === '帳號或密碼錯誤！') {
    console.log(elementOrMessage);

    console.log('登入失敗，關閉瀏覽器');

    await closeBrowser();

    return;
  }

  console.log('已跳轉頁面');

  console.log('按下送出按鈕');

  await page.click('body > app-root > app-record > button');

  console.log('關閉瀏覽器');

  await page.waitFor(2000);

  await closeBrowser();
})();
