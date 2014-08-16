/**
* @brief : Classe principal du jeu
**/

var VMAX = 200;

function Game (socket, myId)
{
	//////////////////////////////////////////////////////////////////////////////////
	// Attributs
	//////////////////////////////////////////////////////////////////////////////////
	var nbCars;
	var nbCarsPlayed;
	var m_viewport;
	var m_cars;
	var m_date;
	var m_speed = 0;

	var m_myId;
	var m_ping;
	var accel = {
					id: 0,
					percent: 0
				}

	// var rails = [];

	///////////////////////////////////////////////////////////////////////////////////
	// Méthodes
	////////////////////////////////////////////////////////////////////////////////////
	
	/**
	*@brief : Definis les objets à construire
	**/
	this.setup = function () 
	{
		live_info = document.getElementById("live_info");
		cell_size = 30;

		m_myId = myId;
		accel.id = myId;
		nbCars = 0;
		nbCarsPlayed = 0;
		m_date = new Date();

		//Viewport
		m_viewport = new jaws.Viewport({max_x: jaws.width*1.5, max_y: jaws.height*1.5});
		m_cars = new Array();

		// var x = Math.floor((Math.random() * jaws.width) + 1);
		// var y = Math.floor((Math.random() * jaws.height) + 1);
		m_cars[0] = new Car("cars/Firebird1980.png", 700, 300, 50);
		m_cars[0].constructor();

		m_cars[1] = new Car("cars/Cobra.png", 700, 300, 50);
		m_cars[1].constructor();

		m_level = new TileSet(m_viewport, cell_size);
		m_level.constructor();

		// for(var j=0; j<2; j++)
		// {
		// 	for(var i=0; i<80; i++)
		// 	{
		// 		rail = {
		// 					x: 70+i*6, 
		// 					y: 20+j*40
		// 			   }
		// 		rails.push(rail);
		// 	}
		// 	for(var i=0; i<180; i++)
		// 	{
		// 		rail = {
		// 					x: 70+80*6+(50+40*(1-j))*Math.cos((90-i)/180*Math.PI),
		// 					y: 20+40+50-(50+40*(1-j))*Math.sin((90-i)/180*Math.PI)
		// 			   }
		// 		rails.push(rail);
		// 	}
		// }
        socket.on('position', function(carInfos) {
        	//on reception les positions des autres joueurs de maniere asynchrone;
        	game.setPosition(carInfos);
        });

        socket.on('myPosition', function(carInfos) {
        	//on reception sa nouvelle position

        	game.setPosition(carInfos);
        });

	 	setInterval(function()
	 				{
      					var date = new Date();
	 					socket.emit('ping',  date.getTime());
	 				},
	 				1000
	 			   );

        socket.on('ping', function(oldTime) {
	    	var date = new Date();
	    	m_ping = date.getTime() - oldTime;
        });
	
		//Empêche les touches de bouger la fenetre du navigateur
		jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
	}
	
	/**
	* @brief : Met a jour le canvas
	**/
	this.update = function () 
	{
		jaws.on_keydown(["up","space"], function()
				{
					accel.percent = 1;
        			socket.emit('accel', accel);
				}
			)
		jaws.on_keydown("right", function()
				{
					if(jaws.pressed(["up","space","shift"]))
						accel.percent = 1;
					else
						accel.percent = 0.5;
					
        			socket.emit('accel', accel);
				}
			)
		jaws.on_keydown("shift", function()
				{
					if(jaws.pressed(["right"]))
						accel.percent = 1;
					
        			socket.emit('accel', accel);
				}
			)

		if(jaws.pressed('w'))
			m_cars[m_myId].getSprite().rotate(5);

		jaws.on_keyup(["right","up","space","shift"], function()
				{
					if(jaws.pressed(["up","space"]) || jaws.pressed(["right","shift"], true))
						accel.percent = 1;
					else if(jaws.pressed("right"))
						accel.percent = 0.5;
					else
						accel.percent = 0;

        			socket.emit('accel', accel);
				}
			)

		var oldDate = m_date;
		m_date = new Date();
	
		var elapsedTime = (m_date.getTime() -	oldDate.getTime()) / 1000;
			
		// m_cars[m_myId].update();
		//m_cars[m_myId].move(elapsedTime);
		m_viewport.centerAround(m_cars[m_myId].getSprite());

		//reset
		if ( jaws.pressed('r') )
		{
		}

		//Infos
		live_info.innerHTML = "<p>"+jaws.game_loop.fps + " fps</p>" + "<p> Ping : "+m_ping+" ms</p>";//. Player: " ;+ parseInt(m_perso.getX()) + "/" + parseInt(m_perso.getY()) + ". ";
       //	live_info.innerHTML /*+*/= "Viewport: " + parseInt(m_viewport.x) + "/" + parseInt(m_viewport.y) + ".";
	}
	
	/**
	*@brief : Dessine les objets
	**/
	this.draw = function ()
	{
		jaws.clear();	
		jaws.fill("rgba(200,200,200,1");
			
		m_viewport.drawTileMap( m_level.getTileMap());

		// m_viewport.apply(function ()
		// 	 {
		// 		for(var i=0; i<rails.length; i++)
		// 		{
		// 			jaws.context.fillStyle="grey";
		// 			jaws.context.fillRect(rails[i].x,rails[i].y-3,6,6);
		// 		}
		// 	 }
		// )

		for(var i = 0; i < m_cars.length; i++)
		{
			m_viewport.draw(m_cars[i].getSprite());
		}
	}

	this.isNeededToUpdate = function()
	{
		return m_cars[m_myId].haveToSend();
	}

	// this.updateGameSocket = function()
	// {
 //        socket.emit('accel', JSON.stringify(accel));
	// }

	this.getMyPositionY = function()
	{
		return m_cars[m_myId].getY();
	}

	this.getMyPositionX = function()
	{
		return m_cars[m_myId].getX();
	}

	this.getMyAgX = function()
	{
		return m_cars[m_myId].getAccelerationX();
	}

	this.getMyAgY = function()
	{
		return m_cars[m_myId].getAccelerationY();
	}
		
	this.setPosition =  function (carInfos)
	{
		//alert(index+", "+ x+", "+y);
		if(carInfos.id > m_cars.length && carInfos.id != m_myId)
		{
			alert("Restart the game because an error was detected");
		}
		else
		{
			if(m_myId == carInfos.id)
				m_speed=carInfos.speed;
				
			speed = document.getElementById("speed");
			speed.innerHTML = "<p>speed : "+m_speed+"</p>";

			m_cars[carInfos.id].setPosition(carInfos);

			debug = document.getElementById("debug");
			debug.innerHTML = "<p> move "+this.getMyPositionX()+" :: "+this.getMyPositionY()+"</p>";
		}
	}


	// this.displayPing = function()
	// {
	// 	var date = new Date();

	// 	socket.emit('ping',  date);
	// 	return "<p> Ping : "+m_ping+" ms</p>";	
	// }
		
//end of class
}
