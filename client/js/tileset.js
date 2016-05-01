function TileSet (viewport, cell_size)
{

	var m_viewport;
	var m_spriteList;
	var m_currentLevel;
	var m_tile_map;

	this.constructor  = function ()
	{
		m_viewport = viewport ;
		m_currentLevel = 1 ;
		m_tile_map = new jaws.TileMap({size : [m_viewport.max_x/cell_size,m_viewport.max_y/cell_size] , cell_size: [cell_size,cell_size]});

		m_spriteList = new jaws.SpriteList();

		this.loadLevel();

	}

	this.draw = function()
	{
		m_spriteList.draw();

	}

	this.getSpriteList = function()
	{
		return m_spriteList;

	}

	this.getTileMap = function ()
	{
		return m_tile_map;
	}


	this.getcurrentLevel = function ()
	{
		return  m_currentLevel;
	}


	this.setcurrentLevel = function ( value)
	{
		 m_currentLevel = value;
	}

	this.incrementcurrentLevel = function ()
	{
		 m_currentLevel++;
	}

	this.loadLevel = function  ()
	{
	    m_spriteList = new jaws.SpriteList();

		m_spriteList.load(jaws.assets.get(this.getLevelName()));

		m_tile_map = new jaws.TileMap({size : [m_viewport.max_x/cell_size+10,m_viewport.max_y/cell_size+10] ,cell_size: [cell_size,cell_size]});
		m_tile_map.push(m_spriteList);
	}

  // see serveur side mirror function in LevelModel
	this.getLevelName = function()
	{
		//global var stored in html dom-tree
		if(trackID == "id56")
		{
			return 'tracks/default.json';
		}
		else if (trackID == "id68")
		{
			return 'tracks/track1.json';
		}
		else if (trackID == "id24")
		{
			return 'tracks/track2.json';
		}
		else if (trackID == "id32")
		{
			return  'tracks/default.json';
		}
		else
		{
			return 'tracks/default.json';
		}
	}
//end of class
}
