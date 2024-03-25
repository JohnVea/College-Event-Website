const loginButton = document.querySelector('.btnLogin-popup');
const loginContainer = document.querySelector('.login-container');
const searchBar = document.getElementById('searchBar');
const cancelLoginButton = document.querySelector('.cancelLoginButton');
const Login = document.querySelector('.userLoginButton');
const SignedInUser = document.querySelector('.signedOnUser');

loginButton.addEventListener('click', function() {
    console.log('Login button clicked'); // Debug statement
    searchBar.style.display = 'none';
    loginContainer.style.display = 'block';
});

cancelLoginButton.addEventListener('click', function() {
    searchBar.style.display = 'block';
    loginContainer.style.display = 'none';
});

Login.addEventListener('click', async function() {
    console.log('User login button clicked'); // Debug statement
    await doLogin();
});

async function doLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Make an HTTP request to the server to authenticate the user
        // (Assuming the server endpoint is named login.php)
        const response = await fetch('http://unieventverse.com/LAMPAPI/Login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: username,
                Password: password
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch: ' + response.status + ' ' + response.statusText);
        }

        const data = await response.json();

        // Check if there's an error message
        if (data.error) {
            console.error('Error:', data.error);
            // Handle the error, such as displaying an error message to the user
        } else {
            // If no error, store the user info in variables (using bracket notation)
            const userID = data['UserID'];
            const firstName = data['FirstName'];
            
            // Do whatever you need with the stored user info
            console.log('UserID:', userID);
            console.log('FirstName:', firstName);
            // Redirect the user to the signed-in page
            SignedInUser.textContent = firstName;
            window.location.href = "signedin.html";
        }
    } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.error('Error:', error);
        //window.location.href = "signedin.html";
        // Display error message to the user or handle it accordingly
    }
}
