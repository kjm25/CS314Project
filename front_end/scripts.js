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
    document.cookie = "id_token=" + response_string + "; expires=" + new Date(exp * 1000).toUTCString()
     + "; SameSite=strict" +"; Secure" + "; path=/";
}