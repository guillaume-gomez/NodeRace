var VMAX = 200;

function Game (socket, myId)
{

	var m_viewport;
	var m_cars;
	var m_date;
	var m_speed;
	var m_counting;
	var m_myId;
	var m_ping;
	var m_hubTxt;
	var m_positionTxt;
	var m_lapsTxt;

	this.setup = function ()
	{
		live_info = document.getElementById("live_info");
		cell_size = 50;

		m_counting = -1;
		m_speed = 0;
		m_myId = myId;
		m_date = new Date();

		m_hubTxt = new jaws.Text({ text: "En attente", x: jaws.width / 2 - 100, y: jaws.height / 2, style: "bold"});
		m_hubTxt.color = "Red";
		m_hubTxt.fontSize = 54;

		m_positionTxt = new jaws.Text({x: jaws.width - 150, y: jaws.height - 10, style: "bold"});
		m_positionTxt.fontSize = 18;

		m_lapsTxt = new jaws.Text({x: 5, y: jaws.height - 10, style: "bold"});
		m_lapsTxt.fontSize = 18;

		//Viewport
		m_viewport = new jaws.Viewport({max_x: jaws.width*1.5, max_y: jaws.height*1.5});
		m_cars = new Array();

		// var x = Math.floor((Math.random() * jaws.width) + 1);
		// var y = Math.floor((Math.random() * jaws.height) + 1);
		m_cars[0] = new Car("cars/Firebird1980.png", 0, 0, 50);
		m_cars[0].constructor();

		m_cars[1] = new Car("cars/Cobra.png", 0, 0, 50);
		m_cars[1].constructor();

		m_cars[m_myId].setMyID(m_myId);
		m_cars[m_myId].setUsername(username);

		m_level = new TileSet(m_viewport, cell_size);
		m_level.constructor();


        socket.on('position', function(carInfos) {
        	//fetch postion from another players
        	game.setPosition(carInfos);
        });

        socket.on('logins', function(infosLogin) {
        	m_cars[ infosLogin.id ].setUsername(infosLogin.username);
        });

        socket.on('decompte', function(count) {
        	console.log("console : decompte "+count);
        	m_counting = count;
        	m_hubTxt.text = m_counting;
        });

        socket.on("finPartie", function(fin) {
        	m_hubTxt.text = fin;
        	console.log("finde partieserveur bitch");
        	socket.emit('deconnexion', 'fin');
        });

        socket.on("closeCo", function(){
        	socket.disconnect();
        	console.log("disconnection");
        });

        socket.on('myPosition', function(carInfos) {
        	//fetch new position
        	game.setPosition(carInfos);
        	m_lapsTxt.text = "Laps : "+carInfos.lap+" / "+laps;
        });

        socket.on('trackPosition', function(position) {
        	m_positionTxt.text = "Position : "+position+" / "+nbCarsPlayed;
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

		jaws.preventDefaultKeys(["up", "down", "left", "right"]);
	}

	this.update = function ()
	{
		var oldDate = m_date;
		m_date = new Date();

		var elapsedTime = (m_date.getTime() -	oldDate.getTime()) / 1000;

		if(m_hubTxt.text == 0)
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

	this.draw = function ()
	{
		jaws.clear();
		jaws.fill("rgba(200,200,200,1");

		m_viewport.centerAround(m_cars[m_myId].getSprite());

		m_viewport.drawTileMap( m_level.getTileMap());
		for(var i = 0; i < m_cars.length; i++)
		{
			m_cars[ i ].draw(m_viewport);
		}

		if( m_hubTxt.text != 0)
		{
			m_hubTxt.draw();
		}
		m_positionTxt.draw();
		m_lapsTxt.draw();
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
			speed.innerHTML = "<p>speed : "+m_speed.toFixed(2)+"</p>";

			m_cars[carInfos.id].setPosition(carInfos);

			debug = document.getElementById("debug");
			debug.innerHTML = "<p> move "+this.getMyPositionX().toFixed(2)+" :: "+this.getMyPositionY().toFixed(2)+"</p>";
		}
	}

//end of class
}
