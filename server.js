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

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "278406872967-ds0j19p8s6gouvvklrma8cmpjicpmnfu.apps.googleusercontent.com"
const google_client = new OAuth2Client(CLIENT_ID);

const port = process.env.PORT || 3000;

server.listen(port, () => { //list on port
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {//send page to clients
  //res.send('<h1>Hello, Express.js Server!</h1>');
  res.sendFile(path.join(__dirname, 'front_end', 'index.html'));
});

io.on('connection', (socket) => 
{
  console.log('a user connected');
  let server_username = "Default_user";
  let server_chat_id = "Default_chat";
  let newest_time = new Date(0);

  let interval = setInterval(async () => { //emit messages from sever
    let result = await db_get_messages(server_chat_id, newest_time); //db get could take in newest time to see if need get whole data
    for (const ele of result)
    {
      newest_time = ele.Time_Sent;
      socket.emit('chat message', {"Text": ele.Text, "User_ID": ele.User_ID, "Time_Sent": ele.Time_Sent});
    }
  }, DB_REFRESH_TIME);

  const cookies = socket.handshake.headers.cookie;
  try
  {
    let token = JSON.parse(read_cookie("id_token", cookies));
    verify(token);
  }
  catch
  {
    console.log("Failed to read cookie");
  }

  socket.on('username', function(username)
  {
    console.log(username);
    server_username = username;
    newest_time = new Date(0);
  });

  socket.on('chat', function(chat_id)
  {
    console.log(chat_id);
    server_chat_id = chat_id;
    newest_time = new Date(0);
  });

  socket.on('message', function(message)
  {
    console.log(message); 
  
    //call MongoDB
    db_send(message, server_username, server_chat_id);
  });

  async function verify(token) 
  {
    try
    {
      const ticket = await google_client.verifyIdToken({
          idToken: token['credential'],
          audience: CLIENT_ID,
      });
      const verified_payload = ticket.getPayload();
      const email = verified_payload['email'];
      console.log(email, "just was verified to signed in.");
      server_username = email;
    }
    catch(err)
    {
      console.error(err); //code to be executed if an error occurs
      console.log(server_username, "failed to login");
      server_username = "Failed Login"; //might take time to run due to async
    }
  }
  socket.on('google_sign', function(token)
  {
    verify(token);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    clearInterval(interval);
  });
});

function read_cookie(name, cookies)
{
    console.log("Trying to read cookie");
    let cookie_array = cookies.split(';');
    for(let i = 0; i < cookie_array.length; i++) {
        let cookie_pairs = cookie_array[i].split("=");
        if(name == cookie_pairs[0].trim()) {
            return cookie_pairs[1].trim();
        }
    }
}


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
    await testCollection.insertOne(doc);
  } catch (error) {
    console.error('An error occurred while connecting to MongoDB', error);
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close(); //don't run - will still be getting data
  }
}


async function db_get_messages(chat_id, newest_time) {
  let result = [];
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("testDB")
    const testCollection = database.collection("testData");
    
    result = await testCollection.find({ $and: [ { Chat_ID: chat_id }, { Time_Sent: { $gt: newest_time } } ] } )
      .sort({Time_Sent: 1}).project({User_ID:1, Text: 1, Time_Sent: 1}).toArray();
  } catch (error) {
  console.error('An error occurred while connecting to MongoDB', error);
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close(); //don't run - will still be getting data
    return result;
  }
}