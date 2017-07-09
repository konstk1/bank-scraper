/**
 * Created by Kon on 7/8/17.
 */

'use strict';

const pg = require('pg');

const config = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  max: 10,
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('error', (err, client) => {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.log('idle client error', err.message, err.stack, client);
});

// export the query method for passing queries to the pool
module.exports.query = (text, values, callback) => pool.query(text, values, callback);

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = callback => pool.connect(callback);
