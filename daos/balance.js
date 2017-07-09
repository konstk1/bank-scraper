/**
 * Created by Kon on 7/8/17.
 */

'use strict';

const pool = require('../services/db');

module.exports = class BalanceDAO {
  static async insertBalance(operating, payroll, savings, creditCard) {
    let result;
    try {
      // const client = pool.connect();
      result = await pool.query(`
          INSERT INTO balances
          (
            operating,
            payroll,
            savings,
            credit_card,
            timestamp
          )
          VALUES
          ( 
            $1::double precision,
            $2::double precision,
            $3::double precision,
            $4::double precision,
            $5::timestamp with time zone
          );
        `, [
          operating,
          payroll,
          savings,
          creditCard,
          new Date(),
        ]);
    } catch (err) {
      console.log(['Error: ', err]);
    }
    return result;
  }
};
