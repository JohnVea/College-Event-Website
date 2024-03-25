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

Login.addEventListener('click', function() {
    // Get the username and password entered by the user
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Make a POST request to the login API endpoint
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
        if (response.ok) {
            // If login is successful, handle the response accordingly
            return response.json();
        } else {
            // If login fails, handle the error
            throw new Error('Login failed');
        }
    })
    .then(data => {
        // Handle the data returned by the API (e.g., redirect to dashboard)
        console.log('Login successful:', data);
        // Redirect or perform any necessary actions here
        var userID = data.UserID;
        var firstName = data.FirstName;
        // Do whatever you need with the stored user info
        console.log('UserID:', userID);
        console.log('FirstName:', firstName);
        SignedInUser.textContent = firstName;
        window.location.href = 'signedin.html'
        

    })
    .catch(error => {
        window.location.href = 'signedin.html'
        console.log('Error hhehherreeeeee:', error);
        // Handle any errors that occur during the fetch operation
        console.error('Error logging in:', error);
        // Display error message to the user or handle it accordingly
    });
});