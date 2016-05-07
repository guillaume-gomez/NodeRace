// Tool module to handle some server operations


//if index = -1, no games are available
exports.findGame = function(isPrivate, passwd, instances)
{
    for (var uid in instances)
    {
        if(instances[ uid ].private == false)
        {
            if(instances[ uid ].nbCars < instances[ uid ].minCar)
            {
                if(instances[ uid ].launched == false)
                {
                    //console.log("public "+i);
                    return uid;
                }
            }
        }
        else
        {
            if(instances[ uid ].password == passwd)
            {
                if(instances[ uid ].nbCars < instances[ uid ].minCar)
                {
                    if(instances[ uid ].launched == false)
                    {
                        //console.log("private "+i);
                        return uid;
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
        socket.emit('startGame', 'The game is starting');
        console.log( instance.room );
        socket.broadcast.to( instance.room ).emit('startGame', 'The game is starting');

        this.manageLaunch(instance, socket);
    }
  return instance;
}

//create counting
exports.manageLaunch = function(instance, socket)
{
   var counting = 3;
   console.log("instance.room "+ instance.room );
   function counting_function(instance, object)
   {
        socket.emit('counting', counting);
        socket.broadcast.to( instance.room ).emit('counting', counting);

        console.log("counting "+counting);
        if(counting == 0)
        {
            clearInterval(inter);
            console.log("the game for the host is starting :'"+instance.host+"'");
            object.sendLogin(instance, socket);
        }
        counting--;
   }

   var inter = setInterval(counting_function, 1000, instance, this);
}


exports.disconnect = function(socket, instances, chatFunction)
{
  for(var i = 0; i < instances[ socket.uid ].nbCars; i++)
  {
      //not the good answer, we have to find out how to limit the number of cars to avoid putting a car in multiple game
      /*if(instances[ socket.uid ].cars[ i ].sock == socket.id)
      {
          instances[ socket.uid ].nbCars--;
      }*/

      //not sure :(
      if(instances[ socket.uid ].cars[ i ].sock == socket.id)
      {
          instances[ socket.uid ].minCar--;
      }
  }

  //if( instances[ socket.uid ].nbCars == 0)
  //  see above
  if(instances[ socket.uid ].minCar == 0)
  {
      var msg = "The host has leaving the game";
      instances[ socket.uid ].launched = false;
      socket.emit('gameDeconnexion', msg);
      socket.broadcast.to( instances[ socket.uid ].room ).emit('gameDeconnexion', msg);
      console.log("disconnection of the current instance "+ instances[ socket.uid ].host);
      delete instances[ socket.uid ];
      console.log("number of instances in the server :" + Object.keys(instances).length);
      return 0;

  }
    return -1;
}


exports.isInstanceExist = function(instances, newPasswd)
{
    for (var uid in instances)
    {
        if( instances[ uid ].password == newPasswd)
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
