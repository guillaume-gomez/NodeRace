function drawListImage ()
{
  var path = 'assets/';
  var insert = '';
  for ( var i = 0 ; i < m_listImgURL.length ; i++ )
  {
    insert += '<canvas id="myCanvas'+i+'" width="30" height="30" onclick="(function(){m_level.setIndice('+i+');m_level.drawImageCurrent();}());">';
    insert += '</canvas>';
  }
  liste_image.innerHTML = insert;
  var onClickFunction = "(function(){m_level.setIndice('+i+');m_level.drawImageCurrent();}());";
  for ( var i = 0 ; i < m_listImgURL.length ; i++ )
  {
      drawImageByContext(path + m_listImgURL[i], "myCanvas"+i, onClickFunction);
  }
  oldAngle = document.getElementById('rotate').value;
}
  
function drawImageByContext(url, id ,onclick = null) 
{
  var canvas = document.getElementById(id);
  var img = document.createElement("IMG");
  img.src = url;
  img.onclick = onclick;
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(canvas.width/2, canvas.height/2);
  context.rotate(Math.PI*(document.getElementById('rotate').value)/180);
  context.drawImage(img, -img.width/2, -img.width/2);
  context.restore();
}
  
  function Editor ( )
  {
  var m_viewport;
  this.m_level;
  var m_background;
  this.copyLevel;
  var cameraSpeed = 5;
  var cell_size = 50;
  background = new jaws.Sprite({image : ''});
  
  this.setup = function ()
  {
    live_info = document.getElementById("live_info");
    liste_image = document.getElementById("liste-image");
    current_cursor_image = document.getElementById('current-cursor-image');
  
    //Viewport
    m_viewport = new jaws.Viewport({max_x: jaws.width*1.5, max_y: jaws.height*1.5});
  
    m_level = new MakeLevel ( cell_size , m_listImgURL , m_viewport);
    m_level.constructor();
  
    drawListImage();
  
    jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
  }
  
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
  //   var path = 'assets/';
  //   var insert = '';
  
  //   //
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

	this.draw = function ()
	{
		jaws.clear();
		m_viewport.draw(background);
		if(displayGrid)
		{
			drawGrid();
		}
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

  //draw grid in function of camera position
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
		if( jaws.mouse_x >= 0 && jaws.mouse_x < jaws.width && jaws.mouse_y >= 0 && jaws.mouse_y < jaws.height)
		{
			current_cursor_image.style.display = 'inline';
			current_cursor_image.style.opacity = 0.7;
			document.onmousemove = function(e)
			{
				//ratio = document.getElementById('scale').value;
				//current_cursor_image.
				current_cursor_image.style.left = (e.pageX+1)+'px';
				current_cursor_image.style.top  = (e.pageY+1)+'px';
				current_cursor_image.style.width = "10px";
				//var url = path + m_currentImg[ m_indiceIMG ] ;
				//current_cursor_image.width = this.width*ratio;
			};
		}
		else
			current_cursor_image.style.display = 'none';
	}

//end of class
}
