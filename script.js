
document.getElementById('send-button').addEventListener('click', async () => {
    const message = document.getElementById('user-input').value;
    const response = await getChatResponse(message);
    document.getElementById('response-area').textContent = response;
});

function getURL() {
    document.getElementById("#get-url").innerHTML = 
    "The full URL of this page is:<br> " + window.location.href;
}

async function getChatResponse(message) {
    try {
        const response = await fetch('https:///chatGPT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'message': message }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error fetching data: ', error);
        return 'Error fetching data';
    }
}

