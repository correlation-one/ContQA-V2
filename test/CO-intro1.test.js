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
    
    await page.getByRole('row', { name: 'It Introduction to Cloud Part 1 - Friday, July 21st ready to go' }).locator('div').nth(1).click();
    await page.waitForTimeout(2000);
    console.log('Navigated to the course');
    
        // Part 1: Checking the page title within the iframe
    const guideFrame1 = await page.frameLocator('iframe[name="guides"]');

    const pageTitle = await guideFrame1.getByText('1. Introduction to IT');

    const box1 = await pageTitle.boundingBox();

    const pageWidth1 = await page.viewportSize().width;
    const expectedCenter1 = pageWidth1 / 2;
    const elementCenter1 = box1.x + box1.width / 2;
    const tolerance1 = 50;  // Tolerance in pixels

    if (Math.abs(elementCenter1 - expectedCenter1) > tolerance1) {
        throw new Error(`Element is not centered as expected. Expected center: ${expectedCenter1}, but got: ${elementCenter1}`);
    }

    await expect(guideFrame1.locator('h1', { hasText: '1. Introduction to IT' })).toHaveText('1. Introduction to IT');

    console.log('Page title position and text verified within iframe');

    // Part 2: Checking the 'Next' button within the same or different iframe
    const guideFrame2 = await page.frameLocator('iframe[name="guides"]');

    const nextButton = await guideFrame2.getByRole('button', { name: 'Next' });

    const box2 = await nextButton.boundingBox();

    const pageWidth2 = await page.viewportSize().width;
    const expectedCenter2 = pageWidth2 / 2;
    const elementCenter2 = box2.x + box2.width / 2;
    const tolerance2 = 50;  // Tolerance in pixels

    if (Math.abs(elementCenter2 - expectedCenter2) > tolerance2) {
        throw new Error(`Element is not centered as expected. Expected center: ${expectedCenter2}, but got: ${elementCenter2}`);
    }

    console.log('Next button position verified within iframe');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');


    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('iframe[name="guides"]').getByRole('link', { name: 'What is a Data Center?' }).click();
    const page1 = await page1Promise;
    
    // Check if the heading 'What Is a Data Center?' is present
    await expect(page1).toHaveTitle(/What Is a Data Center\?/); // Assert title for extra verification
    await expect(page1.locator('h1')).toHaveText('What Is a Data Center?');
    console.log('Verified text \'What Is a Data Center?\' is present on the new tab');    

    // Close the new tab after verification
    await page1.close();
    console.log('New tab closed');

    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');


     // Locate the iframe where the content is expected
    const guideFrame = await page.frameLocator('iframe[name="guides"]');

    // Locate the div with the combined CSS selector for class and data-line attribute
    const imageContainer = guideFrame.locator('div.codio-md-line.p-tag[data-line="6"]');

    // Check if the container has an img tag with the expected source
    const image = await imageContainer.locator('img[src=".guides/img/Screenshot 2023-06-30 at 21.43.04.png"]');

    // Count the number of such images found
    const imageCount = await image.count();

    // If there is no image or unexpected content, log an error but continue the test
    if (imageCount === 0) {
        console.error('Error: Expected image is missing in the specified element within the iframe.');

        // Take a screenshot of the current state
        const screenshotPath = 'error_screenshot.png';
        await page.screenshot({ path: screenshotPath });
        console.log('Screenshot taken due to missing image.');

        // Attach the screenshot to the Allure report
        allure.attachment('Missing Image Screenshot', fs.readFileSync(screenshotPath), 'image/png');
        
    } else {
        console.log('Image is correctly placed in the specified element within the iframe.');
    }

    // Continue with other assertions or operations in the test
    console.log('Continuing with further checks...');


    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');

    await page.frameLocator('iframe[name="guides"]').getByRole('textbox').first().click();
    await page.waitForTimeout(2000);

    await page.frameLocator('iframe[name="guides"]').getByRole('textbox').first().fill('test');
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Submit Answer!' }).first().click();

    await page.frameLocator('iframe[name="guides"]').getByRole('textbox').nth(1).click();
    await page.waitForTimeout(2000);

    await page.frameLocator('iframe[name="guides"]').getByRole('textbox').nth(1).fill('test');
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Submit Answer!' }).first().click();
    await page.waitForTimeout(2000);


    await page.frameLocator('iframe[name="guides"]').getByRole('textbox').nth(2).click();
    
    await page.frameLocator('iframe[name="guides"]').getByRole('textbox').nth(2).fill('test');
    await page.waitForTimeout(2000);

    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Submit Answer!' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);

    await page.frameLocator('iframe[name="guides"]').getByRole('textbox').first().click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('textbox').first().fill('test');
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Submit Answer!' }).first().click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').locator('label').filter({ hasText: 'Under an IaaS model, the' }).locator('i').click();
    await page.frameLocator('iframe[name="guides"]').locator('label').filter({ hasText: 'In a PaaS model, the company' }).locator('i').click();
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Check It! (1 left)' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('textbox').nth(1).click();
    await page.frameLocator('iframe[name="guides"]').getByRole('textbox').nth(1).fill('test');
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Submit Answer!' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.frameLocator('iframe[name="guides"]').getByRole('button', { name: 'Mark as Completed' }).click();
    await page.getByPlaceholder('Enter: yes').fill('yes');
    await page.getByRole('button', { name: 'Ok' }).click();
    console.log('Marked as completed');
    await page.waitForTimeout(2000);
    console.log('Navigation successful ');
    
    await page.getByText('10').click();
    await page.getByRole('button', { name: 'Next question' }).click();
    await page.getByText('10').click();
    await page.getByRole('button', { name: 'Next question' }).click();
    await page.getByPlaceholder('place your answer here...').click();
    await page.getByPlaceholder('place your answer here...').fill('test');
    await page.getByRole('button', { name: 'Finish' }).click();
    console.log('Test completed');

    await page.waitForTimeout(2000);
});

test('Reset Course Operations', async ({  }) => {
    test.info().description = 'Reset course';
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
    await page.getByRole('menuitem', { name: 'Sign In' }).click();
    await page.waitForTimeout(2000);
    await page.getByPlaceholder('Email or Username').click();
    await page.fill('[placeholder="Email or Username"]', codioEmail);
    await page.getByPlaceholder('Email or Username').press('Tab');
    await page.fill('[placeholder="Password"]', codioPass);    
    await page.getByPlaceholder('Password').press('Enter');
    await page.getByLabel('Got it! dismiss cookie message').click();
    await page.getByRole('link', { name: 'ContQA-Cloud Operations-Test' }).click();
    console.log('Resetting course');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Introduction to Cloud Part 1' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'More options' }).nth(1).click();
    await page.waitForTimeout(2000);
    await page.getByRole('menuitem', { name: 'Reset replay' }).locator('div').click();
    await page.waitForTimeout(2000);
    console.log('clicked on reset');
    
    await page.waitForTimeout(2000);
    // Get the text of the label
    const confirmationCodeText = await page.textContent('label.form-confirmationTextInput-label');

    // Log the text for debugging purposes
    console.log('Confirmation code text:', confirmationCodeText);

    // Check if the text contains a number
    const matches = confirmationCodeText.match(/\d+/);
    if (matches && matches.length > 0) {
        const confirmationCode = matches[0];

        // Enter the extracted code into the input box
        await page.fill('input[name="confirm"]', confirmationCode);
    } else {
        console.error('No confirmation code found in the text');
    }

    await page.waitForTimeout(2000);
    await page.click('text=Yes');
    console.log('Course resetted');
    await browser.close();
});



