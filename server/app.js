var express = require('express');
var app = express();
var server = require('http').createServer(app);
var http = require('http');
var fs = require('fs');


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// Chargement de socket.io
var io = require('socket.io').listen(server);

//var arrayGames = new Array();
//var game = new Game();
var index = 0;

var config = JSON.parse(fs.readFileSync("public/config.json").toString());

// Quand on client se connecte
io.sockets.on('connection', function (socket) {

    socket.on('login', function(login) {
        //on recupere le login ainsi que l'id de le voiture dans la partie
        //socket.set('login', login);
        socket['login'] = login;
        socket['id'] = index;
        //socket.set('id', index);
        socket.emit('id', index);
        index++;
        
        // console.log(login + ' vient de se connecter');
        socket.broadcast.emit('messageServeur', 'Un autre client vient de se connecter !');

    }); 


    socket.on('position', function(position) {
        //position.x position.y
        var pos = JSON.parse(position);

        pos.id = socket.id;
        /*socket.get('id', function(error,id) {
            pos.id = id;
        });*/

        var date = new Date();
        pos.serveurDate = date;
        //on modifie les positions par le calcul de colission

        
        socket.emit('myPosition', pos);
        //on envoit les coordonnées aux autres joueurs
        socket.broadcast.emit('position', pos);

        /*socket.get('login', function (error, login) {
            console.log(login + ' me parle ! Il me dit : ' + position);
        });*/
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