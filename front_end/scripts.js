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