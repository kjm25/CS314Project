const MESSAGE = document.getElementById("message-text");
MESSAGE.addEventListener('submit', function(event) {
    // Prevent default prevents the page from reloading upon submit
    event.preventDefault();

    // Get the text from the form.
    // The message element is the text box that users type into.
    const MESSAGE_TEXT = document.getElementById("message").value;

    if (validate_message(MESSAGE_TEXT) == false) {
        console.log("MESSAGE_TEXT was invalid");
        return;
    }

    console.log(MESSAGE_TEXT);

    console.log("New Message: " + MESSAGE_TEXT);

    globalsocket.emit('message', MESSAGE_TEXT);
    document.getElementById("message").value = '';
});


//can remove eventually now that we can get usernames from google. Might be useful for testing
const USERNAME = document.getElementById("username-text");
USERNAME.addEventListener('submit', function(event) {
    // Prevent default prevents the page from reloading upon submit
    event.preventDefault();

    let messages = document.getElementById('messages');
    while(messages.firstChild) messages.removeChild(messages.firstChild);//empty on username change

    // Get the text from the form.
    // The message element is the text box that users type into.
    const USERNAME_TEXT = document.getElementById("username").value;

    if (validate_message(USERNAME_TEXT) == false) {
        console.log("USERNAME_TEXT was invalid");
        return;
    }

    console.log("New Username: " + USERNAME_TEXT);
    globalsocket.emit('username', USERNAME_TEXT);
});

const CHAT = document.getElementById("chat-text");
CHAT.addEventListener('submit', function(event) {
    // Prevent default prevents the page from reloading upon submit
    event.preventDefault();

    let messages = document.getElementById('messages');
    while(messages.firstChild) messages.removeChild(messages.firstChild);//empty on chat change

    // Get the text from the form.
    // The message element is the text box that users type into.
    const CHAT_ID = document.getElementById("chat").value;

    if (validate_message(CHAT_ID) == false) {
        console.log("CHAT_TEXT was invalid");
        return;
    }

    console.log("New Chat: " + CHAT_ID);
    globalsocket.emit('chat', CHAT_ID);
});

const validate_message = function (text)
{
    return text != "";
}

function socket_connection()
{
    var socket = io();
    window.globalsocket = socket; //make a global variable of the socket for other functions

    var messages = document.getElementById('messages');

    socket.on('chat message', function(msg) 
    {
      var item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });
} 



function decodeJwtResponse (token) 
{//from https://stackoverflow.com/questions/68927855/sign-in-with-google-console-log
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function save_cookie(response, exp)
{
    response_string = JSON.stringify(response);
    document.cookie = "id_token=" + response_string + "; expires=" + new Date(exp * 1000).toUTCString() + "; path=/";
    document.cookie = "sid=" + "Logged In" + "; expires=" + new Date(exp * 1000).toUTCString() + "; path=/";
    console.log("id_token=" + response_string + "; expires=" + new Date(exp * 1000).toUTCString() + "; path=/");
}

function read_cookie(name)
{
    console.log("Trying to read cookie");
    let cookie_array = document.cookie.split(';');
    for(let i = 0; i < cookie_array.length; i++) {
        let cookie_pairs = cookie_array[i].split("=");

        if(name == cookie_pairs[0].trim()) {
            globalsocket.emit('google_sign', JSON.parse(cookie_pairs[1]));
        }
    }
}