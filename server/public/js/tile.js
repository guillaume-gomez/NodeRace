/**
*@brief : Classe Tile qui gere un sprite
**/

Tile = function Tile(options) {
	var listPoint = new Array();
	if(typeof options.listPoint !== 'undefined')
	{
		this.listPoint = options.listPoint;
		delete options.listPoint;
	}

  	if( !(this instanceof arguments.callee) ) return new arguments.callee( options );
    jaws.Sprite.call(this, options);
  
    //supringly, the value image is not read as it does,then this variable store it
  	var m_image = "";
  	if(typeof options.image !== 'undefined')
  	{
  		this.m_image = options.image;
  		console.log(this.m_image);
  	}
    
 }

Tile.prototype = jaws.Sprite.prototype


//only used in the editor in order to make track with the rail points
Tile.prototype.loadCurves = function(points)
{
	this.listPoint = [];

	//disgusting but it works
	for(var i = 0; i < points.length; i++)
	{
		var point = {x:points[i].x, y:points[i].y};
		this.listPoint.push(point);
		this.listPoint[ i ].x += this.x;
		this.listPoint[ i ].y += this.y;
	}

	if(this.angle == 90 || this.angle == -270)
	{
		this.listPoint.forEach(toNinetyDegree);
		console.log(90);
	}
	else if (this.angle == 180)
	{
		this.listPoint.reverse(); 
		console.log(180);
	}
	else if (this.angle == 270 || this.angle == -90)
	{
		this.listPoint.reverse();
		this.listPoint.forEach(toNinetyDegree);
		console.log(270);
	}

	function toNinetyDegree(element, index, array) {
		var temp = element.x;
		element.x = element.y;
		element.y = temp;
    	//console.log("a[" + index + "] = " + element);
	}
}

//only for the editor
Tile.prototype.setMyImage = function(image)
{
	this.m_image = String(image);
}


 
Tile.prototype.toJSON = function(){
	var object = this.attributes();


	if(object['image'] == null )
	{
		//to set the right url image
		//console.log(this.m_image);
		this.setImage(this.image);
		object['image'] = this.m_image;
	}
	object["_constructor"] = "Tile";
	object["listPoint"] = this.listPoint;
    return JSON.stringify(object);
}