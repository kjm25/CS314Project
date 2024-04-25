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
    console.log(event);
});


const validate_message = function (text)
{
    return text != "";
}