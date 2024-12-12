document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        const loginMessage = document.getElementById('loginMessage');
        if (result.success) {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('formContainer').style.display = 'block';
        } else {
            loginMessage.textContent = result.message;
            loginMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});

document.getElementById('assignmentForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const date = document.getElementById('date').value;
    const assignment = document.getElementById('assignment').value;
    const comments = document.getElementById('comments').value;

    if (!date || !assignment || !comments) {
        alert('Please fill out all fields.');
        return;
    }

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, assignment, comments }),
        });

        const result = await response.json();

        const messageElement = document.getElementById('message');
        if (result.success) {
            messageElement.textContent = 'Form submitted successfully!';
            messageElement.style.color = 'green';
        } else {
            messageElement.textContent = 'Failed to submit the form.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
        document.getElementById('message').style.color = 'red';
    }
});

document.getElementById('logoutButton').addEventListener('click', async function() {
    try {
        const response = await fetch('/logout', { method: 'POST' });
        const result = await response.json();

        if (result.success) {
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('loginContainer').style.display = 'block';
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
});
