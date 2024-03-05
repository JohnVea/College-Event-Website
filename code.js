const loginButton = document.querySelector('.btnLogin-popup');
const loginContainer = document.querySelector('.login-container');
const searchBar = document.getElementById('searchBar');

loginButton.addEventListener('click', function() {
    searchBar.style.display = 'none';
    loginContainer.style.display = 'block';
});