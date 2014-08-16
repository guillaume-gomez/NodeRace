/**
* @brief : Classe principal du jeu
**/

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

	var m_myId;
	var m_ping;
	var m_tile;


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
		gravity = 0.4;

		m_myId = myId;
		nbCars = 0;
		nbCarsPlayed = 0;
		m_date = new Date();

		//Viewport
		m_viewport = new jaws.Viewport({max_x: jaws.width*1.5, max_y: jaws.height*1.5});
		m_cars = new Array();

		var x = Math.floor((Math.random() * jaws.width) + 1);
		var y = Math.floor((Math.random() * jaws.height) + 1);
		m_cars[0] = new Car("Viper.png", 697, 312, 50);
		m_cars[0].constructor();
		m_cars[0].setPosition(50, 50);

		m_cars[1] = new Car("Viper.png", 697, 312, 50);
		m_cars[1].constructor();
		m_cars[1].setPosition(50, 50);

		m_cars[m_myId].setPosition(100, 100);

		m_level = new TileSet(m_viewport, cell_size);
		m_level.constructor();

        socket.on('position', function(position) {
        	//on reception les positions des autres joueurs de maniere asynchrone;
        	game.setPosition(position.id ,position.x, position.y);
        });

        socket.on('myPosition', function(position) {
        	//on reception sa nouvelle position
        	game.setPosition(position.id ,position.x, position.y);
        });

        socket.on('ping', function(ping) {
        	var msec = Date.parse(ping.clientDate);
	    	var dateTemp = new Date(msec);
	    	var date = new Date();
	    	m_ping = date.getTime() - dateTemp.getTime();
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
			
		m_cars[m_myId].update();
		//m_cars[m_myId].move(elapsedTime);
		m_viewport.centerAround(m_cars[m_myId].getSprite());

		//reset
		if ( jaws.pressed('r') )
		{
		}

		//if(this.isNeededToUpdate())
		//{
			this.updateGameSocket();
		//}

		//Infos
		live_info.innerHTML = "<p>"+jaws.game_loop.fps + " fps</p>" + this.displayPing();//. Player: " ;+ parseInt(m_perso.getX()) + "/" + parseInt(m_perso.getY()) + ". ";
       //	live_info.innerHTML /*+*/= "Viewport: " + parseInt(m_viewport.x) + "/" + parseInt(m_viewport.y) + ".";
	}
	
	/**
	*@brief : Dessine les objets
	**/
	this.draw = function ()
	{
		jaws.clear();	
		jaws.fill("rgba(255,255,255,0.5");
			
		m_viewport.drawTileMap( m_level.getTileMap());
		m_viewport.draw(m_cars[m_myId].getSprite());
		for(var i = 0; i < m_cars.length; i++)
		{
			if(i != m_myId)
			{
				m_viewport.draw(m_cars[i].getSprite());
			}
		}
	}

	this.isNeededToUpdate = function()
	{
		return m_cars[m_myId].haveToSend();
	}

	this.updateGameSocket = function()
	{
        var myPosition = {
        		'x' : this.getMyPositionX(),
        		'y' : this.getMyPositionY(),
        		'agx': this.getMyAgX(),
        		'agy': this.getMyAgY()
        	};
        socket.emit('position', JSON.stringify(myPosition));
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
		
	this.setPosition =  function (index, x, y)
	{
		//alert(index+", "+ x+", "+y);
		if(index > m_cars.length && index != m_myId)
		{
			alert("Restart the game because an error was detected");
		}
		else
		{
			m_cars[index].setPosition(x, y);
			debug = document.getElementById("debug");
			debug.innerHTML = "<p> move "+this.getMyPositionX()+" :: "+this.getMyPositionY()+"</p>";
		}
	}


	this.displayPing = function()
	{
		var date = new Date();
        var ping = {'clientDate' : date};

		socket.emit('ping',  JSON.stringify(ping));
		return "<p> Ping : "+m_ping+" ms</p>";	
	}
		
//end of class
}
