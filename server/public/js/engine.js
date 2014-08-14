/**
@brief : module qui realise la gestion du moteur du jeu
	il fait les calculs et les renvoit au différents joueur (clients)
**/

var elaspedTime;
var VMAX = 15;
var oldDate = new Date();


exports.updateMove = function (socket, userData)
{
	socket.vx += userData.agx * elaspedTime; 
	socket.vy += userData.agy * elaspedTime;

 	socket.posx += socket.vx * elaspedTime;
 	socket.posy += socket.vy * elaspedTime;

 	//on met à jour les données envoyées au client
 	//userData.x = socket.posx;
 	//userData.y = socket.posy;

}

exports.updateTime = function (currentDate)
{
	elaspedTime = (currentDate.getTime() - oldDate.getTime()) / 1000;
	oldDate = new Date();
}