/**
 * Created by Kon on 6/17/17.
 */

'use strict';

require('dotenv').config();
const bofa = require('./src/bofa');
const BalanceDAO = require('./src/balance');

const Banking = require('banking');

const bank = Banking({
  fid: 5959
  , fidOrg: 'HAN'
  , url: 'https://eftx.bankofamerica.com/eftxweb/access.ofx'
  , bankId: '011000138' /* If bank account use your bank routing number otherwise set to null */
  , user: '*'
  , password: '*'
  , accId: '*' /* Account Number */
  , accType: 'CHECKING' /* CHECKING || SAVINGS || MONEYMRKT || CREDITCARD */
  , ofxVer: 102 /* default 102 */
  , app: 'QBW' /* default  'QWIN' */
  , appVer: '2300' /* default 1700 */
  , clientId: '*'


  // headers are only required if your ofx server is very picky, defaults below
  // add only the headers you want sent
  // the order in this array is also the order they are sent
  , headers: ['Host', 'Accept', 'User-Agent', 'Content-Type', 'Content-Length', 'Connection']
});

async function ofx() {
  bank.getStatement({start:20171001, end:20171023}, function(err, res){
    if(err) console.log(err);
    console.log(res);
  });
}

// ofx().then(() => { console.log('Done'); });

async function run() {
  try {
    const balances = await bofa.fetchBalances();
    console.log(balances);
    if (balances.length === 3) {
      await BalanceDAO.insertBalance(balances[0], balances[1], balances[2], 0, new Date());
    } else {
      console.log('Could not retrieve balances');
    }
  } catch (err) {
    console.log(`Error: ${err.stack}`);
  }
}

run().then(() => { console.log('Done'); });
