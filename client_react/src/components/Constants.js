export const SERVER_EMIT_SELECT_CHAT = 'chat';
export const SERVER_RECEIVE_CHAT_LIST = 'chat_list';
export const SERVER_RECEIVE_MESSAGE = 'chat_message';
export const CLIENT_EMIT_MESSAGE = 'message';
export const CLIENT_EMIT_DELETE_CHAT = 'delete_chat';

export const DEBUGGING = false;

export const GREETINGS = ["Hello", "Hi", "Sup"]

export const CLIENT_ID = '278406872967-ds0j19p8s6gouvvklrma8cmpjicpmnfu.apps.googleusercontent.com'



export const FAKE_CONVERSATION_DATA = [
    {
        _id : 574826526789,
        Members : [
            "willschw@pdx.edu",
            "kjm25@pdx.edu",
            "rjchaney@pdx.edu",
            "karlaf@pdx.edu",
            "mike@pdx.edu",
            "root@pdx.edu",
            "null@null.edu"
        ],
        Last_Updated : new Date(),
        Last_Message : "ir email address (by splitting each contact by the delimiter '@' and selecting the first item.).  After doing that, join the array of "
    },
    {
        _id : 589417853184317,
        Members : [
            "willschw@pdx.edu",
            "kjm25@pdx.edu",
            "rjchaney@pdx.edu",
            "karlaf@pdx.edu",
            "mike@pdx.edu",
            "root@pdx.edu",
            "null@null.edu"
        ],
        Last_Updated : "2024-05-29T10:12:00",
        Last_Message : "New Message in the Preview Section. email address (by splitting each contact by the delimiter. email address (by splitting each contact by the delimiter"
    },

]

export const FAKE_MESSAGE_DATA = [
    {
        User_ID : "willschw@pdx.edu", 
        Time_Sent: "2024-05-31T10:00:00", 
        Text: "Hey, how's it going?"
    },
    {
        User_ID : "user456", 
        Time_Sent: "2024-05-31T10:05:00", 
        Text: "Hey! I'm good, thanks for asking. What about you?"
    },
    {
        User_ID : "willschw@pdx.edu", 
        Time_Sent: "2024-05-31T10:08:00", 
        Text: "I'm doing alright, just catching up on some work. Anything interesting happening?"
    },
    {
        User_ID : "user456", 
        Time_Sent: "2024-05-31T10:12:00", 
        Text: "Not much, just finished a book I've been reading. What kind of work are you catching up on?"
    },
    {
        User_ID : "willschw@pdx.edu", 
        Time_Sent: "2024-05-31T10:15:00", 
        Text: "Oh, it's mostly project stuff. Trying to meet some deadlines."
    }
]
