var express = require('express');
var app = express();
var server = require('http').createServer(app);
var http = require('http');
var fs = require('fs');

//le moteur de jeu
var gameEngine = require('./public/js/engine');


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

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
        
        // console.log(login + ' vient de se connecter');
        socket.broadcast.emit('messageServeur', 'Un autre client vient de se connecter !');

    }); 


    socket.on('position', function(position) {
        /*
            'x'  : this.getMyPositionX(),
            'y'  : this.getMyPositionY(),
            'agx': this.getMyAgX(),
            'agy': this.getMyAgY(), 
            'clientDate' : date
        */
        var pos = JSON.parse(position);

        socket.posx = pos.x;
        socket.posy = pos.y;
        socket.vx = 0; 
        socket.vy = 0;

        pos.id = socket.id;
        /*socket.get('id', function(error,id) {
            pos.id = id;
        });*/

        //on met à jour la date coté serveur
        var date = new Date();
        gameEngine.updateTime(date);
        pos.serveurDate = date;

        //on modifie les positions par le calcul de colission
        gameEngine.updateMove(socket, pos);
        pos.x = socket.posx;
        pos.y = socket.posy;

        socket.emit('myPosition', pos);
        //on envoit les coordonnées aux autres joueurs
        socket.broadcast.emit('position', pos);
    });
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