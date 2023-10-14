document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const passwordError = document.getElementById('password-error');

    if (password !== confirmPassword) {
        passwordError.innerText = 'Passwords do not match';
    } else if (!isPasswordValid(password)) {
        passwordError.innerText = 'Password requirements not met';
    } else {
        // If the password is valid, send a POST request to the server
        const formData = new FormData(this);
        fetch('/users/register', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User registered') {
                // Registration is successful, redirect to the login page
                window.location.href = '/login';
            } else if (data.message === 'User Already Existed') {
                // Redirect to the login page (if you want to handle this case the same way)
                window.location.href = '/login';
            }
        })
        .catch(error => {
            console.error(error);
        });
    }
});

document.getElementById('page-title').textContent = 'Sign-UP';

function isPasswordValid(password) {
    // Password should be at least 8 characters long
    if (password.length < 8) {
        return false;
    }

    // Password should contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return false;
    }

    // Password should contain at least one digit
    if (!/\d/.test(password)) {
        return false;
    }

    // Password should contain at least one special character
    if (!/[@$!%*?&]/.test(password)) {
        return false;
    }

    return true;
}
