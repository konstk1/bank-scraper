/**
 * Created by Kon on 7/10/17.
 */

'use strict';

const AWS = require('aws-sdk');

const BUCKET_NAME = 'bank-scraper';

async function saveToS3(payload, path) {
  const s3 = new AWS.S3();
  const buffer = new Buffer(payload.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const param = {
    Key: path,
    Bucket: BUCKET_NAME,
    ContentType: 'image/jpeg',
    ContentEncoding: 'base64',
    Body: buffer };

  return new Promise((resolve, reject) => {
    s3.upload(param, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('uploaded');
      }
    });
  });
}

module.exports.saveToS3 = saveToS3;
