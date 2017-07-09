/**
 * Created by Kon on 7/8/17.
 */

'use strict';

const AWS = require('aws-sdk');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');

const kms = new AWS.KMS();
// Set up path for phantom
const phantomPath = path.join(__dirname, '../node_modules/phantomjs/lib/phantom/bin');
process.env.PATH = `${process.env.PATH}:${phantomPath}`;
const driver = new Builder().forBrowser('phantomjs').build();

function getCredential(encrypted) {
  return new Promise((resolve, reject) => {
    kms.decrypt({ CiphertextBlob: new Buffer(encrypted, 'base64') }, (err, data) => {
      if (err) {
        console.log('Decrypt error:', err);
        reject(err);
      } else {
        const decrypted = data.Plaintext.toString();
        resolve(decrypted);
      }
    });
  });
}
async function login(username, password) {
  await driver.get('https://www.bankofamerica.com/');
  driver.switchTo().window(driver.getWindowHandle());     // bring window to front
  await driver.findElement(By.name('onlineId1')).sendKeys(username);
  await driver.findElement(By.name('passcode1')).sendKeys(password);
  await driver.findElement(By.id('hp-sign-in-btn')).click();
  try {
    console.log('Answering question');
    const question = await driver.wait(until.elementLocated(By.xpath("//label[contains(@for,'tlpvt-challenge-answer')]")), 5000).getAttribute('textContent');
    let answer = '';
    if (question.includes('city')) {
      answer = await getCredential(process.env.BOFA_2FA_QCITY);
    } else if (question.includes('first pet')) {
      answer = await getCredential(process.env.BOFA_2FA_QPET);
    } else if (question.includes('manager')) {
      answer = await getCredential(process.env.BOFA_2FA_QMGR);
    } else {
      console.log('Unknown question: ', question);
      console.log(await driver.getPageSource());
    }
    await driver.findElement(By.name('challengeQuestionAnswer')).sendKeys(answer);
    await driver.findElement(By.id('no-recognize')).click();
    console.log('Don\'t remember');
    await driver.findElement(By.name('challenge-question-submit')).click();
  } catch (err) {
    console.log('No challenge question: ', err);
  }
  await driver.wait(until.elementLocated(By.className('AccountName')), 10000);
}

async function getBalances() {
  const accountBalanceXPath = "//span[a[@name = 'DDA_SB_details' or @name = 'SDA_SB_details']]/following-sibling::div[1]/span";
  const list = await driver.findElements(By.xpath(accountBalanceXPath));

  let balances = await Promise.all(list.map(item => item.getAttribute('innerHTML')));

  balances = balances.map((item) => {
    const balanceStr = item.replace(/[,$]/g, '');
    return parseFloat(balanceStr);
  });

  return balances;
}

async function fetchBalances() {
  const username = await getCredential(process.env.BOFA_USERNAME);
  const password = await getCredential(process.env.BOFA_PASS);
  await login(username, password);
  const balances = getBalances();
  driver.quit();
  return balances;
}

module.exports.fetchBalances = fetchBalances;
