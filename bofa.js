/**
 * Created by Kon on 7/8/17.
 */
const AWS = require('aws-sdk');
const { Builder, By, until } = require('selenium-webdriver');

const kms = new AWS.KMS();
const driver = new Builder().forBrowser('chrome').build();

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
  await driver.wait(until.elementLocated(By.className('AccountName')), 10000);
  const accountBalanceXPath = "//span[a[@name = 'DDA_SB_details' or @name = 'SDA_SB_details']]/following-sibling::div[1]/span";
  const list = await driver.findElements(By.xpath(accountBalanceXPath));

  let balances = await Promise.all(list.map(item => item.getAttribute('innerHTML')));

  balances = balances.map((item) => {
    const balanceStr = item.replace(/[,$]/g, '');
    return parseFloat(balanceStr);
  });

  console.log(balances);
}

async function run() {
  const username = await getCredential(process.env.BOFA_USERNAME);
  const password = await getCredential(process.env.BOFA_PASS);
  console.log(`${username} : ${password}`);
  await login(username, password);
}

module.exports.run = run;
