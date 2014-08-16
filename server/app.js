var express = require('express');
var app = express();
var server = require('http').createServer(app);
var http = require('http');
var fs = require('fs');

//le moteur de jeu
var gameEngine = require('./js/engine');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

var cars = [];

function tick(socket, carInfos) {

    //on met à jour la date coté serveur
    var currentDate = new Date();

    elapsedTime = (currentDate.getTime() - carInfos.lastTimeUpdate) / 1000;
    carInfos.lastTimeUpdate = currentDate;

    //on modifie les positions par le calcul de colission
    gameEngine.updateMove(carInfos, elapsedTime);

    var infos = {
                    id: carInfos.id,
                    speed: carInfos.speed,
                    position: carInfos.position,
                    angle: carInfos.angle
                   }

    socket.emit('myPosition', infos);

    //on envoit les coordonnées aux joueurs
    socket.broadcast.emit('position', infos);

    // console.log("DEBUG  tick  ::::::::::::::::::::::::::::::::::::::::::: ")
    // console.log(carInfos);
    // console.log("DEBUG  tick  =========================================== ")
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

        //socket.set('id', index);
        socket.emit('id', index);
        
        // console.log(login + ' vient de se connecter');
        socket.broadcast.emit('messageServeur', 'Un autre client vient de se connecter !');
        
        var car = 
        {
            id: index,
            nickname: login,
            accel : 0,  // percentage
            speed: 0,
            velocity : {x: 0, y: 0},
            position : {x: 70, y: 20+index*40},
            angle: 0,
            lastTimeUpdate: new Date(),
            nextTrajectoryIndex: 1
        }

        cars.push(car);

        setInterval(tick, 8, socket, cars[index]);
        index++;
    }); 

    //quand le client envoit son acceleration
    socket.on('accel', function(accel) {

        cars[accel.id].accel = accel.percent;

        // console.log("DEBUG  ::::::::::::::::::::::::::::::::::::::::::: ")
        // console.log(cars[accel.id]);
        // console.log("DEBUG  =========================================== ")
    });

    socket.on('ping', function(clientDate) {
        socket.emit('ping', clientDate);
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