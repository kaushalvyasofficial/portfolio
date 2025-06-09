require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const port = process.env.PORT || 3001;

// ---------- Serve Static Images ----------
app.use('/images', express.static(path.join(__dirname, '../assets/images')));

// Debug: Check what path is being used
console.log('📁 Static images path:', path.join(__dirname, '../assets/images'));

// ---------- Root Route ----------
app.get('/', (req, res) => {
  res.json({ 
    message: "Portfolio API Server Running! 🚀", 
    endpoints: {
      quotes: "/api/quotes",
      gallery: "/api/gallery", 
      images: "/images/filename.jpg"
    },
    status: "Connected to MongoDB ✅"
  });
});

// ---------- MongoDB + Routes ----------
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    // Quotes endpoint
    app.get('/api/quotes', async (req, res) => {
      try {
        const quotes = await client.db("portfolio").collection("quotes").find().toArray();
        res.json(quotes);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch quotes" });
      }
    });

    // Gallery endpoint
    app.get('/api/gallery', async (req, res) => {
      try {
        const gallery = await client.db("portfolio").collection("gallery").find().toArray();
        res.json(gallery);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch gallery" });
      }
    });

  } catch (e) {
    console.error("❌ MongoDB Connection Failed:", e);
  }
}

main();

// ---------- Start Server ----------
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📝 API endpoints:`);
  console.log(`   • http://localhost:${port}/api/quotes`);
  console.log(`   • http://localhost:${port}/api/gallery`);
  console.log(`   • http://localhost:${port}/images/your-image.jpg`);
});