/**
* @brief : Classe principal du jeu
**/
function Game ()
{
	//////////////////////////////////////////////////////////////////////////////////
	// Attributs
	//////////////////////////////////////////////////////////////////////////////////
	var nbCars;
	var nbCarsPlayed;
	var m_viewport;
	//var m_background;

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

		nbCars = 0;
		nbCarsPlayed = 0;

		//Viewport
		m_viewport = new jaws.Viewport({max_x: jaws.width*1.5, max_y: jaws.height*1.5});
	 	
		//m_perso = new Personnage("perso.png",54,68,50,m_viewport , 'gunFX');
		//m_perso.constructor();	
		//m_enemy = new Array;
		
		//m_level = new TileSet(m_viewport, cell_size , tilesInvisible );
		//m_level.constructor();
			
		//Empêche les touches de bouger la fenetre du navigateur
		jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
	}
	
	/**
	* @brief : Met a jour le canvas
	**/
	this.update = function () 
	{
		
		//reset
		if ( jaws.pressed('r') )
		{
		}
			
		//Infos
		live_info.innerHTML = jaws.game_loop.fps + " fps";//. Player: " ;+ parseInt(m_perso.getX()) + "/" + parseInt(m_perso.getY()) + ". ";
       //	live_info.innerHTML /*+*/= "Viewport: " + parseInt(m_viewport.x) + "/" + parseInt(m_viewport.y) + ".";
	}
	
	/**
	*@brief : Dessine les objets
	**/
	this.draw = function ()
	{
		jaws.clear();	
		
		//m_rain.draw();
		//m_viewport.draw( m_level.getSpriteListInvisible() );
		//m_viewport.drawTileMap( m_level.getTileMap() ) ;

		//	m_viewport.draw(m_perso.getPlayer());
		//	m_viewport.draw(m_perso.getBalls());
	}
		
//end of class
}