// Define GET, POST, PUT, DELETE routes for /users.
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
app.use(express.json());
// Security middleware
app.use(helmet()); // sets various HTTP headers for basic protection
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*' // restrict in production
}));
 
let users = [];
const API_TOKEN = process.env.API_TOKEN || 'dev-token'; // set a strong token in production

// Token-based authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // accept "Bearer <token>" or raw token
    const token = authHeader ? (authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    if (token !== API_TOKEN) return res.status(403).json({ message: 'Invalid token' });
    next();
}
 
// GET /users - Retrieve all users
app.get('/users', (req, res) => {
    res.json(users);
});
 
// POST /users - Create a new user
app.post('/users', authenticateToken, (req, res) => {
    const newUser = req.body || {};
    // assign an id if not provided
    if (typeof newUser.id === 'undefined' || newUser.id === null) {
        const maxId = users.reduce((max, u) => (u && typeof u.id === 'number' ? Math.max(max, u.id) : max), 0);
        newUser.id = maxId + 1;
    } else {
        newUser.id = parseInt(newUser.id, 10);
    }
    users.push(newUser);
    res.status(201).json(newUser);
});
 
// PUT /users/:id - Update an existing user
app.put('/users/:id', authenticateToken, (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = req.body || {};
    updatedUser.id = userId; // ensure id stays consistent
    const userIndex = users.findIndex(user => user.id === userId);
 
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});
 
// DELETE /users/:id - Delete a user
app.delete('/users/:id', authenticateToken, (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(user => user.id === userId);
 
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});
 
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
