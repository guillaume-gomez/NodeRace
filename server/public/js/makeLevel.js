function MakeLevel (  cell_size , listeURLimg , viewport, listEnnemies)
{

	/////////////////////////////////////////////////
	// Attributs
	/////////////////////////////////////////////////
	var m_tile_map;
	var m_background;
	var m_currentImg;
	var m_viewport;
	var saveName = "nom_du_level";
	var m_indiceIMG = 0;
	var m_nbEnnemy ;
	var m_spriteList;
	var m_spriteLight;
	var m_filenameHero ;
	var m_spriteHero;
	var m_indiceHero;
	var m_indiceEnnemie;
	var m_filenameLight;
	/////////////////////////////////////////////////
	// Méthodes 
	/////////////////////////////////////////////////

	/**
	* @brief : Constructeur de la classe MakeLevel
	**/
	this.constructor = function ()
	{
		if(leveljson != "")
		{
			saveName = leveljson;
		}

		image_courrante = document.getElementById('image-courrante');
	
		m_currentImg = new Array();
		
		for ( var i = 0 ; i < listeURLimg.length ; i++ )
			m_currentImg[ i ] =  listeURLimg[ i ];
		
		m_viewport = viewport;
		m_viewport.x = 0;
		m_viewport.y = 9999;
		
		m_nbEnnemy = 0 ;
		
		m_spriteListEnnemys = new jaws.SpriteList();
	    m_spriteList = new jaws.SpriteList();
		
		
		if(leveljson != "")
		{
			m_spriteList.load(jaws.assets.get(leveljson));
		}
				
		m_tile_map = new jaws.TileMap({size : [m_viewport.max_x/cell_size+10,m_viewport.max_y/cell_size+10] , cell_size: [cell_size,cell_size]});
		
		this.drawImageCurrent();
	}
	

	/**
	* @brief : Gestion des touches 
	**/
	this.update = function (viewport)
	{
		
	
		//Dessine une tile
		if ( jaws.pressed("left_mouse_button") )
		{
			//environnement
			if ( isValid()  )
			{
					var tangle = document.getElementById('rotate').value || 0;
					tangle = parseInt(tangle);
					temp = new Tile({x: ( jaws.mouse_x + viewport.x) - (jaws.mouse_x + viewport.x)% cell_size , y :  (jaws.mouse_y + viewport.y) - (jaws.mouse_y + viewport.y) % cell_size, image: m_currentImg[ m_indiceIMG ],
									scale:document.getElementById('scale').value,
									angle: tangle
								});
					temp.setMyImage( m_currentImg[ m_indiceIMG ] );

					for(var i = 0; i < ArrayTileInfo.cases.length ; i++)
					{
						if(ArrayTileInfo.cases[i].url == m_currentImg[ m_indiceIMG ])
						{
							var list = temp.loadCurves(ArrayTileInfo.cases[i].ListPoint);
							break;
						}
					}
					m_spriteList.push( temp );
			}
		}

		//Supprime la dernière tile
		jaws.on_keydown("z",function() {m_spriteList.pop();} );

		//Supprime la tile sélectionnée
		if ( jaws.pressed("right_mouse_button") )
		{
			m_spriteList.remove( m_tile_map.at(jaws.mouse_x + viewport.x,jaws.mouse_y + viewport.y)[0] );
		}
		
		
		if ( jaws.pressed("p") )
		{
			m_indiceIMG++;
			this.drawImageCurrent();
			this.changeSouris();
		}
		
		if ( jaws.pressed("m") )
		{
			m_indiceIMG--;
			this.drawImageCurrent();
			this.changeSouris();
		}
		
		
		if ( jaws.pressed("1") )
		{
			m_indiceIMG = m_indiceHero;
			this.drawImageCurrent();
			this.changeSouris();
		}
		
		
		m_tile_map.clear();
		m_tile_map.push(m_spriteList);
		
		//Sauvegarde la tilemap
		jaws.on_keydown("s",this.sauvegarder);

	}
	
	/**
	* @brief : Retourne la spriteList
	**/
	this.getSpriteList = function ()
	{
		return m_spriteList;
	}


	/**
	*@brief : Sauvegarde le niveau
	**/
	this.sauvegarder = function ()
	{
		var test = "[" + m_spriteList.map( function(m_spriteList) { return m_spriteList.toJSON() }) + "]";
		sessionStorage.setItem('saveName', test);

		var saveText = document.getElementById("save");
		saveText.value = sessionStorage.saveName;
		saveName='';
	}
	
	
		
	/**
	* @brief : Ecrit dans le html l'image qui sera dessinée
	**/
	 this.drawImageCurrent  = function( )
	{
		var path = 'assets/';
		var url = path + m_currentImg[ m_indiceIMG ] ;
		
		var idImage = document.getElementById(m_indiceIMG);
		var ratio = 1 ;
		if ( idImage != null )
		{
		
			for ( var i = 0 ; i < idImage.width && idImage.width % 3 != 0 ; i+=10)
			{
				if ( i % 3 == 0 )
				{
				  ratio = i/100; 
				}
			}
		}
		
		var _scale = document.getElementById('scale');
		_scale.value = ratio  ;
		
		image_courrante.innerHTML = '<img src="'+url+'" width="'+this.width*ratio+'">';
		image_courante_souris.innerHTML = '<img src="'+url+'" width="'+this.width*ratio+'" >';
	}
	
	this.changeSouris = function ( value_ratio )
	{
	  var path = 'assets/';
	  var url = path + m_currentImg[ m_indiceIMG ] ;
		
	  image_courante_souris.innerHTML = '';
	  image_courante_souris.innerHTML = '<img src="'+url+'" whith="17" >';
	  
	}
	
	
	/**
	*@brief : Accesseur pour m_indiceIMG
	**/
	this.setIndice = function( newIndice)
	{m_indiceIMG = newIndice;}
	
	
	/**
	*@brief : Revoit la tile_map qui contient tout le niveau
	**/
	this.getTileMap = function()
	{return m_tile_map;}
	
	/**
	*@brief : change l'image de fond sur le canvas
	**/
	this.changeBackground = function ()
    {
			background.setImage(document.getElementById('background').value);
    }
	
	
	
	/**
	* @brief :Retourne la largeur d'une image pour l'indice
	**/
	this.getWidth = function ( index )
	{
		return m_spriteList.at( index );//.rect().width;
	}
	
	/**
	* @brief :Retourne la hauteur d'une image pour l'indice
	**/
	this.getHeight = function ( index )
	{
		return m_spriteList.at( index ).rect().height;
	}
	
	
	/**
	* @brief : Retourne la position de la souris sur le canvas
	**/
	this.getCamX = function ()
	{
		return m_viewport.x ;
	}
	
	/**
	* @brief : Retourne la position de la souris sur la canvas
	**/
	this.getCamY = function ()
	{
		return m_viewport.y ;
	}
	
	/**
	* @brief : Verifie si on peut dessiner dans la zone qui est cliquée
	**/
	function isValid()
	{
		var _y = (jaws.mouse_y + viewport.y) - (jaws.mouse_y + viewport.y) % cell_size;
		var _x = ( jaws.mouse_x + viewport.x) - (jaws.mouse_x + viewport.x)% cell_size;
			// si on est en dehors de l'ecran 
		
			if( _x >= 0 && _x < viewport.max_x && _y >= 0 && _y < viewport.max_y)
				if (!m_tile_map.at(jaws.mouse_x + viewport.x,jaws.mouse_y + viewport.y)[0])//New!!
					return true ;
					
		return false ;
	}
//end of class
}

