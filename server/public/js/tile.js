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
Tile.prototype.loadCurves = function(listPoint)
{
	this.listPoint = listPoint;
	//console.log(listPoint);
	var that = this;

	function translateValues(element, index, array) {
		element.x += that.x;
		element.y += that.y;
    	//console.log("a[" + index + "] = " + element.x + ", " + element.y);
    }

    this.listPoint.forEach(translateValues);
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
		console.log(this.m_image);
		this.setImage(this.image);
		object['image'] = this.m_image;
	}
	object["_constructor"] = "Tile";
	object["listPoint"] = this.listPoint;
    return JSON.stringify(object);
}