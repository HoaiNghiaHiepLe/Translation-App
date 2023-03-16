require('dotenv').config();
const { App } = require('@slack/bolt');
const app = new App({
  token: process.env.SLACK_APP_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_APP_SIGNING_SECRET,
});

app.message('hello', async ({ message, say }) => {
  await say(`hello, <@${message.user}>`);
});

(async () => {
  console.log('started ding ding');
  await app.start(3000);
})();
