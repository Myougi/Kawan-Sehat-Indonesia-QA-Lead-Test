import { test, expect } from '@playwright/test';

const pasienData = {
    givenName: 'Pasien',
    middleName: '',
    familyName: 'Dua',
    gender: 'M',
    dayOfBirth: '03',
    monthOfBirth: 'May',
    yearOfBirth: '1990',
    address1: 'Desa Penari',
    address2: 'Jakarta Barat',
    cityVillage: 'Jakarta',
    stateProvince: 'DKI Jakarta',
    country: 'Indonesia',
    postalCode: '10000',
    phone: '087784298239'
}

const pasienName = `${pasienData.givenName} ${pasienData.middleName} ${pasienData.familyName}`

test.beforeEach(async ({ page }) => {
    await page.goto('https://o2.openmrs.org/openmrs/login.htm');
    await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password:' }).fill('Admin123');
    await page.locator('#sessionLocation > li:has-text("Registration Desk")').click();
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('heading', { name: 'Super User' }).waitFor({state: 'visible'});
});

test('Register new patient', async ({ page }) => {
    await page.getByRole('link', { name: 'Register a patient' }).click();
    await page.getByRole('heading', { name: 'Register a patient' }).waitFor({state: 'visible'});
    
    await test.step('Set Pasien Name', async () => {
        await page.getByRole('textbox', { name: 'Given (required)' }).fill(pasienData.givenName);
        if (pasienData.middleName !== '') {
            await page.getByRole('textbox', { name: 'Middle' }).fill(pasienData.middleName);
        }
        await page.getByRole('textbox', { name: 'Family Name (required)' }).fill(pasienData.familyName);
    });

    await page.locator('#next-button').click();

    await test.step('Set Pasien Gender', async () => {
        await page.locator('select[name="gender"]').selectOption(pasienData.gender);
    });
    
    await page.locator('#next-button').click();

    await test.step('Set Pasien Birthdate', async () => {
        await page.locator('input[name="birthdateDay"]').fill(pasienData.dayOfBirth);
        await page.locator('select[name="birthdateMonth"]').selectOption(pasienData.monthOfBirth);
        await page.locator('input[name="birthdateYear"]').fill(pasienData.yearOfBirth);
    });
    
    await page.locator('#next-button').click();

    await test.step('Set Pasien Address', async () => {
        await page.locator('#address1').fill(pasienData.address1);
        await page.locator('#address2').fill(pasienData.address2);
        await page.locator('#cityVillage').fill(pasienData.cityVillage);
        await page.locator('#stateProvince').fill(pasienData.stateProvince);
        await page.locator('#country').fill(pasienData.country);
        await page.locator('#postalCode').fill(pasienData.postalCode);
    });

    await page.locator('#next-button').click();

    await test.step('Set Pasien Phone', async () => {
        await page.locator('input[name="phoneNumber"]').fill(pasienData.phone);
    });

    await page.locator('#next-button').click();
    await page.locator('#next-button').click();

    await page.getByRole('button', { name: 'Confirm' }).click();
});

test('Search for patient', async ({ page }) => {
    await page.getByRole('link', { name: 'Find Patient Record' }).click();
    await page.getByRole('heading', { name: 'Find Patient Record' }).waitFor({state: 'visible'});
    
    await test.step('Search by Name', async () => {
        await page.locator('#patient-search').fill(pasienName);
        await page.locator('#patient-search').press('Enter');
    });

    await test.step('Verify Pasien Name', async () => {
        expect(await page.getByRole('cell', { name: pasienName }).isVisible());
    });
});