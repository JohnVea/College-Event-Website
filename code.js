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
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Username:username, Password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = 'http://unieventverse.com/LAMPAPI/Login.php'

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.UserID;
		
				if( userId < 1 )
				{		
					//document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					alert("User/Password combination incorrect")
					return;
				}
		
				firstName = jsonObject.FirstName;

				saveCookie();
                SignedInUser.textContent = firstName;
                console.log(firstName)
				window.location.href = "signedin.html";
				//alert(firstName+","+lastName+"UserId:"+userId);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
	}
}
