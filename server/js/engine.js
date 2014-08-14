/**
@brief : module qui realise la gestion du moteur du jeu
	il fait les calculs et les renvoit au différents joueur (clients)
**/

var elaspedTime;
var VMAX = 15;
var oldDate = new Date();


exports.updateMove = function (socket, userData)
{
	socket.vx += socket.agx * elaspedTime; 
	socket.vy += socket.agy * elaspedTime;

 	socket.posx += socket.vx * elaspedTime;
 	socket.posy += socket.vy * elaspedTime;

 	if(socket.posx < 0) 
 	{
 		socket.posx = 0;
 	}
}

exports.updateTime = function (currentDate)
{
	elaspedTime = (currentDate.getTime() - oldDate.getTime()) / 1000;
	oldDate = new Date();
}