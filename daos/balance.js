/**
 * Created by Kon on 7/8/17.
 */

'use strict';

const pool = require('../services/db');

module.exports = class BalanceDAO {

  static async insertBalance(operating, payroll, savings, creditCard, timestamp) {
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
            $5::timestamp without time zone
          );
        `, [
          operating,
          payroll,
          savings,
          creditCard,
          timestamp,
        ]);
    } catch (err) {
      console.log(['Error: ', err]);
      return false;
    }
    return result;
  }

  static async currentBalance() {
    let result;
    try {
      result = await pool.query(`
        SELECT * FROM balances ORDER BY timestamp DESC LIMIT 1
      `);
      if (result.rows.length > 0) {
        result = result.rows[0];
      }
    } catch (err) {
      console.log(`Error: ${err}`);
      return false;
    }
    return result;
  }
};
