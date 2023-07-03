// Import the required modules.
const http = require('http');
const https = require('https');
require('dotenv').config();

// Create an HTTP server.
const server = http.createServer((req, res) => {
    // If the request is a POST request and the URL is '/api/chat', we want to handle it.
    if (req.method === 'POST' && req.url === 'https://brandynette.com/chatGPT/) {
        // The body of the request is sent in 'chunks', so we need to piece it together.
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            // Once we have the full body, we can parse it as JSON and handle it.
            const postBody = JSON.parse(body);
            getChatResponse(postBody.message, res);
        });
    } else {
        // If the request is not what we expect, respond with a 404 status code.
        res.statusCode = 404;
        res.end();
    }
});

// Start the server, listening on port 3000.
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});

async function getChatResponse(message, res) {
    // Prepare the data for the OpenAI API request.
    const data = JSON.stringify({
        'messages': [{ 'role': 'system', 'content': 'You are a helpful assistant.' }, { 'role': 'user', 'content': message }],
    });

    // Options for the OpenAI API request.
    const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`,
        },
    };

    // Make a request to the OpenAI API.
    const req = https.request(options, (apiRes) => {
        let responseBody = '';

        // Again, the body issent in 'chunks', so we need to piece it together.
        apiRes.on('data', (chunk) => {
            responseBody += chunk;
        });

        apiRes.on('end', () => {
            // Once we have the full body, we can parse it as JSON.
            const responseContent = JSON.parse(responseBody);
            // Write a response back to the client with the message received from the OpenAI API.
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ response: responseContent.choices[0].message.content }));
        });
    });

    req.on('error', (error) => {
        // If anything goes wrong (network issue, server error, etc.), log the error and send an error message back to the client.
        console.error('Error fetching data: ', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response: 'Error fetching data' }));
    });

    // Send the request to the OpenAI API.
    req.write(data);
    req.end();
}
