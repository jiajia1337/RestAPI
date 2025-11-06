// Define GET, POST, PUT, DELETE routes for /users.
const express = require('express');
const app = express();
app.use(express.json());

let users = [];

// GET /users - Retrieve all users
app.get('/users', (req, res) => {
    res.json(users);
});

// POST /users - Create a new user
app.post('/users', (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT /users/:id - Update an existing user
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// DELETE /users/:id - Delete a user
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
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
