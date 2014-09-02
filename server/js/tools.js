// Module qui contient des fonctions pour la gestion d'une partie sur le serveur


//if index = -1, alors il n'y a pas de partis disponible
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

// regarde si le nombre de voitures connectées sur une partie est suffisant pour commencer une partie
exports.checkLaunch = function(instance, socket)
{
    console.log("checkLaunch --> "+instance.minCar+"   "+instance.nbCars);
    if(instance.minCar == instance.nbCars)
    {
        instance.launched = true;
        //on emet un signal lorsque tout les joueurs sont connecté
        socket.emit('depart', 'le jeu va demarrer');
        console.log( instance.room );
        socket.broadcast.to( instance.room ).emit('depart', 'le jeu va demarrer');
      
        this.manageLaunch(instance, socket);
    }
}

//creer un decompte avant le commencement de la partie
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
            console.log("c'est partie pour la partie de l'hote :'"+instance.host+"'");
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
            //il faudra trouver un autre moyen car le nombre de voiture doit rester constant pour eviter qu'on
            // repropose l'instance à d'autre nouveau joueur
            /*if(instances[ socket.indexPartie ].cars[ i ].sock == socket.id)
            {
                instances[ socket.indexPartie ].nbCars--;
            }*/

            //temp à verifier
            if(instances[ socket.indexPartie ].cars[ i ].sock == socket.id)
            {
                instances[ socket.indexPartie ].minCar--;
            }
        }
 
        //if( instances[ socket.indexPartie ].nbCars == 0)
        // idem voir plus haut
        if(instances[ socket.indexPartie ].minCar == 0)
        {
            instances[ socket.indexPartie ].launched = false;
            socket.emit('deconnexionPartie', "L'hote à quitter la partie");
            socket.broadcast.to( instances[ socket.indexPartie ].room ).emit('deconnexionPartie', "L'hote à quitter la partie");
            console.log("disconnection of the current instance "+ instances[ socket.indexPartie ].host);
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