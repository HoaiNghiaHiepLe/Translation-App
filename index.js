require('dotenv').config();
const { App } = require('@slack/bolt');
const axios = require('axios');

const app = new App({
  token: process.env.SLACK_APP_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_APP_SIGNING_SECRET,
});

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiApiUrl = process.env.OPENAI_API_URL;

// with ChatGPT

app.message(async ({ message, say, options }) => {
  const text = message.text;
  // Send the user's message to OpenAI for processing
  if (!text || text.trim() === '') {
    await say('Please provide a message to process');
    return;
  }
  const response = await axios.post(
    openaiApiUrl,
    {
      prompt: text,
      max_tokens: 150,
      n: 1,
      stop: '\n',
    },
    {
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // Get the response from OpenAI and send it back to the user
  const result = response.data.choices[0].text.trim();
  await say(result);
});

// withou chatGPT
// app.message(async ({ message, say }) => {
//   // Respond with the user's message
//   await say(`You said: ${message.text}`);
// });

(async () => {
  console.log('Slack GPT is working...');
  await app.start(8000);
})();
