// playwright.config.js
const { devices } = require('@playwright/test');

module.exports = {
  // Define browsers and devices
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        browserName: 'chromium',
        ...devices['Desktop Chrome'],
        // // You can specify browser options here
        // headless: true,
      },
    },
    // {
    //   name: 'Desktop Firefox',
    //   use: {
    //     browserName: 'firefox',
    //     ...devices['Desktop Firefox'],
    //     // You can specify browser options here
    //     headless: true,
    //   },
    // },
    // {
    //   name: 'Desktop Safari',
    //   use: {
    //     browserName: 'Safari',
    //     ...devices['Desktop Safari'],
    //     // You can specify browser options here
    //     headless: true,
    //   },
    // },
    // You can add more browsers or device configurations here if needed
  ],

  // Use Allure reporter
  reporter: [['allure-playwright']],

  // Retry failed tests, set to 0 or desired retry count
  retries: 0,

  // Output directory for test results
  outputDir: 'test-results/',

  // Configure the test environment
  testDir: './test',
  
  // Directory where your tests are located
  testMatch: '**/*.test.js', // Pattern to match test files

  afterEach: async ({ page, testInfo }) => {
    if (testInfo.status === 'failed') {
      // Save the screenshot in the output directory with a name based on the test
      await page.screenshot({ path: `test-results/${testInfo.title.replace(/ /g, '_')}-screenshot.png` });
    }
  },
};