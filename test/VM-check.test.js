require('dotenv').config();
const { test, chromium, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const fs = require('fs');

test('CO Intro 1', async () => {
    test.info().description = 'Intro to codio 2';
    test.setTimeout(360000); // Setting timeout for this specific test

    const credentials = JSON.parse(process.env.CREDENTIALS);
    const codioEmail = credentials.codioemail;
    const codioPass = credentials.codiopass;

    const browser = await chromium.launch({
        headless: true // Ensure the browser runs in headless mode
    });
    const context = await browser.newContext();
    const page = await context.newPage();


    await page.goto('https://codio.com/');
    // Assert the current URL to ensure navigation was successful
    await expect(page).toHaveURL('https://www.codio.com/');
    console.log('CODIO url verified')

    const signInButton = page.getByRole('menuitem', { name: 'Sign In' });
    await expect(signInButton).toBeVisible(); // Ensure the Sign In button is visible
    await signInButton.click();
    console.log('Sign in button clicked')


    await page.getByPlaceholder('Email or Username').click();
    await page.fill('[placeholder="Email or Username"]', codioEmail);
    await page.getByPlaceholder('Email or Username').press('Tab');
    await page.fill('[placeholder="Password"]', codioPass);    
    await page.getByPlaceholder('Password').press('Enter');
    await page.getByLabel('Got it! dismiss cookie message').click();
    await page.getByText('ContQA-Cloud Operations-Test').click();
    await page.getByRole('button', { name: 'Introduction to Cloud Part 1' }).click();
    console.log('Clicked on Introduction to Cloud Part 1');

    // Wait for the role to be ready
    const moreOptionsButtons = page.locator('role=button[name="More options"]');

    // Ensure there are at least two instances if you want to click the second one
    await expect(moreOptionsButtons).toHaveCount(3);
    const secondMoreOptionsButton = moreOptionsButtons.nth(1);
    await secondMoreOptionsButton.waitFor({ state: 'visible' });

    // Click the button
    await secondMoreOptionsButton.click();
    await page.getByRole('menuitem', { name: 'Login as' }).click();
    
    await page.waitForTimeout(2000);
    console.log('Logged in as student');
    await page.waitForTimeout(5000);
    await page.getByRole('link', { name: 'usergroup Courses' }).click();
    await page.getByRole('link', { name: 'Test VM' }).click();
    const startTime = Date.now(); // Start time before clicking 'Lesson'
    await page.getByRole('cell', { name: 'Lesson' }).click();
    console.log('Lesson clicked, starting timer.');

    try {
        await page.waitForSelector('text=Virtual machine is ready.', { timeout: 60000 });
        const endTime = Date.now(); // End time after text appears
        const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds

        console.log(`The text "Virtual machine is ready." appeared after ${elapsedTime} seconds.`);
    } catch (error) {
        console.error('The text "Virtual machine is ready." did not appear within the expected time:', error);
    }      
    // Interact with the element within the iframe
    try {
        const frame = page.frameLocator('#codio-vm-iframes iframe');
        await frame.getByTitle('Hide/Show the control bar').click();
        console.log('Successfully clicked on "Hide/Show the control bar"');
    } catch (error) {
        console.error('Failed to interact with "Hide/Show the control bar":', error);
        test.fail('Test ended with failure due to inability to interact with the virtual machine.');
    }
});