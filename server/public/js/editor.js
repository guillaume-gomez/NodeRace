/**
* @brief : Classe principal de l'editeur
**/

function drawListImage ()
{
	var path = 'assets/';
	var insert = '';

	// 	</canvas> 
	// 	<canvas id="myCanvas1" width="30" height="30">
	// 	<canvas id="myCanvas2" width="30" height="30"></canvas> 
	// for ( var i = 0 ; i < m_listImgURL.length ; i++ )
	// {
	// 	var url = path + m_listImgURL[i] ;
	// 	insert += '<canvas id="myCanvas'+i+'" width="30" height="30">';
	// 	insert += '<img class="img" src="'+url+'" id="'+i+'" onClick="(function(){m_level.setIndice('+i+');m_level.drawImageCurrent();}());">';
	// 	insert += '</canvas>';
	// }
	// insert += '';
	// liste_image.innerHTML = insert;
	for ( var i = 0 ; i < m_listImgURL.length ; i++ )
	{
		insert += '<canvas id="myCanvas'+i+'" width="30" height="30" onclick="(function(){m_level.setIndice('+i+');m_level.drawImageCurrent();}());">';
		insert += '</canvas>';
	}
	liste_image.innerHTML = insert;
	for ( var i = 0 ; i < m_listImgURL.length ; i++ )
	{
		var url = path + m_listImgURL[i] ;
		var c = document.getElementById("myCanvas"+i);
		var ctx = c.getContext("2d");
		var img = document.createElement("IMG"); 
		ctx.clearRect ( 0 , 0 , c.width , c.height );
		ctx.translate(c.width/2, c.height/2);
		img.src=url;
		img.onclick="(function(){m_level.setIndice('+i+');m_level.drawImageCurrent();}());";

		ctx.rotate(Math.PI*(document.getElementById('rotate').value)/180);
		// console.log(document.getElementById('rotate').value-oldAngle);
		ctx.translate(-c.width/2, -c.height/2);
		ctx.drawImage(img,0,0);
	}
	oldAngle = document.getElementById('rotate').value;
}

function Editor ( )
{
	//////////////////////////////////////////////////////////////////////////////////
	// Attributs
	//////////////////////////////////////////////////////////////////////////////////
	var m_viewport;
	this.m_level;
	var m_background;
	this.copyLevel;
	var cameraSpeed = 5;
	var cell_size = 50;
	background = new jaws.Sprite({image : ''});


	///////////////////////////////////////////////////////////////////////////////////
	// Méthodes
	////////////////////////////////////////////////////////////////////////////////////
	
	/**
	*@brief : Definis les objets à construire
	**/
	this.setup = function () 
	{
		//on recupere les  html
		live_info = document.getElementById("live_info");
		liste_image = document.getElementById("liste-image");
		image_courante_souris = document.getElementById('image-courante-souris');
					
		//Viewport
		m_viewport = new jaws.Viewport({max_x: jaws.width*1.5, max_y: jaws.height*1.5});
		
		m_level = new MakeLevel ( cell_size , m_listImgURL , m_viewport);
		m_level.constructor();
		
		
		//on ecrit la liste d'image 
		drawListImage();
	
		//Empeche les touches de bouger la fenetre du navigateur
		jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
	}
	
	/**
	* @brief : Met a jour le canvas
	**/
	this.update = function () 
	{
		moveCamera();
		m_level.update(m_viewport);
		
		//Infos
		live_info.innerHTML = jaws.game_loop.fps + " fps. X: " + parseInt(jaws.mouse_x) + "/ Y : " + parseInt(jaws.mouse_y) + ". ";
        live_info.innerHTML += "Viewport: " + parseInt(m_viewport.x) + "/" + parseInt(m_viewport.y) + ".";
		
		moveScreen();
		mouseFollow();
	}
	
	function test(i)
	{
		m_indiceIMG = i;
	}
	
	// function drawListImage ()
	// {
	// 	var path = 'assets/';
	// 	var insert = '';

	// 	// 	</canvas> 
	// 	// 	<canvas id="myCanvas1" width="30" height="30">
	// 	// 	<canvas id="myCanvas2" width="30" height="30"></canvas> 
	// 	// for ( var i = 0 ; i < m_listImgURL.length ; i++ )
	// 	// {
	// 	// 	var url = path + m_listImgURL[i] ;
	// 	// 	insert += '<canvas id="myCanvas'+i+'" width="30" height="30">';
	// 	// 	insert += '<img class="img" src="'+url+'" id="'+i+'" onClick="(function(){m_level.setIndice('+i+');m_level.drawImageCurrent();}());">';
	// 	// 	insert += '</canvas>';
	// 	// }
	// 	// insert += '';
	// 	// liste_image.innerHTML = insert;
	// 	for ( var i = 0 ; i < m_listImgURL.length ; i++ )
	// 	{
	// 		insert += '<canvas id="myCanvas'+i+'" width="30" height="30">';
	// 		insert += '</canvas>';
	// 	}
	// 	liste_image.innerHTML = insert;
	// 	for ( var i = 0 ; i < m_listImgURL.length ; i++ )
	// 	{
	// 		var url = path + m_listImgURL[i] ;
	// 		var c = document.getElementById("myCanvas"+i);
	// 		var ctx = c.getContext("2d");
	// 		var img = document.createElement("IMG"); 
	// 		ctx.clearRect ( 0 , 0 , c.width , c.height );
	// 		ctx.translate(c.width/2, c.height/2);
	// 		img.src=url;

	// 		ctx.rotate(Math.PI*(document.getElementById('rotate').value-oldAngle)/180);
	// 		oldAngle = document.getElementById('rotate').value;
	// 		ctx.translate(-c.width/2, -c.height/2);
	// 		ctx.drawImage(img,c.width/2-img.width/2,c.height/2-img.height/2);
	// 	}
	// }
	
	
	function moveCamera ()
	{
		var _x = 0 ;
		var _y = 0 ;
		
		if (jaws.pressed("up"))
			_y -= cameraSpeed;
		if (jaws.pressed("down"))
			_y += cameraSpeed;
		if (jaws.pressed("left"))
			_x -= cameraSpeed;
		if (jaws.pressed("right"))
			_x += cameraSpeed;
		
		m_viewport.move(_x , _y );
	}
	
	/**
	*@brief : Dessine les objets
	**/
	this.draw = function () 
	{
		jaws.clear();
		m_viewport.draw(background);
		drawGrid();
		m_viewport.drawTileMap(m_level.getTileMap());
	}

	function moveScreen()
	{
		var offset = 20;
		var movement = 5 ;
		if(jaws.mouse_x > jaws.width - offset && jaws.mouse_x < jaws.width)
			m_viewport.move( movement, 0);
		if(jaws.mouse_x > 0 &&jaws.mouse_x < 0 + offset)
			m_viewport.move(-movement , 0);
		if(jaws.mouse_y > jaws.height - offset && jaws.mouse_y < jaws.height)
			m_viewport.move(0 , movement);
		if(jaws.mouse_y > 0 && jaws.mouse_y < 0 + offset)
			m_viewport.move(0 , -movement);
			
	}

	//Dessine une grille qui se déplace en même temps que le viewport
	function drawGrid() {
    	jaws.context.save();
    	jaws.context.strokeStyle = "rgba(5,119,17,0.7)";
   		jaws.context.beginPath();

   		for(var x = 0; x < m_viewport.max_x; x+= cell_size)
		{
      			jaws.context.moveTo(x - m_viewport.x, 0);
      			jaws.context.lineTo(x - m_viewport.x, jaws.height);
    	}
    	for(var y = 0; y < m_viewport.max_y; y+= cell_size)
		{
      			jaws.context.moveTo(0,y- m_viewport.y );
     			jaws.context.lineTo(jaws.width, y-m_viewport.y);
    	}
		
   		jaws.context.closePath()
   		jaws.context.stroke()
   		jaws.context.restore()
  	}
	
	function mouseFollow()
	{
		//alert(document.getElementById('scale').value);
		if( jaws.mouse_x >= 0 && jaws.mouse_x < jaws.width && jaws.mouse_y >= 0 && jaws.mouse_y < jaws.height)
		{
			image_courante_souris.style.display = 'inline';
			image_courante_souris.style.opacity = 0.7;
			document.onmousemove = function(e)
			{
				//ratio = document.getElementById('scale').value;
				//image_courante_souris.
				image_courante_souris.style.left = (e.pageX+1)+'px';
				image_courante_souris.style.top  = (e.pageY+1)+'px';
				image_courante_souris.style.width = "10px";
				//var url = path + m_currentImg[ m_indiceIMG ] ;
				//image_courante_souris.width = this.width*ratio;
			};
		}
		else
			image_courante_souris.style.display = 'none';
	}

//end of class
}
