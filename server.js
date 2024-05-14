//Seperate server code needed as MongoDB / require cannot be run from client code
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/front_end' ));
app.use(express.json());

//Socket.io code for constant updates
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => 
{
  console.log('a user connected');

  let newest_time = null;

  let interval = setInterval(async () => { //emit messages from sever
    let result = await db_get("Test_user"); //db get could take in newest time to see if need get whole data

    for (const ele of result)
    {
      if(newest_time === null || ele.Time_Sent > newest_time)
      {
        newest_time = ele.Time_Sent;
        socket.emit('chat message', ele.Text);
      }
    }
  }, 5000);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    clearInterval(interval);
  });
});

app.get('/', (req, res) => {
  //res.send('<h1>Hello, Express.js Server!</h1>');
  res.sendFile(path.join(__dirname, 'front_end', 'index.html'));
});

const port = process.env.PORT || 3000;
/*app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});*/
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/data', (req, res) => {
  console.log(req.body); // access data out of JSON
  res.json({message: 'Data received!'}); // send a response back to the client

  //call MongoDB
  db_send(req.body.message);

});

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://kjm25:CR0Uf4mzLeSBm2Ou@cs314server.6ts6q8f.mongodb.net/?retryWrites=true&w=majority&appName=CS314Server";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function db_send(message) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("testDB")
    const testCollection = database.collection("testData");
    const doc = {USER_ID: "Test_user", "Text": message, "Time_Sent": new Date()};
    const result = await testCollection.insertOne(doc);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


async function db_get(user) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("testDB")
    const testCollection = database.collection("testData");
    const result = await testCollection.find({ USER_ID: user }).sort({Time_Sent: 1}).project({Text: 1, Time_Sent: 1}).toArray();
    //console.log(result);
    return result;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}