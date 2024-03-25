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
    doLogin();
    /*// Get the username and password entered by the user
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
        // Handle the data returned by the API
        console.log('Login response:', data);
        const userID = data.UserID;
        const firstName = data.FirstName;
        const error = data.error;

        // Check for any potential error message
        if (error) {
            console.error('Error:', error);
            // Handle the error (e.g., display an error message to the user)
        } else {
            // No error, proceed with signed-in user actions
            console.log('UserID:', userID);
            console.log('FirstName:', firstName);
            // Update UI or redirect to signed-in page
            window.location.href = 'signedin.html';
        }
    })
    .catch(error => {
        // Handle any errors that occur during the fetch operation
        console.log(data.userID);
        console.log('Error:', error);
        console.error('Error logging in:', error);
        // Display error message to the user or handle it accordingly
    });*/
});

async function doLogin() {
    const url = 'http://unieventverse.com/LAMPAPI/Login.php'
    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let loginResultElement = document.getElementById("loginResult");
    if (!loginResultElement) {
        console.error("Element with ID 'loginResult' not found.");
        return;
    }

    // Clear the inner HTML of the "loginResult" element if it exists
    loginResultElement.innerHTML = "";

    let data = { login: login, password: password };
    let jsonPayload = JSON.stringify(data);

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: jsonPayload
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let jsonObject = await response.json();

        let userId = jsonObject.id;

        if (userId < 1) {
            alert("User/Password combination incorrect");
            return;
        }

        let firstName = jsonObject.FirstName;
        console.log(firstName);
        SignedInUser.textContent = firstName;

        saveCookie();
        window.location.href = "signedin.html";
        // alert(firstName + "," + lastName + "UserId:" + userId);
    } catch (error) {
        // Display the error message in the "loginResult" element if it exists
        if (loginResultElement) {
            loginResultElement.innerHTML = error.message;
        } else {
            console.error("Error occurred:", error);
        }
    }
}
