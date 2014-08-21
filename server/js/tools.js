// Module qui contient des fonctions pour la gestion d'une partie sur le serveur


//if index = -1, alors il n'y a pas de partis disponible
exports.findGame = function(isPrivate, passwd, instances)
{
    for (var i = 0; i < instances.length; i++) 
    {
        if(instances[ i ].private == false)
        {
            if(instances[ i ].nbCars <= instances[ i ].minCar)
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
                if(instances[ i ].nbCars <= instances[ i ].minCar)
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
exports.checkLaunch = function(instance, io)
{
    if(instance.minCar == instance.nbCars)
    {
        instance.launched = true;
        //on emet un signal lorsque tout les joueurs sont connecté
        for (var i = 0; i < instance.nbCars; i++)
        {
            //on envoit un message à chacun des joueurs de la partie pour lancé un decompte
            io.to( instance.cars[ i ].sock ).emit('depart', 'le jeu va demarrer');
        }
        this.manageLaunch(instance, io);
    }
}

//creer un decompte avant le commencement de la partie
exports.manageLaunch = function(instance, io)
{
   var decompte = 3;
   function counting(instance)
   {
        for (var i = 0; i < instance.nbCars; i++)
        {
            //on envoit un message à chacun des joueurs de la partie pour lancé un decompte
            io.to( instance.cars[ i ].sock ).emit('decompte', decompte);
        }
        console.log("decompte "+decompte);
        if(decompte == 0)
        {
            clearInterval(inter);
            console.log("c'est partie pour la partie de l'hote :'"+instance.host+"'");
        }
        decompte--;
   }

   var inter = setInterval(counting, 1000, instance);
}

exports.disconnect = function(socket, io, instance)
{
        //si c'est l'hote
        if(instance.host == socket.id)
        {
            for(var i = 0; i < instance.nbCars; i++)
            {
                io.to( instance.cars[ i ].sock ).emit('deconnexionPartie', "L'hote à quitter la partie");
            }
            delete instance;

        }
        else
        {
            for(var i = 0; i < instance.nbCars; i++)
            {
                if(instance.cars[ i ].sock == socket.id)
                {
                    delete cars[ i ];
                }
            }
        }
}

