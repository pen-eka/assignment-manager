const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const PORT = 3000;
const USERS_FILE = 'users.json';

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Configure session
app.use(
    session({
        secret: 'your_secret_key', // Replace with a strong secret key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set secure: true if using HTTPS
    })
);

// Endpoint to handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const users = fs.existsSync(USERS_FILE)
        ? JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
        : {};

    // Check if user exists
    if (users[username]) {
        const isPasswordValid = await bcrypt.compare(password, users[username]);
        if (isPasswordValid) {
            req.session.username = username; // Set session
            return res.json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: 'Incorrect password.' });
        }
    }

    // Save new user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    users[username] = hashedPassword;
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    req.session.username = username; // Set session for new user
    res.json({ success: true });
});

// Endpoint to handle logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ success: false, message: 'Logout failed.' });
        }
        res.json({ success: true });
    });
});

// Endpoint to handle form submission
app.post('/submit', (req, res) => {
    const { date, assignment, comments } = req.body;

    if (!date || !assignment || !comments) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const data = { date, assignment, comments };
    const dataJson = JSON.stringify(data, null, 2);

    fs.appendFile('data.json', dataJson + ',\n', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
