require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    // Quotes endpoint
    app.get('/api/quotes', async (req, res) => {
      const quotes = await client.db("portfolio").collection("quotes").find().toArray();
      res.json(quotes);
    });

    // Gallery endpoint
    app.get('/api/gallery', async (req, res) => {
      const gallery = await client.db("portfolio").collection("gallery").find().toArray();
      res.json(gallery);
    });

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
  }
}

main();