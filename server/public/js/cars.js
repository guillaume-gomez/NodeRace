/**
* @brief : Classe qui gere le héros 
**/

function Personnage(image,frame_width,frame_height,frame_duration , viewport , )
{
	//////////////////////////////////////////////////////////////
	// Attributs
	/////////////////////////////////////////////////////////////
	
	
	
	///////////////////////////////////////////////////////////////
	// Méthodes
	///////////////////////////////////////////////////////////////
	/**
	* @brief : Constructeur de la classe Personnage
	**/
    this.constructor = function()
	{
		//on définie la valeur des variables
	
    }

	/**
	* @brief : Gestion des touches
	* @note : gravity est une variable globale
	**/
    this.update = function() 
	{
		this.show();
		//Si touche gauche enfoncé
	    if (jaws.pressed("left") || jaws.pressed("q"))
		{ 
			m_player.vx -= m_speed ; 
			m_goLeft = true;
			m_sens = -1;
		}
		//Si touche doite enfoncé
		else if (jaws.pressed("right") || jaws.pressed("d"))
		{ 
			m_player.vx += m_speed;
			m_goRight = true;
			m_sens = 1 ;
		}	
	
    }
	 
	 /**
	 *@brief : Permet de mouvement du perso
	 *@note : Variable globale qui stocke le level
	 **/
	this.move = function (tile_map  , array_enemy , ladder_map)
	{
						
		// Gravité
		m_player.vy += gravity;
		
	}
	
	/**
	* @brief : gestion des sprites
	**/
	this.show = function () 
	{	
		if ( m_goRight )
		{
			m_player.setImage( m_player.go_right.next() );
		}			
	}
		
//end of class
}
