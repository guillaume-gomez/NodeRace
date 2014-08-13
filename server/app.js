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

// Quand on client se connecte
io.sockets.on('connection', function (socket) {

    socket.set('id', index);
    index++;

    socket.on('login', function(login) {
        socket.set('login', login);
        console.log(login + ' vient de se connecter');
        socket.broadcast.emit('messageServeur', 'Un autre client vient de se connecter !');
    }); 


    socket.on('position', function(position) {
        //position.x position.y
        var pos = JSON.parse(position);
        //on envoit les coordonnées aux autres joueurs
        socket.broadcast.emit('position', pos);

        socket.get('id', function (error, id) {
            console.log(id + ' me parle ! Il me dit : ' + position);
        });
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


server.listen(8080, "192.168.0.31");
