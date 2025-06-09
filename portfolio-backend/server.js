const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json()); // for parsing JSON request bodies

// Replace with your actual connection string
const uri = "mongodb+srv://kaushalvyasofficial:dbUserPass@cluster0.twneyvy.mongodb.net/PortfolioDB?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
}
connectDB();

const db = client.db("portfolioDB");
const quotesCollection = db.collection("bookQuotes");
const galleryCollection = db.collection("photoGallery");

// Routes

// Get all quotes
app.get('/quotes', async (req, res) => {
  try {
    const quotes = await quotesCollection.find({}).toArray();
    res.json(quotes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add a new quote
app.post('/quotes', async (req, res) => {
  try {
    const quote = req.body;
    const result = await quotesCollection.insertOne(quote);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all gallery items
app.get('/gallery', async (req, res) => {
  try {
    const gallery = await galleryCollection.find({}).toArray();
    res.json(gallery);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add a new gallery item
app.post('/gallery', async (req, res) => {
  try {
    const item = req.body;
    const result = await galleryCollection.insertOne(item);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
