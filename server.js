const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// Handling the POST request to ChatGPT
app.post('/chatGPT', async (req, res) => {
    const message = req.body.message;
    if (message) {
        try {
            const data = JSON.stringify({
                'messages': [{ 'role': 'system', 'content': 'You are a helpful assistant.' }, { 'role': 'user', 'content': message }],
            });

            const options = {
                hostname: 'api.openai.com',
                path: '/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.API_KEY}`,
                },
            };

            const apiReq = https.request(options, (apiRes) => {
                let responseBody = '';
                apiRes.on('data', (chunk) => {
                    responseBody += chunk;
                });

                apiRes.on('end', () => {
                    const responseContent = JSON.parse(responseBody);
                    res.json({ response: responseContent.choices[0].message.content });
                });
            });

            apiReq.on('error', (error) => {
                console.error('Error fetching data: ', error);
                res.status(500).json({ response: 'Error fetching data' });
            });

            apiReq.write(data);
            apiReq.end();

        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    } else {
        res.status(400).send('Message is required');
    }
});

// HTTPS server setup
const httpsOptions = {
    key: fs.readFileSync('/var/cpanel/ssl/cpanel/cpanel.pem'), // Path to your key.pem
    cert: fs.readFileSync('/var/cpanel/ssl/cpanel/cpanel.pem') // Path to your cert.pem
};

const server = https.createServer(httpsOptions, app);

const PORT = 6969;
server.listen(PORT, () => {
    console.log(`Server running at https://brandynette.com:${PORT}/chatGPT`);
});
