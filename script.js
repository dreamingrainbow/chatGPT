// Attach an event listener to the 'click' event on the send button.
document.getElementById('send-button').addEventListener('click', async () => {
    // Retrieve the value from the user input field.
    const message = document.getElementById('user-input').value;
    // Make a request to our server with the user's message and wait for the response.
    const response = await getChatResponse(message);
    // Update the response area with the message received from the server.
    document.getElementById('response-area').textContent = response;
});

async function getChatResponse(message) {
    try {
        // Make a POST request to our server's /api/chat endpoint.
        const response = await fetch('https://brandynette.com/chatGPT/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // The body of our request is a JSON string containing the user's message.
            body: JSON.stringify({ 'message': message }),
        });

        // If the request was not successful, throw an error.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response body as JSON and return the response message.
        const data = await response.json();
        return data.response;
    } catch (error) {
        // If anything goes wrong (network issue, server error, etc.), log the error and return an error message.
        console.error('Error fetching data: ', error);
        return 'Error fetching data';
    }
}
