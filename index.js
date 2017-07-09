/**
 * Created by Kon on 6/17/17.
 */

'use strict';

// const bofa = require('./services/bofa');
const BalanceDAO = require('./daos/balance');

exports.handler = async (event, context, callback) => {
  console.log(event);
  try {
    // await bofa.run();
    await BalanceDAO.insertBalance(10, 20, 30, 40);
    callback(null);
  } catch (err) {
    console.log('Error');
    callback(err);
  }
};
