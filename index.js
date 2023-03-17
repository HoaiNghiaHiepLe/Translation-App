require('dotenv').config();
const { App } = require('@slack/bolt');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const app = new App({
  token: process.env.SLACK_APP_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_APP_SIGNING_SECRET,
});

// Initialize the OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Listen for the 'message' event
app.message(async ({ message, say }) => {
  try {
    // Use the OpenAI API to generate a response based on the user's message
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: message.text,
      max_tokens: 50,
      temperature: 0.5,
    });

    // Send the response back to the user in Slack
    await say(response.data.choices[0].text);
  } catch (err) {
    console.error(err);
  }
});

(async () => {
  console.log('⚡️ Bolt app is running!');
  await app.start(process.env.PORT || 3000);
})();
