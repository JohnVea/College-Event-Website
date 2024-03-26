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
    //await doLogin();
    await getUsers();
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
            body: JSON.stringify({ Username : username, Password : password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();

        if (data.error === "") {
            // Successful login
            console.log('Login successful:', data);
            // Assuming you have an element to display the user's first name
            const firstNameElement = document.getElementById('firstName');
            firstNameElement.textContent = data.FirstName;
            // Optionally redirect the user or perform other actions
        } else {
            // Login failed
            throw new Error(data.error);
        }

    } catch (error) {
        // Handle any errors that might occur during login
        console.error('Error during login:', error.message);
        // Optionally display an error message to the user
        // You can update a DOM element with an error message, show a modal, etc.
    }
}


async function getUsers() {
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/GetUsers.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();

        // Handle the response data as needed
        console.log('Users:', data);

    } catch (error) {
        // Handle any errors that might occur during fetching users
        console.error('Error fetching users:', error.message);
        // Optionally display an error message to the user
        // You can update a DOM element with an error message, show a modal, etc.
    }
}