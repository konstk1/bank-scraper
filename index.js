/**
 * Created by Kon on 6/17/17.
 */

const bofa = require('./bofa.js');

exports.handler = async (event, context, callback) => {
  console.log(event);
  try {
    await bofa.run();
    callback(null);
  } catch (err) {
    console.log('Error');
    callback(err);
  }
};
