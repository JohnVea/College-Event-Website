const loginButton = document.querySelector('.btnLogin-popup');
const loginContainer = document.querySelector('.login-container');
const searchBar = document.getElementById('searchBar');
const cancelLoginButton = document.querySelector('.cancelLoginButton');
const Login = document.querySelector('.userLoginButton');
const SignedInUser = document.querySelector('.signedOnUser');

loginButton.addEventListener('click', function() {
    searchBar.style.display = 'none';
    loginContainer.style.display = 'block';
});

cancelLoginButton.addEventListener('click', function() {
    searchBar.style.display = 'block';
    loginContainer.style.display = 'none';
});

// Your existing code...
Login.addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        console.error('Error: Username or password cannot be empty');
        // Display error message to user
        return;
    }

    fetch('http://unieventverse.com/LAMPAPI/Login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        console.log(response);
        if (response.ok) {

            return response.json();
        } else {
            throw new Error('Failed to fetch: ' + response.status + ' ' + response.statusText);
        }
    })
    .then(data => {
        const userID = data.UserID;
        const firstName = data.FirstName;
        const error = data.error;

        if (error) {
            console.error('Error:', error);
            // Handle specific errors (e.g., invalid credentials, server error)
            // Display appropriate error message to user
        } else {
            loginResultElement.innerHTML = error.message;
            console.log('Login successful!');
            // Update UI or show loading indicator
            window.location.href = 'signedin.html';
        }
    })
    .catch(error => {
        console.log('Error logging in:', error);
        // Handle fetch errors or unexpected issues
        // Display generic error message to user
    });
});
