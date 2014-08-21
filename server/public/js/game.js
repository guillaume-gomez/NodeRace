/**
* @brief : Classe principal du jeu
**/

var VMAX = 200;

function Game (socket, myId, username)
{
	//////////////////////////////////////////////////////////////////////////////////
	// Attributs
	//////////////////////////////////////////////////////////////////////////////////
	var nbCars;
	var nbCarsPlayed;
	var m_viewport;
	var m_cars;
	var m_date;
	var m_speed;
	var m_decompte;

	var m_myId;
	var m_ping;
	var m_decompteTxt;
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

		m_decompte = -1;
		m_speed = 0;
		m_myId = myId;
		nbCars = 0;
		nbCarsPlayed = 0;
		m_date = new Date();

		m_decompteTxt = new jaws.Text({ text: "En attente", x: jaws.width / 2, y: jaws.height / 2, style: "bold"});
		m_decompteTxt.color = "Red";
		m_decompteTxt.fontSize = 54;

		//Viewport
		m_viewport = new jaws.Viewport({max_x: jaws.width*1.5, max_y: jaws.height*1.5});
		m_cars = new Array();

		// var x = Math.floor((Math.random() * jaws.width) + 1);
		// var y = Math.floor((Math.random() * jaws.height) + 1);
		m_cars[0] = new Car("cars/Firebird1980.png", 700, 300, 50);
		m_cars[0].constructor();
		m_cars[0].setMyID(m_myId);
		m_cars[0].setUsername(username);

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

        socket.on('decompte', function(count) {
        	console.log("par tay "+count);
        	m_decompte = count;
        	m_decompteTxt.text = m_decompte;
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
		var oldDate = m_date;
		m_date = new Date();
	
		var elapsedTime = (m_date.getTime() -	oldDate.getTime()) / 1000;
		
		if(m_decompte == 0)
		{
			m_cars[m_myId].update(socket);
		}
		//m_cars[m_myId].move(elapsedTime);

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

		m_viewport.centerAround(m_cars[m_myId].getSprite());
		if( m_decompte != 0)
		{
			m_decompteTxt.draw();
		}
		m_viewport.drawTileMap( m_level.getTileMap());

		for(var i = 0; i < m_cars.length; i++)
		{
			m_cars[ i ].draw(m_viewport);
		}
	}

	this.isNeededToUpdate = function()
	{
		return m_cars[m_myId].haveToSend();
	}

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
				m_speed = carInfos.speed;
				
			speed = document.getElementById("speed");
			speed.innerHTML = "<p>speed : "+m_speed+"</p>";

			m_cars[carInfos.id].setPosition(carInfos);

			debug = document.getElementById("debug");
			debug.innerHTML = "<p> move "+this.getMyPositionX()+" :: "+this.getMyPositionY()+"</p>";
		}
	}
		
//end of class
}
