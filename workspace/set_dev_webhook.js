const token = "8367904559:AAHQZ1Wejyc-iZsrtQ9lbPBqQSZB8etMER4";
const webhookUrl = "https://ais-dev-vmc6nly7bqgwwurzsl4xu3-206659396979.europe-west2.run.app/api/telegram/webhook";

fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`)
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
