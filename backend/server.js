const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'API is running!' });
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    // Process data
    res.status(201).json({ message: 'Data received', data });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});