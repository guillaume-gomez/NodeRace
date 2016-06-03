var constants = require('./../public/constants.js');
constants = new constants();

var ArrayMessages = new Array();

exports.addNewMessage = function(socket) {
    // trigger on 'send' button
    socket.on(constants.message, function(message) {
        // get the nickname
        var newMessage = {
            'login': socket.login,
            'message': message
        };
        for (var i = 0; i < ArrayMessages.length; i++) {
            if (socket.uid == ArrayMessages[i].id) {
                ArrayMessages[i].listMessage.push(newMessage);
                socket.broadcast.to(ArrayMessages[i].room).emit(constants.message, JSON.stringify(newMessage));

                if (ArrayMessages[i].listMessage.length > 15) {
                    //delete the oldest messages
                    ArrayMessages[i].listMessage.splice(0, 1);
                }
                break;
            }
        }
    });
}


exports.getOldMessages = function(socket) {
    for (var i = 0; i < ArrayMessages.length; i++) {
        if (socket.uid == ArrayMessages[i].id) {
            if (ArrayMessages[i].listMessage.length > 0) {
                socket.emit(constants.oldMessages, JSON.stringify(ArrayMessages[i].listMessage));
            }
            break;
        }
    }
}

exports.addChatInstance = function(id, room) {
    var newChat = {
        id: id,
        room: room,
        listMessage: []
    };
    ArrayMessages.push(newChat);
    console.log("new instance channel: {" + id + "}");

}

exports.deleteChatInstance = function(id) {
    for (var i = 0; i < ArrayMessages.length; i++) {
        if (id == ArrayMessages[i].id) {
            console.log("deletion of the channel: {" + id + "}");
            ArrayMessages.splice(i, 1);
            break;
        }
    }
}
