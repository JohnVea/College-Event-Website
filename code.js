const loginButton = document.querySelector('.btnLogin-popup');
const loginContainer = document.querySelector('.login-container');
const searchBar = document.getElementById('searchBar');
const cancelLoginButton = document.querySelector('.cancelLoginButton');
const Login = document.querySelector('.userLoginButton');
const SignedInUser = document.querySelector('.signedOnUser');
const loginResult = document.getElementById('loginResult');
const registrationDiv = document.querySelector('.registration');
const userRegisterButton = document.querySelector('.userRegisterButton');
const cancelRegisterButton = document.querySelector('.cancelRegisterButton');
const registerUserButton = document.querySelector('.registerUserButton');


userRegisterButton.addEventListener('click', function(){
    loginContainer.style.display = 'none';
    registrationDiv.style.display = 'block';
});

cancelRegisterButton.addEventListener('click', function() {
    registrationDiv.style.display = 'none';
    loginContainer.style.display = 'block';
});

registerUserButton.addEventListener('click', function() {
    doRegister();
});

async function doRegister() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const email = document.getElementById("registerEmail").value;
    const firstName = document.getElementById("registerFirstName").value;
    const lastName = document.getElementById("registerLastName").value;
    

    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/Register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username : username, password : password, lirstName : firstName, LastName : lastName, email : email })
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();

        if (data.error === "") {
            console.log('Registration successful:', data);
            localStorage.setItem('userData', JSON.stringify(data));
            window.location.href = "./Signed-In/home.html";
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error during registration:', error.message);
    }
}

loginButton.addEventListener('click', function() {
    console.log('Login button clicked');
    searchBar.style.display = 'none';
    loginContainer.style.display = 'block';
    //getUsers();
});

cancelLoginButton.addEventListener('click', function() {
    searchBar.style.display = 'block';
    loginContainer.style.display = 'none';
});

Login.addEventListener('click', async function() {
    console.log('User login button clicked');
    await doLogin();
   // await getUsers();
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        try {
            await doLogin(); // Call the login function
        } catch (error) {
            console.error('Error during form submission:', error.message);
            // Optionally display an error message to the user
        }
    });
});

async function doLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    let tmp = {Username: username, Password:password};
    let jsonPayload = JSON.stringify(tmp);

    try {
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
            console.log('Login successful:', data);
            localStorage.setItem('userData', JSON.stringify(data));
            window.location.href = "./Signed-In/home.html";
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error during login:', error.message);
    }
}


async function getUsers() {
    try {
      const response = await fetch('http://unieventverse.com/LAMPAPI/GetAllUsers.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Response status code:', response.status);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Users:', data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  }