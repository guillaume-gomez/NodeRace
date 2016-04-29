
var ArrayMessages = new Array();

exports.getChatMessage = function(socket)
{
 // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
    socket.on('message', function (message) {
        // On récupère le pseudo de celui qui a cliqué dans les variables de session
            var newMessage = {'login' : socket.login, 'message' : message};
            for(var i = 0; i < ArrayMessages.length; i++)
			{
				if( socket.indexPartie == ArrayMessages[ i ].id )
				{
					ArrayMessages[ i ].listMessage.push(newMessage);
            		socket.broadcast.to( ArrayMessages[ i ].room ).emit('message', JSON.stringify(newMessage));

		            if(ArrayMessages[ i ].listMessage.length > 15)
		            {
		            	//supprime le plus vieux message
		            	ArrayMessages[ i ].listMessage.splice(0,1);
		            }
		            break;
				}
			}
    });
}

exports.getOldMessages = function(socket)
{
    //on il existe des anciens messages
    for(var i = 0; i < ArrayMessages.length; i++)
	{
		if( socket.indexPartie == ArrayMessages[ i ].id )
		{
			if(ArrayMessages[ i ].listMessage.length > 0)
			{
            	socket.emit("oldMessages", JSON.stringify( ArrayMessages[ i ].listMessage ));
        	}
        	break;
		}
	}
}

exports.addChatInstance = function(id, room)
{
	var newChat = {id: id, room: room, listMessage: []};
	ArrayMessages.push(newChat);
	console.log("nouvelle instance de chat id: "+id);

}

exports.deleteChatInstance = function(id)
{
	for(var i = 0; i < ArrayMessages.length; i++)
	{
		if( id == ArrayMessages[ i ].id )
		{
			console.log("destruction d'une instance de chat id: "+id);
			ArrayMessages.splice(i, 1);
			break;
		}
	}
}