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
const DB_REFRESH_TIME = 3000;


io.on('connection', (socket) => 
{
  console.log('a user connected');
  let server_username = "Default_user";
  let server_chat_id = "Default_chat";
  let newest_time = null;

  let interval = setInterval(async () => { //emit messages from sever
  let result = await db_get(server_chat_id); //db get could take in newest time to see if need get whole data

    for (const ele of result)
    {
      if(newest_time === null || ele.Time_Sent > newest_time)
      {
        newest_time = ele.Time_Sent;
        socket.emit('chat message', ele.User_ID + ": " + ele.Text);
      }
    }
  }, DB_REFRESH_TIME);

  socket.on('username', function(username)
  {
    console.log(username);
    server_username = username;
    newest_time = null;
  });

  socket.on('chat', function(chat_id)
  {
    console.log(chat_id);
    server_chat_id = chat_id;
    newest_time = null;
  });

  socket.on('message', function(message)
  {
    console.log(message); 
  
    //call MongoDB
    db_send(message, server_username, server_chat_id);
  });

  socket.on('google_sign', function(token)
  {
    async function verify() {
      const ticket = await google_client.verifyIdToken({
          idToken: token['credential'],
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const verified_payload = ticket.getPayload();
      const email = verified_payload['email']; 
      console.log(email, "just was verified to signed in.");
      server_username = email;
    }
    verify().catch(console.error);

  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    clearInterval(interval);
  });
});

app.get('/', (req, res) => {
  //res.send('<h1>Hello, Express.js Server!</h1>');
  res.sendFile(path.join(__dirname, 'front_end', 'index.html'));
});


const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "278406872967-ds0j19p8s6gouvvklrma8cmpjicpmnfu.apps.googleusercontent.com"
const google_client = new OAuth2Client(CLIENT_ID);


const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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

async function db_send(message, username, chat_id) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB! for send");
    const database = client.db("testDB")
    const testCollection = database.collection("testData");
    const doc = {"User_ID": username, "Chat_ID": chat_id, "Text": message, "Time_Sent": new Date()};
    const result = await testCollection.insertOne(doc);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


async function db_get(chat_id) {
  let result = [];
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("testDB")
    const testCollection = database.collection("testData");
    result = await testCollection.find({ Chat_ID: chat_id }).sort({Time_Sent: 1}).project({User_ID:1, Text: 1, Time_Sent: 1}).toArray();
  } 
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    return result;
  }
}