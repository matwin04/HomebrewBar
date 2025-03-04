const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3033;

app.use(cors());
app.use(express.json());

// Generic function to fetch API data
async function fetchData(url, res) {
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
    }
}

// Fetch all formulae
app.get("/api/formulae", (req, res) => fetchData("https://formulae.brew.sh/api/formula.json", res));

// Fetch all casks
app.get("/api/casks", (req, res) => fetchData("https://formulae.brew.sh/api/cask.json", res));

// Fetch a single formula
app.get("/api/formula/:name", (req, res) => fetchData(`https://formulae.brew.sh/api/formula/${req.params.name}.json`, res));

// Fetch a single cask
app.get("/api/cask/:name", (req, res) => fetchData(`https://formulae.brew.sh/api/cask/${req.params.name}.json`, res));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));