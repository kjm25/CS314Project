

//Seperate server code needed as MongoDB / require cannot be run from client code
const express = require('express');
const app = express();

//Will need to handle post/fetch with express for this to work
//Will also likely need to update debugger to run with local host instead of index.html

//modfied MongoDB sample code
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://kjm25:<wcvxWTjWr47cbksW>@cs314server.6ts6q8f.mongodb.net/?retryWrites=true&w=majority&appName=CS314Server";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    const database = client.db("testDB")
    const testCollection = database.collection("testData");
    const doc = {USER_ID: "Test_user"};
    const result = await testCollection.insertOne(doc);
    console.log(result);
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

//end MongoDB sample code 

app.listen(3000, () => console.log('Server is running on port 3000'));