const { io, close_server, client, db_get_user, db_send_message} = require('./server');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const socket_client = require('socket.io-client');
//const { MongoMemoryServer } = require('mongodb-memory-server'); //allows creation of mock MongoDB for testing
let clientSocket;


beforeAll(async () => { //before tests starts connect to MongoDB
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    clientSocket = socket_client(`http://localhost:3000`);

   // await client.connect();
    //db = client.db('testDB');
});

afterAll(async () => { //after tests close Mongo and socket.io

    //await client.close();
    io.close();
    close_server();
});

describe("socket_io test", () => {
    test('ping server', async () => {
        const pongPromise = new Promise((resolve, reject) => {
            clientSocket.on('pong', (pong) => {
                expect(pong).toBe("pong");
                resolve();//errors that break promise will be caught by jest
            });
        });

        clientSocket.emit('ping');
        await pongPromise;
    });
}); 


describe("google login test", () => {
    //a valid google login token for testing - get a recent one from document.cookie on a signed in chaterize page.
    const valid_google_token = {"credential":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjY3NGRiYmE4ZmFlZTY5YWNhZTFiYzFiZTE5MDQ1MzY3OGY0NzI4MDMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNzg0MDY4NzI5NjctZHMwajE5cDhzNmdvdXZ2a2xybWE4Y21wamljcG1uZnUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNzg0MDY4NzI5NjctZHMwajE5cDhzNmdvdXZ2a2xybWE4Y21wamljcG1uZnUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQzNTA0Mjc0ODc2MDcwMDMyNjgiLCJoZCI6InBkeC5lZHUiLCJlbWFpbCI6ImtqbTI1QHBkeC5lZHUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzE3Nzc3OTA4LCJuYW1lIjoiS2V2aW4gTWFjZG9uYWxkIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pCOFAtVGtITGNwLVc0VXcwb1ZxZGRjcFhrcXduTkItSGNlZVNmcC1jVmk4WE5VQT1zOTYtYyIsImdpdmVuX25hbWUiOiJLZXZpbiIsImZhbWlseV9uYW1lIjoiTWFjZG9uYWxkIiwiaWF0IjoxNzE3Nzc4MjA4LCJleHAiOjE3MTc3ODE4MDgsImp0aSI6IjcxODNkNzY0MDMxYmQ5NDU2YjBjMTllMzhlY2E3NzUxZGZiNTc2MTQifQ.w8Bn5caPrDApiQQvF6nXXnxRLQE6eQE67-UKsQcJHJe3j1-yxN9_FAyAQm1pESLJLWfHtL7UB_u2V-S221q9fysbkG0mLHqsd5Wp3Hb0Fe32dtA_22uEOph2IgYi2Qg6snK97nJUNQySdz36AaXaSzS7cxCWyjuhvd37fcwwnVRiYoQAGbmHQM3XhToDWux3vlGgJkWDoS9zN3_BxK3fIz2HIuR3jXPqzCfMgrOvqgKFzCjACfePkFZ6UmGN48zM_fn6AeMmqSDWousmqm3gL1LgqbobXJGmgRZKFVw9UAG86QbNluOARiumlFTjQj9X7cwdYq5aCoSu3UCghY7omQ","select_by":"fedcm"}
    const invalid_google_token = {"credential":"eyJZnUuY2FhO8qAkw7IK6elrAfVGMI-2IQ","select_by":"fedcm"}

    test('test valid login', async () => {
        const googlePromise = new Promise((resolve, reject) => {
            clientSocket.on('verified', (username) => {
                expect(username).toBe("kjm25@pdx.edu");
                resolve();//errors that break promise will be caught by jest
            });
        });
        clientSocket.emit('google_sign', valid_google_token);
        await googlePromise;
    });

    test('test invalid login token', async () => {
        const googlePromise = new Promise((resolve, reject) => {
            clientSocket.on('not_verified', () => {
                resolve();
            });
        });

        clientSocket.on('verified', (username) => {
            expect(1).toBe(2);//error if verified is emmited in this test
            resolve();//errors that break promise will be caught by jest
        });

        clientSocket.emit('google_sign', invalid_google_token);
        await googlePromise;
    });

    test('test non token', async () => {
        const googlePromise = new Promise((resolve, reject) => {
            clientSocket.on('not_verified', () => {
                resolve();
            });
        });

        clientSocket.on('verified', (username) => {
            expect(1).toBe(2);//error if verified is emmited in this test
            resolve();//errors that break promise will be caught by jest
        });

        clientSocket.emit('google_sign', null);
        await googlePromise;
    });
}); 

//DB tests - might sometimes give fails if operations in test are not completed in order by Mongo

//group of tests for db_get_user: It get a user's conversation array
// or creates the user and returns an empty array if the user does not exist
describe('db_get_user', () => {
    const database = client.db("testDB")
    const userCollection = database.collection("users");
    const chatCollection = database.collection("chats");
  
    test('Get the full conversation list for an existing user', async () => {
        message_list = await db_get_user("kjm25@pdx.edu"); //running db_get_user
        message_ids_direct = await userCollection.findOne({ User_ID: "kjm25@pdx.edu" });
        message_ids_direct = message_ids_direct["Conversations"];
        message_list_direct = await chatCollection.find({"_id": {$in: message_ids_direct} }).sort({Last_Updated: -1}).toArray();;
        
        expect(message_list).toBeInstanceOf(Array);
        expect(message_list).not.toBe([]);
        expect(message_list).toStrictEqual(message_list_direct);
    });

    test('Get empty list for an non-exisitng user', async () => {
        await userCollection.deleteMany({ User_ID: "USER_DOES_NOT_EXIST@pdx.edu" }) //ensure no matches in the database
        message_list = await db_get_user("USER_DOES_NOT_EXIST@pdx.edu"); //running db_get_user
        user_now_exist = await userCollection.findOne({ User_ID: "USER_DOES_NOT_EXIST@pdx.edu" });
        
        expect(message_list).toBeInstanceOf(Array);
        expect(message_list).toStrictEqual([]);
        expect(user_now_exist["User_ID"]).toBe("USER_DOES_NOT_EXIST@pdx.edu");
        expect(user_now_exist["Conversations"]).toStrictEqual([]);
    });

    test('Non string input for the username', async () => {
        message_list = await db_get_user([]); //running db_get_user
        user_now_exist = await userCollection.findOne({ User_ID: [] });
        
        expect(message_list).toBeInstanceOf(Array);
        expect(message_list).toStrictEqual([]);
        expect(user_now_exist).toBeNull(); //no data added to database with non-string
    });
  
}); 

//test if db_send_message correctly sends messages to the db with the given message_text, username, and chat_id
describe('db_send_message', () => {
    const database = client.db("testDB")
    chat_id = "66621fd172a725c1c00314e4"; //existing chat to not depend on new chat function
    const messageCollection = database.collection("messages");
    const chatCollection = database.collection("chats");

    test('insert correct message and retrieve message', async () => {
        await messageCollection.deleteMany({ User_ID: "jest test name" }); //ensure none already in the database
        await db_send_message("jest test message", "jest test name", chat_id);
        message = await messageCollection.findOne({ User_ID: "jest test name" });

        expect(message["User_ID"]).toBe("jest test name");
        expect(message["Text"]).toBe("jest test message");
        expect(message["Chat_ID"]).toBe(chat_id);
    });

    test('insert correct message and retrieve Last_Message from conversation', async () => {
        await messageCollection.updateOne({ "_id": new ObjectId(chat_id)}, 
        { "$set": { "Last_Message": "unset data by jest"} }); //ensure no Last message data from previous test
        
        await db_send_message("jest test message", "jest test name", chat_id);
        chat = await chatCollection.findOne({ "_id": new ObjectId(chat_id)});

        expect(chat["Last_Message"]).toBe("jest test message");
    });

    test('Test injection strings', async () => {
        await messageCollection.deleteMany({ User_ID: "jest test name" }); //ensure none already in the database
        await db_send_message('{"$ne":null}' , "jest test name", chat_id);
        message = await messageCollection.findOne({ User_ID: "jest test name" });

        expect(message["User_ID"]).toBe("jest test name");
        expect(message["Text"]).toBe('{"$ne":null}');
        expect(message["Chat_ID"]).toBe(chat_id);
    });

    test('Test non string messages', async () => {
        await messageCollection.deleteMany({ User_ID: "jest test name2" }); //ensure none already in the database
        await db_send_message([] , "jest test name2", chat_id);
        message = await messageCollection.findOne({ User_ID: "jest test name2" });

        expect(message["User_ID"]).toBe("jest test name2");
        expect(message["Text"]).toStrictEqual("");
        expect(message["Chat_ID"]).toBe(chat_id);
    });
});  
