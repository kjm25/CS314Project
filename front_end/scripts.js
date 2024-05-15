
const send_message = function(message) {
    console.log(message);
};

const MESSAGE = document.getElementById("message-text");

MESSAGE.addEventListener('submit', function(event) {
    // Prevent default prevents the page from reloading upon submit
    event.preventDefault();

    // Get the text from the form.
    // The message element is the text box that users type into.
    const MESSAGE_TEXT = document.getElementById("message").value;

    if (validate_message(MESSAGE_TEXT)) {
        send_message(MESSAGE_TEXT);
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

    var messages = document.getElementById('messages');
    while(messages.firstChild) messages.removeChild(messages.firstChild);//empty on username change

    // Get the text from the form.
    // The message element is the text box that users type into.
    const USERNAME_TEXT = document.getElementById("username").value;

    console.log("New Username: " + USERNAME_TEXT);

    globalsocket.emit('username', USERNAME_TEXT);
});


const validate_message = function (text)
{
    return text != "";
}


// <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
function socket_connection()
{
    var socket = io();
    window.globalsocket = socket;

    var messages = document.getElementById('messages');

    socket.on('chat message', function(msg) 
    {
      var item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });
} 