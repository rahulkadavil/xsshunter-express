const nodemailer = require('nodemailer');
const mustache = require('mustache');
const https = require('https');
const fs = require('fs');

const XSS_PAYLOAD_FIRE_EMAIL_TEMPLATE = fs.readFileSync(
	'./templates/xss_email_template.htm',
	'utf8'
);

async function send_email_notification(xss_payload_fire_data) {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT),
		secure: (process.env.SMTP_USE_TLS === "true"),
		auth: {
			user: process.env.SMTP_USERNAME,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	const notification_html_email_body = mustache.render(
		XSS_PAYLOAD_FIRE_EMAIL_TEMPLATE, 
		xss_payload_fire_data
	);

	const info = await transporter.sendMail({
		from: process.env.SMTP_FROM_EMAIL,
		to: process.env.SMTP_RECEIVER_EMAIL,
		subject: `[XSS Hunter Express] XSS Payload Fired On ${xss_payload_fire_data.url}`,
		text: "Only HTML reports are available, please use an email client which supports this.",
		html: notification_html_email_body,
	});

	console.log("Message sent: %s", info.messageId);
}

async function send_slack_notification(xss_payload_fire_data) {
	const webhookurl = process.env.SLACK_WEBHOOK_URL;
	const xss_payload_fire_data1 = {
   		 'text':  'Blind XSS Fired at: ' + xss_payload_fire_data.url
	};
	
	try {
        messageBody = JSON.stringify(xss_payload_fire_data1);
      	} 
	catch (e) {
        throw new Error('Failed to stringify messageBody', e);
      	}
	
      	return new Promise((resolve, reject) => {
        // general request options, we defined that it's a POST request and content is JSON
        const requestOptions = {
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          }
        };
	const req = https.request(webhookurl, requestOptions, (res) => {
        let response = '';
        res.on('data', (d) => {
          response += d;
        });
        // response finished, resolve the promise with data
        res.on('end', () => {
          resolve(response);
        })
      	});
      // there was an error, reject the promise
      	req.on('error', (e) => {
        reject(e);
      	});
  	
      // send our message body (was parsed to JSON beforehand)
      	req.write(messageBody);
      	req.end();
    });	

	console.log("Message sent: %s", info.messageId);
}

module.exports.send_email_notification = send_email_notification;
module.exports.send_slack_notification = send_slack_notification;
