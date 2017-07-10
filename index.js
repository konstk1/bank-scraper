/**
 * Created by Kon on 6/17/17.
 */

'use strict';

const bofa = require('./src/bofa');
const BalanceDAO = require('./src/balance');

exports.handler = async (event, context, callback) => {
  console.log(event);
  try {
    const balances = await bofa.fetchBalances();
    console.log(balances);
    if (balances.length === 3) {
      await BalanceDAO.insertBalance(balances[0], balances[1], balances[2], 0, new Date());
    } else {
      console.log('Could not retrieve balances');
    }
    callback(null, balances);
  } catch (err) {
    console.log(`Error: ${err}`);
    callback(err);
  }
};
