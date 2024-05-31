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
    const valid_google_token = {"credential":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjY3MTk2NzgzNTFhNWZhZWRjMmU3MDI3NGJiZWE2MmRhMmE4YzRhMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNzg0MDY4NzI5NjctZHMwajE5cDhzNmdvdXZ2a2xybWE4Y21wamljcG1uZnUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNzg0MDY4NzI5NjctZHMwajE5cDhzNmdvdXZ2a2xybWE4Y21wamljcG1uZnUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQzNTA0Mjc0ODc2MDcwMDMyNjgiLCJoZCI6InBkeC5lZHUiLCJlbWFpbCI6ImtqbTI1QHBkeC5lZHUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzE3MTQwOTYyLCJuYW1lIjoiS2V2aW4gTWFjZG9uYWxkIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pCOFAtVGtITGNwLVc0VXcwb1ZxZGRjcFhrcXduTkItSGNlZVNmcC1jVmk4WE5VQT1zOTYtYyIsImdpdmVuX25hbWUiOiJLZXZpbiIsImZhbWlseV9uYW1lIjoiTWFjZG9uYWxkIiwiaWF0IjoxNzE3MTQxMjYyLCJleHAiOjE3MTcxNDQ4NjIsImp0aSI6IjFlYTAxN2ZkY2FhOTdlZjAzNzI4OTI5NjJiYWY4MTVmYjk3YjQzMmUifQ.mHAIAGfhlI5Hp6p8nL_sU57Oq5rZHTT9q6VFCWwGaB4Yi2NicmT0bpYUQ6Wu3gSS-CNMl9Gnv9wE5EDr-nIkMDBLyO8iz0Q7sP7QS8f0KWhaAtJlsKMxfimtjaUAYROEZeSXXk2O4kz8e_N5m6p--5gsk6OpUQOdTfiblqEVe5SzVn8NgCxyi4EdZZrVasHeyUFWGFRokcJ-au0vBXSp9FMweDJCD5iajemHCPdU7RHHOw4WXgqgDvnL6y33m7inEoV6jdDdK67fAekJHur2uJzL29JuwAJkKV0MHSTgKX8qAkw7IT2vx1GbPEO69aYue0uOznJK6elrAfVGMI-2IQ","select_by":"fedcm"}
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
    chat_id = "665667dcb8ad2de1dda7e234"; //existing chat to not depend on new chat function
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
