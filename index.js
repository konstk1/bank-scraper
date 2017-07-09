/**
 * Created by Kon on 6/17/17.
 */

'use strict';

const bofa = require('./services/bofa');
const BalanceDAO = require('./daos/balance');

exports.handler = async (event, context, callback) => {
  console.log(event);
  try {
    const balances = await bofa.fetchBalances();
    console.log(balances);
    await BalanceDAO.insertBalance(balances[0], balances[1], balances[2], 0, new Date());
    callback(null, balances);
  } catch (err) {
    console.log(`Error: ${err}`);
    callback(err);
  }
};
