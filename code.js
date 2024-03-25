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

    document.getElementById("loginResult").innerHTML = "";

    const data = { Username: username, Password: password };
    const jsonPayload = JSON.stringify(data);
    const url = 'http://unieventverse.com/LAMPAPI/Login.php'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: jsonPayload
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch: ' + response.status + ' ' + response.statusText);
        }
    })
    .then(data => {
        const userId = data.UserID;
        const firstName = data.FirstName;
        const error = data.error;

        if (error) {
            console.error('Error:', error);
            // Handle specific errors (e.g., invalid credentials, server error)
            // Display appropriate error message to user
        } else {
            document.getElementById("loginResult").innerHTML = error.message;
            console.log('Login successful!');
            // Update UI or show loading indicator
            window.location.href = "signedin.html";
        }
    })
    .catch(error => {
        document.getElementById("loginResult").innerHTML = error.message;
    });
});
