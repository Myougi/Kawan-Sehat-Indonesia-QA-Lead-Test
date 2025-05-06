import { test, expect } from '@playwright/test';

const pasienData = {
    v_givenName: 'Pasien',
    v_middleName: '',
    v_familyName: 'Satu',
    v_gender: 'M',
    v_dayOfBirth: '03',
    v_monthOfBirth: 'May',
    v_yearOfBirth: '1990',
    v_address1: 'Desa Penari',
    v_address2: 'Jakarta Barat',
    v_cityVillage: 'Jakarta',
    v_stateProvince: 'DKI Jakarta',
    v_country: 'Indonesia',
    v_postalCode: '10000',
    v_phone: '087784298239'
}

const pasienName = `${pasienData.v_givenName} ${pasienData.v_middleName} ${pasienData.v_familyName}`;

test.describe('Feature : Login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://o2.openmrs.org/openmrs/login.htm');
    });

    test('[WEB-001] Login dengan valid credentials', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
        await page.getByRole('textbox', { name: 'Password:' }).fill('Admin123');
        await page.locator('#sessionLocation > li:has-text("Registration Desk")').click();
        await page.getByRole('button', { name: 'Log In' }).click();
        await page.getByRole('heading', { name: 'Super User' }).waitFor({state: 'visible'});
        await expect(page.getByRole('heading', { name: 'Super User' })).toBeVisible();
    });

    test('[WEB-002] Login dengan valid credentials tanpa memilih location', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
        await page.getByRole('textbox', { name: 'Password:' }).fill('Admin123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.getByText('You must choose a location!')).toBeVisible();
    });

    test('[WEB-003] Login dengan username dan password kosong', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username:' }).fill('');
        await page.getByRole('textbox', { name: 'Password:' }).fill('');
        await page.locator('#sessionLocation > li:has-text("Registration Desk")').click();
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.locator('div#error-message')).toBeVisible();
    });

    test('[WEB-004] Login dengan invalid username dan valid password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username:' }).fill('sysadmin');
        await page.getByRole('textbox', { name: 'Password:' }).fill('Admin123');
        await page.locator('#sessionLocation > li:has-text("Registration Desk")').click();
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.locator('div#error-message')).toBeVisible();
    });

    test('[WEB-005] Login dengan valid username dan invalid password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
        await page.getByRole('textbox', { name: 'Password:' }).fill('Admin');
        await page.locator('#sessionLocation > li:has-text("Registration Desk")').click();
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.locator('div#error-message')).toBeVisible();
    });
});

test.describe('Feature : Register', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://o2.openmrs.org/openmrs/login.htm');
        await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
        await page.getByRole('textbox', { name: 'Password:' }).fill('Admin123');
        await page.locator('#sessionLocation > li:has-text("Registration Desk")').click();
        await page.getByRole('button', { name: 'Log In' }).click();
        await page.getByRole('heading', { name: 'Super User' }).waitFor({state: 'visible'});
        await page.getByRole('link', { name: 'Register a patient' }).last().click();
        await page.getByRole('heading', { name: 'Register a patient' }).waitFor({state: 'visible'});
    });

    test('[WEB-006] Register pasien baru', async ({ page }) => {
        
        await test.step('Set Pasien Name', async () => {
            await page.getByRole('textbox', { name: 'Given (required)' }).fill(pasienData.v_givenName);
            if (pasienData.v_middleName !== '') {
                await page.getByRole('textbox', { name: 'Middle' }).fill(pasienData.v_middleName);
            }
            await page.getByRole('textbox', { name: 'Family Name (required)' }).fill(pasienData.v_familyName);
        });
    
        await page.locator('#next-button').click();
    
        await test.step('Set Pasien Gender', async () => {
            await page.locator('select[name="gender"]').selectOption(pasienData.v_gender);
        });
        
        await page.locator('#next-button').click();
    
        await test.step('Set Pasien Birthdate', async () => {
            await page.locator('input[name="birthdateDay"]').fill(pasienData.v_dayOfBirth);
            await page.locator('select[name="birthdateMonth"]').selectOption(pasienData.v_monthOfBirth);
            await page.locator('input[name="birthdateYear"]').fill(pasienData.v_yearOfBirth);
        });
        
        await page.locator('#next-button').click();
    
        await test.step('Set Pasien Address', async () => {
            await page.locator('#address1').fill(pasienData.v_address1);
            await page.locator('#address2').fill(pasienData.v_address2);
            await page.locator('#cityVillage').fill(pasienData.v_cityVillage);
            await page.locator('#stateProvince').fill(pasienData.v_stateProvince);
            await page.locator('#country').fill(pasienData.v_country);
            await page.locator('#postalCode').fill(pasienData.v_postalCode);
        });
    
        await page.locator('#next-button').click();
    
        await test.step('Set Pasien Phone', async () => {
            await page.locator('input[name="phoneNumber"]').fill(pasienData.v_phone);
        });
    
        await page.locator('#next-button').click();
        await page.locator('#next-button').click();
        await page.getByRole('button', { name: 'Confirm' }).click();
    });
});

test.describe('Feature : Pasien Record', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://o2.openmrs.org/openmrs/login.htm');
        await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
        await page.getByRole('textbox', { name: 'Password:' }).fill('Admin123');
        await page.locator('#sessionLocation > li:has-text("Registration Desk")').click();
        await page.getByRole('button', { name: 'Log In' }).click();
        await page.getByRole('heading', { name: 'Super User' }).waitFor({state: 'visible'});
        await page.getByRole('link', { name: 'Find Patient Record' }).click();
        await page.getByRole('heading', { name: 'Find Patient Record' }).waitFor({state: 'visible'});
    });

    test('Search for patient', async ({ page }) => {

        await test.step('Search by Name', async () => {
            await page.locator('#patient-search').fill(pasienName);
            await page.locator('#patient-search').press('Enter');
        });
    
        await test.step('Verify Pasien Name', async () => {
            expect(await page.getByRole('cell', { name: pasienName }).isVisible());
        });
    });
});