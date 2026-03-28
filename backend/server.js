'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = 'your_mongo_db_connection_string_here';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
