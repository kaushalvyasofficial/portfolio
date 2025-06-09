const { MongoClient } = require('mongodb');

// Replace <username>, <password>, and <dbname> in this URI
const uri = "mongodb+srv://kaushalvyasofficial:dbUserPass@cluster0.twneyvy.mongodb.net/PortfolioDB?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify database and collection
    const database = client.db("PortfolioDB");
    const collection = database.collection("bookQuotes");

    // Example: Insert one document
    const result = await collection.insertOne({
      quote: "The only limit to our realization of tomorrow is our doubts of today.",
      author: "Franklin D. Roosevelt"
    });
    console.log(`New quote inserted with _id: ${result.insertedId}`);

    // Example: Find all quotes
    const quotes = await collection.find({}).toArray();
    console.log("All quotes:", quotes);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
