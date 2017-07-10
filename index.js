/**
 * Created by Kon on 6/17/17.
 */

'use strict';

require('dotenv').config();
const bofa = require('./src/bofa');
const BalanceDAO = require('./src/balance');

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
