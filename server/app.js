var express = require('express');
var app = express();
var server = require('http').Server(app);
var uuid = require('uuid');

const config = require("./js/config");

// console.log(config);

app.use(express.static(__dirname + '/../client'));

app.use('/tracks', express.static(config.tracksDirectory));

var gameModel = require('./js/levelModel')

var gameEngine = require('./js/engine');
var tools = require('./js/tools');
var chatF = require('./js/chat');

var io = require('socket.io')(server);

//load constants in server and client
app.use('/public', express.static('public'));
var constants = require('./public/constants.js');
constants = new constants();


//les variables
var instances = {};

function tick(socket, carInfos) {

    //update server date
    if (instances[socket.uid] && instances[socket.uid] !== undefined) {
        var currentDate = new Date();
        if (
            instances[socket.uid].launched &&
            (currentDate.getTime() - socket.datePing.getTime()) > 5000) {
            console.log("{ " + socket.login + "}:  disconnection : ping too high   " + socket.id);
            car = tools.findCar(instances[socket.uid], socket.id);
            if (car != -1 && car.isHost) {
                tools.disconnectEveryone(socket, instances[socket.uid]);
                tools.disconnect(socket, instances, chatF);
                return;
            }
            instances[socket.uid].nbCars--;
            socket.conn.close();
        }

        elapsedTime = (currentDate.getTime() - carInfos.lastTimeUpdate) / 1000;
        carInfos.lastTimeUpdate = currentDate;
        //update position thanks to gameEngine
        //gameEngine.updateMove(carInfos, elapsedTime);
        instances[socket.uid].engine.updateMove(carInfos, elapsedTime);
        //return track position
        gameModel.getTrackPosition(instances[socket.uid], io);

        if (gameModel.isFinish(instances[socket.uid])) {
            socket.emit(constants.endGame);
            socket.broadcast.to(instances[socket.uid].room).emit(constants.endGame);
            tools.destroyInstance(socket, instances, chatF);
        } else {
            var infos = {
                id: carInfos.id,
                speed: carInfos.speed,
                position: carInfos.position,
                angle: carInfos.angle,
                lap: carInfos.lap
            }
            socket.emit(constants.myPosition, infos);
            socket.broadcast.to(instances[socket.uid].room).emit(constants.position, infos);
        }
    }
}

// client connection

io.on(constants.connection, function(socket) {

    chatF.getChatMessage(socket);


    socket.on(constants.login, function(message) {

        socket.datePing = new Date();

        var id;
        if (message.host == true) {
            console.log("Host : new game");
            //first car connected
            id = 0;

            var passwd = message.password;
            if (message.private != true) {
                passwd = "";

            } else {
                if (tools.isInstanceExist(instances, message.password)) {
                    socket.emit(constants.isExist);

                }
            }

            // console.log("message.track :");
            // console.log(message.track);

            var newInstance = {
                host: socket.id,
                room: new Date().toString(),
                password: passwd,
                //track.id sera l'id du circuit
                track: message.track,
                engine: new gameEngine.Engine(config.tracksDirectory + '/' + message.track),
                nbLaps: message.laps,
                cars: [],
                nbCars: 1,
                minCar: message.minCar,
                maxCar: message.maxCar,
                launched: false
            };

            //add room to socket.io
            socket.join(newInstance.room);

            var uid = uuid.v1();
            instances[uid] = newInstance
            socket.uid = uid;
            chatF.addChatInstance(socket.uid, newInstance.room);
            console.log("info new instance :" + socket.uid + "; " + newInstance.room);
        } else {
            var uid = tools.findGame(message.private, message.password, instances);
            if (uid == -1) {
                socket.emit(constants.instanceNotFound);
                return false;
            }
            socket.uid = uid;
            //connexion id
            id = instances[socket.uid].nbCars;
            //add the new car
            socket.join(instances[socket.uid].room);
            instances[socket.uid].nbCars++;
        }
        var infoInstance = {
            laps: instances[socket.uid].nbLaps,
            nbComponents: instances[socket.uid].minCar,
            track: instances[socket.uid].track
        };
        socket.emit(constants.infoPart, infoInstance);
        socket.emit(constants.id, id);
        socket.broadcast.emit(constants.login, message.login);
        console.log("{ " + message.login + " }: " + ' connected');

        var car = {
                id: id,

                sock: socket.id,
                uid: socket.uid,
                nickname: message.login,
                accel: 0, // percentage
                speed: 0,

                velocity: {
                    x: 0,
                    y: 0
                },
                position: {
                    x: instances[socket.uid].engine.getStart(id).x,
                    y: instances[socket.uid].engine.getStart(id).y
                },

                angle: 0,
                lastTimeUpdate: new Date(),
                nextTrajectoryIndex: 1,
                lap: 1,
                isHost: (id == 0)
            }
            //add car in the right instance
        instances[socket.uid].cars.push(car);
        console.log("information room " + JSON.stringify(instances[socket.uid].nbCars));


        //check if the game will start
        var instanceModified = tools.checkLaunch(instances[socket.uid], socket);
        instances[socket.uid] = instanceModified;

        socket.tick = setInterval(tick, 8, socket, car);

        //handle chat
        socket.login = message.login;
        chatF.getOldMessages(socket);
    });


    //player sent its velocity
    socket.on(constants.acceleration, function(accel) {
        if (instances[socket.uid] && instances[socket.uid] !== undefined)
            instances[socket.uid].cars[accel.id].accel = accel.percent;

    });

    socket.on(constants.ping, function(clientDate) {
        datePing = new Date();
        socket.datePing = datePing;
        socket.emit(constants.ping, clientDate);
    });

    socket.on(constants.switchTrack, function(trackInfo) {
        //reset engine
        //instances[ socket.uid ].track.id = trackInfo.id;
        //gameEngine.reset( instances[ socket.uid ] );
        //tools.manageLaunch( instances[ socket.uid ], io);
    });

    // emitted when a player leave a race, a room,
    // not emitted when a socket disconnect, this is handled by 'disconnect'

    socket.on(constants.disconnection, function(message) {

        if (instances[socket.uid] && instances[socket.uid] !== undefined) {
            socket.leave(instances[socket.uid].room);
            //get info from the recipient
            car = tools.findCar(instances[socket.uid], socket.id);
            if (car != -1 && car.isHost) {
                tools.disconnectEveryone(socket, instances[socket.uid]);
                tools.disconnect(socket, instances, chatF);
                return;
            }
            instances[socket.uid].nbCars--;
            clearInterval(socket.tick);

            socket.emit(constants.closeCo);
        }
    });


    socket.on(constants.disconnect, function() {
        //useless query to REMOVE
        console.log("{ " + socket.login + ' }: disconnected from a game ( socket id :  ' + socket.id + ' ) ');

    });

});



app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/tracksList.json', function(req, res) {
    res.sendfile(config.tracksList);

});

app.use(function(req, res, next) {
    res.status(404).sendfile('404.html');
});

server.listen(config.port, function() {

    console.log('listening on *:' + config.port);

});
