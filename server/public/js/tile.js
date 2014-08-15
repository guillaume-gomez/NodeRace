/**
*@brief : Classe Tile qui gere un sprite
**/

Tile = function Tile(options) {
  	if( !(this instanceof arguments.callee) ) return new arguments.callee( options );
    jaws.Sprite.call(this, options);
 }

 Tile.prototype = jaws.Sprite.prototype

//Tile.prototype = Object.create(jaws.Sprite.prototype);

Tile.prototype.loadCurves = function()
{


}
 
Tile.prototype.tuuuu = function(){
console.log('Voodoo child');
}