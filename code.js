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
    // Retrieve username and password from input fields
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Make an HTTP request to the server to authenticate the user
    // (Assuming the server endpoint is named login.php)
    fetch('http://unieventverse.com/LAMPAPI/Login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: username,
            Password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch: ' + response.status + ' ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Check if there's an error message
        if (data.error) {
            console.error('Error:', data.error);
            // Handle the error, such as displaying an error message to the user
        } else {
            // If no error, store the user info in variables
            var userID = data.UserID;
            var firstName = data.FirstName;
            
            // Do whatever you need with the stored user info
            console.log('UserID:', userID);
            console.log('FirstName:', firstName);
            // Redirect the user to the signed-in page
            window.location.href = "signedin.html";
        }
    })
    .catch(error => {
        // Handle any errors that occur during the fetch operation
        console.error('Error:', error);
        // Display error message to the user or handle it accordingly
    });
});
