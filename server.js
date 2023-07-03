const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

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

const PORT = 443;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
