function manageChat(socket) {
    socket.on(jaws.constants.message, function(message) {
        var messages = document.getElementById("listMessage");
        var messageJson = JSON.parse(message);
        messages.innerHTML += "<p>" + messageJson.login + " : " + messageJson.message + "</p>";
    })

    socket.on(jaws.constants.oldMessages, function(message) {
        var oldMessages = document.getElementById("oldMessages");
        var messagesJson = JSON.parse(message);

        messagesJson.forEach(logArrayElements);
    })

    $('#submit').click(function() {
        var message = document.getElementById("message").value;
        var listMessage = document.getElementById("listMessage");
        listMessage.innerHTML += "<p>Moi : " + message + "</p>";
        console.log(message);
        socket.emit(jaws.constants.message, message);
        return false;
    })

    function logArrayElements(element, index, array) {
        var messages = document.getElementById("listMessage");
        messages.innerHTML += "<p>" + element.login + " : " + element.message + "</p>";
    }
}
