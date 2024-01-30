const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://acoray:hola1234@atlascluster.cwtvplm.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:URL'));

// Define the account schema
const accountSchema = new mongoose.Schema({
    name: String,
    balance: Number
});

// Create a Mongoose model
const Account = mongoose.model('Account', accountSchema);

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(errorHandler());

// Routes

// GET /accounts - Get all accounts
app.get('/accounts', async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /accounts - Create a new account
app.post('/accounts', async (req, res) => {
    const { name, balance } = req.body;

    if (!name || !balance) {
        return res.status(400).json({ error: 'Name and balance are required' });
    }

    try {
        const newAccount = new Account({ name, balance });
        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /accounts/:id - Update an account by ID
app.put('/accounts/:id', async (req, res) => {
    const { id } = req.params;
    const { balance } = req.body;

    try {
        const updatedAccount = await Account.findByIdAndUpdate(id, { balance }, { new: true });
        res.json(updatedAccount);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /accounts/:id - Delete an account by ID
// DELETE /accounts/:id - Eliminar una cuenta por ID
app.delete('/accounts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAccount = await Account.findByIdAndDelete(id);

        if (!deletedAccount) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json(deletedAccount);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
