var express = require('express');
var app = express();
var server = require('http').createServer(app);
var http = require('http');
var fs = require('fs');

//le moteur de jeu
var gameEngine = require('./js/engine');


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));


function tick(socket) {
    var position = new Object();
    //on met à jour la date coté serveur
    var date = new Date();
    gameEngine.updateTime(date);
    //on modifie les positions par le calcul de colission
    gameEngine.updateMove(socket);
    position.id = socket.id;
    position.x = socket.posx;
    position.y = socket.posy;
    socket.emit('myPosition', position);
    //on envoit les coordonnées aux joueurs
    socket.broadcast.emit('position', position);
    //console.log(position.id+" "+position.x+" "+position.y);
}

// Chargement de socket.io
var io = require('socket.io').listen(server);

var index = 0;
var config = JSON.parse(fs.readFileSync("public/config.json").toString());

// Quand on client se connecte
io.sockets.on('connection', function (socket) {

    socket.on('login', function(login) {
        //on recupere le login ainsi que l'id de le voiture dans la partie
        //socket.set('login', login);
        socket.login = login;
        socket.id = index;
        //socket.set('id', index);
        socket.emit('id', index);
        index++;
        
        socket.vx = 0; 
        socket.vy = 0;
        socket.agx = 0;
        socket.agy = 0;
        // console.log(login + ' vient de se connecter');
        socket.broadcast.emit('messageServeur', 'Un autre client vient de se connecter !');
        
        var functionTicked = setInterval(function(){tick(socket)},50);

    }); 

    //quand le client envoit son acceleration
    socket.on('position', function(position) {
        /*
            'x'  : this.getMyPositionX(),
            'y'  : this.getMyPositionY(),
            'agx': this.getMyAgX(),
            'agy': this.getMyAgY()
        */
        var pos = JSON.parse(position);
        socket.posx = pos.x;
        socket.posy = pos.y;
        pos.id = socket.id;

        socket.agx = pos.agx;
        socket.agy = pos.agy;
    });


    socket.on('ping', function(ping) {
        var date = new Date();
        var message = JSON.parse(ping);
        message.clientDate = date;
        socket.emit('ping', message);
    });

    socket.on('deconnexion', function(message) {
        console.log(socket.login+" s'est deconnecté");
    })


});


app.get('/', function(req, res) 
{ 
   res.sendfile('index.html');
});

app.use(function(req, res, next)
{
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

server.listen(config.port, config.address);