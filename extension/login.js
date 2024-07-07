//login api call
// Updated login function in extension/login.js
async function login(username, password) {
    const loginUrl = 'http://localhost:3500/auth'; // Adjust if your API endpoint differs
    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include', // Include cookies for CORS requests
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const { accessToken } = await response.json();
        return { accessToken };
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

// Function to handle login within the extension
async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const { accessToken } = await login(username, password);
        // Use chrome.storage to store the access token
        chrome.storage.local.set({ accessToken }, function() {
            console.log('Token stored');
            // Navigate or close popup as needed
        });
    } catch (err) {
        console.error('Login failed', err);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginButton').addEventListener('click', handleLogin);
});