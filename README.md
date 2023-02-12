## XSS Hunter with Slack and Discord Notification:
1. Install xsshunter as specified in here: https://github.com/mandatoryprogrammer/xsshunter-express
2. To enable Slack Notification follow the below steps:

> ## Slack Notification:
1. Create a Slack webhook as specified in the URL: https://api.slack.com/messaging/webhooks
2. In ```docker-compose.yaml``` file set the SLACK_NOTIFICATION_ENABLED value to true
3. Update the ```SLACK_WEBHOOK_URL``` in ```docker-compose.yaml``` and point to your webhook
 



