/**
 * Created by Kon on 6/17/17.
 */
"use strict";

require('dotenv').config();
const {WebDriver, Builder, By, until} = require('selenium-webdriver');
let driver = new Builder().forBrowser('chrome').build();

// let driver = WebDriver.attachToSession()
console.log('Bank scraper');

async function run() {
    await login();
}

async function login() {
    await driver.get('https://www.bankofamerica.com/');
    driver.switchTo().window(driver.getWindowHandle());     // bring window to front
    await driver.findElement(By.name('onlineId1')).sendKeys(process.env.BANK_USERNAME);
    await driver.findElement(By.name('passcode1')).sendKeys(process.env.BANK_PASSWORD);
    await driver.findElement(By.id('hp-sign-in-btn')).click();
    // await driver.wait(until.elementLocated(By.className('logged-in')), 10000);
}

// async function get_followers() {
//     if (profileLinks.length >= 100) {
//         console.log("Collected 100");
//         return
//     }
//     if (profileLinks.length > 0) {
//         const url = profileLinks.shift();
//         console.log('Visiting: ' + url);
//         try {
//             await driver.get(url);
//             await driver.sleep(2000);
//         } catch (error) {
//             console.log(error);
//         }
//     }
//
//     const followerListPath = "//*[text() = 'Following']/following::div/ul/li";
//     try {
//         await driver.wait(until.elementLocated(By.xpath("//a[contains(@href, 'following')]")), 10000).click();
//         await driver.wait(until.elementsLocated(By.xpath(followerListPath)), 5000);
//         await driver.sleep(2000);       // wait for list to load
//         const list = await driver.findElements(By.xpath(followerListPath));
//
//         const links = await Promise.all(list.map( item => {
//             // Promise.resolve(item.getAttribute('innerHTML')).then(val =>
//             //     console.log(val)
//             // );
//
//             return item.findElement(By.css('a')).getAttribute('href');
//         }));
//
//         console.log(links);
//         profileLinks = profileLinks.concat(links);
//         console.log('Now have ' + profileLinks.length + ' links');
//         get_followers();
//     } catch(error) {
//         console.log(error);
//     }
// }

run().then((result) => {
    console.log('Done');
    // driver.quit()
}).catch((error) => {
    console.log('Error: ' + error);
    driver.quit();
});