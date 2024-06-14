const { chromium } = require('playwright');
const { auto } = require('./src/auto');

const { OPENAI_API_KEY } = require('dotenv').config()

const options = {
  // debug: true,
  // model: 'gpt-3.5-turbo-0125',
  model: 'gpt-4o-2024-05-13',
  openaiApiKey: OPENAI_API_KEY,
  openaiBaseUrl: 'https://one.wisehood.ai/v1/',
  openaiProxy: 'http://localhost:1087'
};

(async () => {
  // 初始化浏览器和页面实例
  const browser = await chromium.launch({
    headless: false
  });
  const page = await browser.newPage();

  try {
    // 导航到主页
    // await page.goto('http://localhost:3000'); // 替换为实际 URL

    // `auto` 查询数据
    // const { query: headerText } = await auto('get the header text', { page }, options);

    await auto('open Google.com', { page }, options);

    // `auto` 执行动作
    // await auto(`Type "${headerText}" in the search box`, { page }, options);
    await auto(`Type chatgpt in the search box`, { page }, options);

    await auto(`Press enter to Search`, { page }, options);

    // await auto('open producthunt website', { page }, options);

    // const name = await auto('find the top 3 project name', { page }, options);

    // console.log('name', name)

    // await auto('open ', { page }, options);

    // `auto` 断言网页状态
    // const searchInputHasHeaderText = await auto(`Is the contents of the search box equal to "${headerText}"?`, { page }, options);

    // if (searchInputHasHeaderText) {
    //   console.log('Assertion passed: The search box contains the header text.');
    // } else {
    //     console.error('Assertion failed: The search box does not contain the header text.');
    // }

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    // 确保浏览器在完成时关闭
    await browser.close();
  }
})();