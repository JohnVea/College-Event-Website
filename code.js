const loginButton = document.querySelector('.btnLogin-popup');
const loginContainer = document.querySelector('.login-container');
const searchBar = document.getElementById('searchBar');
const cancelLoginButton = document.querySelector('.cancelLoginButton');
const Login = document.querySelector('.userLoginButton');
const SignedInUser = document.querySelector('.signedOnUser');
const loginResult = document.getElementById('loginResult'); // Assuming element exists

loginButton.addEventListener('click', function() {
    console.log('Login button clicked');
    searchBar.style.display = 'none';
    loginContainer.style.display = 'block';
});

cancelLoginButton.addEventListener('click', function() {
    searchBar.style.display = 'block';
    loginContainer.style.display = 'none';
});

Login.addEventListener('click', async function() {
    console.log('User login button clicked');
    await doLogin();
    
});

async function doLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Assuming you have some API endpoint for login, you can use fetch or any other method to send the login request
        const response = await fetch('http://unieventverse.com/LAMPAPI/Login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            // If response is not OK (e.g., status code 400 or 500), handle error accordingly
            throw new Error('Login failed');
        }

        const data = await response.json();
        // Assuming your API returns some data after successful login, you can handle it here
        console.log('Login successful:', data);
        
        // Redirect or perform other actions after successful login
        // window.location.href = '/dashboard'; // Example redirect

    } catch (error) {
        // Handle any errors that might occur during login
        console.error('Error during login:', error.message);
        // Optionally display an error message to the user
        // You can update a DOM element with an error message, show a modal, etc.
    }
}
