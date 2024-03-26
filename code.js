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

  loginResult.innerHTML = ""; // Clear any previous result

  try {
    const response = await fetch('http://unieventverse.com/LAMPAPI/Login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({ Username: username, Password: password })
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.UserID < 1) {
      loginResult.textContent = "Invalid username or password";
      return;
    }

    const firstName = data.FirstName;
    SignedInUser.textContent = firstName;
    console.log(firstName);
    window.location.href = "signedin.html";
  } catch (error) {
    console.error('Error logging in:', error);
    loginResult.textContent = "An error occurred. Please try again.";
  }
}
