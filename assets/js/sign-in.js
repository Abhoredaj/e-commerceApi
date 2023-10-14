document.getElementById('page-title').textContent = 'Login';

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    fetch('/users/login', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.accessToken) {
            // Login successful, redirect to the home page
            window.location.href = '/';
        } else {
            // Display an error message to the user
            alert('Login failed. Please check your email and password.');
        }
    })
    .catch(error => {
        console.error(error);
    });
});
