var express = require('express');
var app = express();
var server = require('http').Server(app);

const config = require("./js/config");

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));


var gameModel = require('./js/levelModel')
//le moteur de jeu
var gameEngine = require('./js/engine');
//fonction de gestion de serveur
var tools = require('./js/tools');
//fonction pour la gestion de chat
var chatF = require('./js/chat');


// Chargement de socket.io
var io = require('socket.io')(server);

//les variables
var instances = [];
var cars = [];

function tick(socket, carInfos) {
    //on met à jour la date coté serveur
    var currentDate = new Date();
    if(
        instances[ socket.indexPartie ].launched &&
         (currentDate.getTime() - socket.datePing.getTime()) > 5000)
    {
        console.log(socket.login+" Deconnexion sur ping  "+socket.id);
        socket.conn.close();
        tools.disconnect(socket, instances, chatF);
    }

    elapsedTime = (currentDate.getTime() - carInfos.lastTimeUpdate) / 1000;
    carInfos.lastTimeUpdate = currentDate;

    //on modifie les positions par le calcul de colission
    //gameEngine.updateMove(carInfos, elapsedTime);
    instances[ socket.indexPartie ].engine.updateMove(carInfos, elapsedTime);
    //renvoit la position sur le circuit
    gameModel.getTrackPosition(instances[ socket.indexPartie ], io);

    if( gameModel.isFinish(instances[ socket.indexPartie ]) )
    {
        socket.emit('finPartie', "fin de partie");
        socket.broadcast.to( instances[ socket.indexPartie ].room ).emit('finPartie', "fin de partie");
        instances[ socket.indexPartie ].launched = false;

    }

    var infos = {
                    id: carInfos.id,
                    speed: carInfos.speed,
                    position: carInfos.position,
                    angle: carInfos.angle,
                    lap: carInfos.lap
                   }

    socket.emit('myPosition', infos);
    //on envoit les coordonnées aux joueurs
    socket.broadcast.to( instances[ socket.indexPartie ].room ).emit('position', infos);
}

// client connection
io.on('connection', function (socket) {

    console.log("user connection");

    //connexion du futur module de chat
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
            else
            {
                if(tools.isInstanceExist(instances, message.password))
                {
                    socket.emit("isExist", "Une partie existe deja avec ce mot de passe");
                }
            }

            var newInstance = { host: socket.id,
                                room : new Date().toString(),
                                password: passwd,
                                //track.id sera l'id du circuit
                                track: message.track,
                                engine: new gameEngine.Engine(message.track),
                                nbLaps: message.laps,
                                cars: [],
                                nbCars:1,
                                minCar: message.minCar,
                                maxCar: message.maxCar,
                                launched: false
                            };

            //on ajoute la room dans socket.io
            socket.join(newInstance.room);

            console.log(newInstance.engine);
            instances.push(newInstance);
            socket.indexPartie = instances.length - 1;
            chatF.addChatInstance(socket.indexPartie, newInstance.room);

            console.log("info new instance :"+socket.indexPartie +"; "+newInstance.room);
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
            index = instances[ socket.indexPartie ].nbCars;
            //on s'ajoute à la bonne partie
            socket.join( instances[ socket.indexPartie ].room );
            //on incremente le nombre de voiture
            instances[ socket.indexPartie ].nbCars++;
        }
        //on emet l'id au client
        socket.emit('id', index);
        var infoPartie = { laps: instances[ socket.indexPartie ].nbLaps ,
                           nbComponents: instances[ socket.indexPartie ].minCar,
                           track: instances[ socket.indexPartie ].track
                        };
        //
        socket.emit('infoPart', infoPartie);
        socket.broadcast.emit('messageServeur', 'Un autre client vient de se connecter !');
        console.log(message.login + ' vient de se connecter');

        var car =
        {
            id: index,
            sock: socket.id,
            indexPartie: socket.indexPartie,
            nickname: message.login,
            accel: 0,  // percentage
            speed: 0,
            velocity: {x: 0, y: 0},
            position: {x: instances[ socket.indexPartie ].engine.getStart( index ).x,
                       y: instances[ socket.indexPartie ].engine.getStart( index ).y
                    },
            angle: 0,
            lastTimeUpdate: new Date(),
            nextTrajectoryIndex: 1,
            lap: 1,
        }

        //on ajoute la voiture à la bonne partie
        instances[ socket.indexPartie ].cars.push(car);
        console.log("information room "+JSON.stringify(instances[ socket.indexPartie ].nbCars));

        //on teste si la partie doit demarrer
        tools.checkLaunch(instances[ socket.indexPartie ], socket);
        socket.tick = setInterval(tick, 8, socket, car);

        //on gere le chat
        socket.login = message.login;
        chatF.getOldMessages(socket);
    });

    //quand le client envoit son acceleration
    socket.on('accel', function(accel) {
        if(typeof instances[socket.indexPartie] !== 'undefined')
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

    socket.on('disconnect', function(message) {
        console.log(socket.login+" s'est deconnecté "+socket.id);
        socket.leave(  instances[ socket.indexPartie ].room );
        tools.disconnect(socket, instances, chatF);
        clearInterval( socket.tick );
        socket.emit('closeCo');
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

server.listen(config.port, function () {

    console.log('listening on *:' + config.port);

});
