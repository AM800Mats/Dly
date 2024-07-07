//login api call
async function login(username, password) {
    //API call logic
    return { accessToken: 'your_access_token' };
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