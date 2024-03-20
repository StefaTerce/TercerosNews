const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodefetch = require('node-fetch');

dotenv.config(); // Load environment variables from .env file

const app = express();

// Allow all origins (CORS)
app.use(cors({ origin: '*' }));

// Your dynamic API route
app.get('/api/:category/:date', async (req, res) => {
  try {
    // Dynamic import of node-fetch within an async function
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default; // Accessing the default export of the module

    const { category, date } = req.params;
    const apiKey = process.env.APIKEY2; // Access the API key from environment variables
    const url = `https://newsapi.org/v2/everything?q=${category}&from=${date}&language=it&sortBy=publishedAt&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
