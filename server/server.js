//Seperate server code needed as MongoDB / require cannot be run from client code
const express = require('express');
const app = express();
app.use(express.static(__dirname + './../client' ));
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
  res.sendFile(path.join(__dirname, './../client', 'index.html'));
});

io.on('connection', (socket) => 
{
  console.log('a user connected');
  let server_username = "";
  let server_chat_id = "";
  let newest_time = new Date(0);
  let chat_interval = 0;
  let message_interval = 0;
  let conversations = [];


  chat_interval = setInterval(async () => { //emit chat list
    if(server_username === "")
    {
      return;
    }
    socket.emit('verified', server_username);
    conversations = await db_get_user(server_username);
    socket.emit('chat_list', conversations);
  }, DB_REFRESH_TIME);

  message_interval = setInterval(async () => { //emit messages
    if(server_chat_id === "" || server_username === "")
    {
      return;
    }
    let result = await db_get_messages(server_chat_id, newest_time); //db get could take in newest time to see if need get whole data
    for (const ele of result)
    {
      newest_time = ele.Time_Sent;
      socket.emit('chat_message', {"Text": ele.Text, "User_ID": ele.User_ID, "Time_Sent": ele.Time_Sent});
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

  socket.on('chat', function(chat_id)
  {
    newest_time = new Date(0);
    
    function ID_Present(element) {
      return chat_id == element["_id"];
    }
    if(conversations.some(ID_Present))
    {
      server_chat_id = chat_id;
    }
    else
    {
      console.log("Chat not in current chats");
    }
  });

  socket.on('new_chat', async function(member_list)
  {
    console.log(member_list);
    newest_time = new Date(0);
    if(!(member_list.includes(server_username)))
    {
      console.log("Must be a member of the chat");
    }
    else
    {
      console.log("making chat");
      server_chat_id = await db_make_chat(member_list)
    }
  });

  socket.on('delete_chat', function(chat_id)
  {
    function ID_Present(element) {
      return chat_id == element["_id"];
    }
    if(conversations.some(ID_Present))
    {
      db_delete_chat(chat_id);
    }
    else
    {
      console.log("Chat not in current chats for removal");
    }
  });

  socket.on('message', function(message)
  {
    console.log(message); 
  
    //call MongoDB
    if(server_chat_id != "" && server_username != "")
    {
      db_send(message, server_username, server_chat_id);
    }
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
      socket.emit('verified', email);
    }
    catch(err)
    {
      console.error(err); //code to be executed if an error occurs
      console.log(server_username, "failed to login");
      server_username = ""; //might take time to run due to async
    }
  }
  socket.on('google_sign', function(token)
  {
    verify(token);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    if(chat_interval)
      clearInterval(chat_interval);
    if(message_interval)
      clearInterval(message_interval);
  });
});

function read_cookie(name, cookies)
{
    let cookie_array = cookies.split(';');
    for(let i = 0; i < cookie_array.length; i++) {
        let cookie_pairs = cookie_array[i].split("=");
        if(name == cookie_pairs[0].trim()) {
            return cookie_pairs[1].trim();
        }
    }
}


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { channel } = require('diagnostics_channel');
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
    const messageCollection = database.collection("messages");
    const doc = {"User_ID": username, "Chat_ID": chat_id, "Text": message, "Time_Sent": new Date()};
    messageCollection.insertOne(doc);
    const chatCollection = database.collection("chats");
    chatCollection.updateOne({ "_id": new ObjectId(chat_id) }, { "$set": {"Last_Updated" : new Date(), "Last_Message": message} } );
  } catch (error) {
    console.error('An error occurred while connecting to MongoDB', error);
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close(); //don't run - will still be getting data
  }
}

async function db_make_chat(member_list)
{
  result = 0;
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB! for send");
    const database = client.db("testDB")
    const chatCollection = database.collection("chats");
    const userCollection = database.collection("users");
    console.log("Creating conversation");
    let chat_id = await chatCollection.insertOne({"Members" : member_list, "Last_Updated": new Date(), "Last_Message": ""});
    result = chat_id.insertedId;
    if(result == 0)
    {
      console.log("failed to create")
      return;
    }

    for (const member of member_list)
    {
      try
      {
        console.log("trying to push", result, "to member", member);
        //userCollection.updateOne({ "User_ID": member }, { $push: { "Conversations": result.valueOf() } });
        userCollection.updateOne(
          { "User_ID": member },
          {
            $addToSet: { "Conversations": result.valueOf() },
            //$setOnInsert: { "Conversations": [result.valueOf()] }
          },
          { upsert: true }
        );
      }
      catch
      {
        console.log("failed to update a user");
      }
    }
  } catch (error) {
    console.error('An error occurred while connecting to MongoDB', error);
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close(); //don't run - will still be getting data
  }
}

async function db_delete_chat(chat_id)
{
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB! for send");
    const database = client.db("testDB")
    const chatCollection = database.collection("chats");
    const userCollection = database.collection("users");
    const messageCollection = database.collection("messages");

    console.log("starting deletion on", chat_id);
    let members = await chatCollection.findOne({"_id": new ObjectId(chat_id)});
    console.log("members are", members["Members"]);

    for (const member of members["Members"])//delete out of member's conversation list
    {
      console.log("is a member", member);
      userCollection.updateMany({"User_ID": member}, { $pull: { "Conversations": new ObjectId(chat_id) } })
    }

    messageCollection.deleteMany({"Chat_ID": chat_id});//delete messages 

    chatCollection.deleteOne({"_id": new ObjectId(chat_id)}); //delete chat

  } catch (error) {
    console.error('An error occurred while connecting to MongoDB', error);
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close(); //don't run - will still be getting data
  }
}

async function db_get_user(email)
{
  let result = [];
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("testDB")
    const userCollection = database.collection("users");
    const chatCollection = database.collection("chats");
    const user = await userCollection.findOne({ User_ID: email });
    if(user === null)
    {
      console.log("user getting added");
      userCollection.insertOne({"User_ID": email, "Conversations": []});
    }
    else
    {
      conversation_list = user["Conversations"];
      result = await chatCollection.find({"_id": {$in: conversation_list} }).
        sort({Last_Updated: -1}).toArray();

        //result = await userCollection
  }
  } catch (error) {
    console.error('An error occurred while connecting to MongoDB', error);
  } finally {
    //await client.close(); //don't run - will still be getting data
    return result;
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
    const testCollection = database.collection("messages");
    
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