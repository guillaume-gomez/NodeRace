var express = require('express');
var app = express();
var server = require('http').createServer(app);
var http = require('http');
var fs = require('fs');

//le moteur de jeu
var gameEngine = require('./js/engine');
var tools = require('./js/tools');
var chatF = require('./js/chat');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// Chargement de socket.io
var io = require('socket.io').listen(server);
var config = JSON.parse(fs.readFileSync("public/config.json").toString());

//les variables
var instances = [];
var cars = [];
var indexPartie = 0;

function tick(socket, carInfos) {
    //on met à jour la date coté serveur
    var currentDate = new Date();
    if(
        instances[ socket.indexPartie ].launched &&
         (currentDate.getTime() - socket.datePing.getTime()) > 5000)
    {
        console.log("Il est parti sans rien dire le client");

        if( tools.disconnect(socket, io, instances[socket.indexPartie]) == 0 )
        {
            chatF.deleteChatInstance( socket.indexPartie );
        }
    }

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
}

// Quand on client se connecte
io.sockets.on('connection', function (socket) {
    //connextion du futur module de chat
    chatF.getChatMessage(socket);

    socket.on('login', function(message) {
        socket.datePing = new Date();
        //on recupere le login et on enverra l'id de le voiture dans la partie
        var index;
        if(message.host == true)
        {
            console.log("hote : Creation d'une partie");
            //on est forcement la premiere voiture à ce connecté
            index = 0;
            var passwd = message.password;
            if(message.private != true)
            {
                passwd = "";
            }
            var newInstance = { host: socket.id,
                                password: passwd,
                                //track.id sera l'id du circuit
                                track: 56,
                                cars: [],
                                nbCars:1,
                                minCar: message.minCar,
                                maxCar: message.maxCar,
                                launched: false
                            };
            instances.push(newInstance);
            chatF.addChatInstance(indexPartie);
            
            socket.indexPartie = indexPartie;
            console.log(socket.indexPartie)
            //on incremente l'index des parties
            indexPartie++;

        }
        else
        {
            console.log("client");
            //on recherche une partie et donc son index
            var indexPart = tools.findGame(message.private, message.password, instances);
            if(indexPart == -1)
            {
                socket.emit('erreur', 'Aucune partie trouvé');
                return false;
            } 
            socket.indexPartie = indexPart;
            //on recupere un id de connexion
            index = instances[ indexPart ].nbCars - 1;
            //on incremente le nombre de voiture
            instances[ indexPart ].nbCars++;
        }
        //on emet l'id au client
        socket.emit('id', index);
        socket.broadcast.emit('messageServeur', 'Un autre client vient de se connecter !');

        console.log(message.login + ' vient de se connecter');
        console.log(message.login +  socket.indexPartie);
        
        var car = 
        {
            id: index,
            sock: socket.id,
            indexPartie: socket.indexPartie,
            nickname: message.login,
            accel : 0,  // percentage
            speed: 0,
            velocity : {x: 0, y: 0},
            position: {x: gameEngine.getStart(0).x, y: gameEngine.getStart(0).y},
            angle: 0,
            lastTimeUpdate: new Date(),
            nextTrajectoryIndex: 1
        }

        //on ajoute la voiture à la bonne partie
        instances[ socket.indexPartie ].cars.push(car);
        console.log(JSON.stringify(instances[ socket.indexPartie ]));
        
        //on teste si la partie doit demarrer
        tools.checkLaunch(instances[ socket.indexPartie ], io);
        setInterval(tick, 8, socket, car);

        //on gere le chat
        socket.login = message.login;
        chatF.getOldMessages(socket);
    }); 

    //quand le client envoit son acceleration
    socket.on('accel', function(accel) {
        instances[socket.indexPartie].cars[accel.id].accel = accel.percent;
    });

    socket.on('ping', function(clientDate) {
        datePing = new Date();
        socket.datePing = datePing;
        socket.emit('ping', clientDate);
    });

    socket.on('switchTrack', function(trackInfo) {
        //reset engine
        //instances[ socket.indexPartie ].track.id = trackInfo.id;
        //gameEngine.reset( instances[ socket.indexPartie ] );
        //tools.manageLaunch( instances[ socket.indexPartie ], io);
    });

    socket.on('deconnexion', function(message) {
        console.log(socket.login+" s'est deconnecté");
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