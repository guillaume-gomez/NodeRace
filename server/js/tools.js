// Tool module to handle some server operations


//if index = -1, no games are available
exports.findGame = function(isPrivate, passwd, instances)
{
    for (var i = 0; i < instances.length; i++)
    {
        if(instances[ i ].private == false)
        {
            if(instances[ i ].nbCars < instances[ i ].minCar)
            {
                if(instances[ i ].launched == false)
                {
                    //console.log("public "+i);
                    return i;
                }
            }
        }
        else
        {
            if(instances[ i ].password == passwd)
            {
                if(instances[ i ].nbCars < instances[ i ].minCar)
                {
                    if(instances[ i ].launched == false)
                    {
                        //console.log("private "+i);
                        return i;
                    }
                }
            }
        }
    }
    return -1;
}

// check if the number of players is enough to start the track
exports.checkLaunch = function(instance, socket)
{
    console.log("checkLaunch --> "+instance.minCar+"   "+instance.nbCars);
    if(instance.minCar == instance.nbCars)
    {
        instance.launched = true;
        //emit a message to start the game
        socket.emit('depart', 'le jeu va demarrer');
        console.log( instance.room );
        socket.broadcast.to( instance.room ).emit('depart', 'le jeu va demarrer');

        this.manageLaunch(instance, socket);
    }
}

//create counting
exports.manageLaunch = function(instance, socket)
{
   var decompte = 3;
   console.log("instance.room "+ instance.room );
   function counting(instance, object)
   {
        socket.emit('decompte', decompte);
        socket.broadcast.to( instance.room ).emit('decompte', decompte);

        console.log("decompte "+decompte);
        if(decompte == 0)
        {
            clearInterval(inter);
            console.log("the game for the host is starting :'"+instance.host+"'");
            object.sendLogin(instance, socket);
        }
        decompte--;
   }

   var inter = setInterval(counting, 1000, instance, this);
}


exports.disconnect = function(socket, instances, chatFunction)
{
        for(var i = 0; i < instances[ socket.indexPartie ].nbCars; i++)
        {
            //not the goog answer, we have to find out how to limit the number of cars to avoid putting a car in multiple game
            /*if(instances[ socket.indexPartie ].cars[ i ].sock == socket.id)
            {
                instances[ socket.indexPartie ].nbCars--;
            }*/

            //not sure :(
            if(instances[ socket.indexPartie ].cars[ i ].sock == socket.id)
            {
                instances[ socket.indexPartie ].minCar--;
            }
        }

        //if( instances[ socket.indexPartie ].nbCars == 0)
        //  see above
        if(instances[ socket.indexPartie ].minCar == 0)
        {
            instances[ socket.indexPartie ].launched = false;
            socket.emit('deconnexionPartie', "L'hote à quitter la partie");
            socket.broadcast.to( instances[ socket.indexPartie ].room ).emit('deconnexionPartie', "L'hote à quitter la partie");
            console.log("disconnection of the current instance "+ instances[ socket.indexPartie ].host);
            // This comment will be remove later
            //pour l'instant ces 2 lignes sont commenté car il faut repenser la structure du tableau gerant les parties
            //en effet si on supprime la partie les index seronts transformé au sein du tableau global des instances
            //chatFunction.deleteChatInstance( socket.indexPartie );
            //instances.splice(socket.indexPartie, 1);
          //  console.log(JSON.stringify(instances));
            return 0;

        }
    return -1;
}


exports.isInstanceExist = function(instances, newPasswd)
{
    for (var i = 0; i < instances.length; i++)
    {
        if( instances[ i ].password == newPasswd)
        {
            return true;
        }
    }
    return false;
}


exports.sendLogin = function (instance, socket)
{
    for(var i = 0; i < instance.nbCars; i++)
    {
        var message = { id: instance.cars[ i ].id,
                        username: instance.cars[ i ].nickname};

        socket.emit('logins', message);
        socket.broadcast.to( instance.room ).emit('logins', message);
    }
}
