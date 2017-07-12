/**
 * Created by Kon on 7/12/17.
 */

'use strict';

const fs = require('fs');
const postmark = require('postmark');

const client = new postmark.Client('7a5adec5-05ef-4261-8249-3070d2ea1453');

function notifyError(screenshotPath) {
  client.sendEmail({
    From: 'konstantin@armada.ai',
    To: process.env.NOTIFY_EMAIL,
    Subject: 'Scraper Error',
    TextBody: 'Failed to fetch account balances',
    Attachments: [{
      Content: fs.readFileSync(screenshotPath).toString('base64'),
      Name: screenshotPath,
      ContentType: 'image/png',
    }],
  }, (error) => {
    if (error) {
      console.error(`Unable to send via postmark: ${error.message}`);
    }
    console.info('Sent to postmark for delivery');
  });
}

module.exports.notifyError = notifyError;
