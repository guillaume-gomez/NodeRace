/*
Ce module charge la partie modele du niveau
*/
var fs = require('fs');

var NB_RAIL = 4;
var NB_TOUR = 3;

//@see tileset.js voir la meme fonction coté client
exports.getLevelFilename = function(trackID)
{
	var path = 'public/assets/';
	if(trackID == "id56")
	{
		return path + 'tracks/default.json';
	}
	else if (trackID == "id68")
	{
		return path + 'tracks/track1.json';
	}
	else if (trackID == "id24")
	{
		return path + 'tracks/track2.json';
	}
	else if (trackID == "id32")
	{
		return path + 'tracks/default.json';
	}
	else
	{
		return path +'tracks/default.json';	
	}
}

exports.loadLevel = function (trackID)
{
	var tiles = JSON.parse(fs.readFileSync(this.getLevelFilename(trackID), 'utf8'));
	var rails = [];

	for(var i=0; i < NB_RAIL; i++) 
	{
		rails[i] = [];
	}

	//on charge le rail
	for(var i = 0; i < tiles.length; i++)
	{
		for(var j = 0; j < tiles[ i ].listPoint.length; j++)
		{
			for( var k = 0; k < NB_RAIL; k++)
			{
				//une fois que les rails seront bien fait il faudra faire
				//rails[ k ].push(tiles[ i ].listPoint[ k ][ j ]);
				rails[ k ].push(tiles[ i ].listPoint[ j ]);
			}
		}
	}
	return rails;	
}

exports.isFinish = function (instance)
{
	if(instance.launched)
	{
		//on verifie qu'un joueur à bien teminé les tours
		for (var i = 0; i < instance.nbCars; i++)
		{
			if(instance.cars[ i ].lap < instance.nbLaps)
			{
				return false;
			}
		}
		//sinon cela veut dire que la course est fini car sinon on aurait eu un return
		return true;
	}
	return false;
}

exports.getTrackPosition = function (instance, io) 
{
	//nextTrajectoryIndex + 1 est utilisé pour eviter la multiplication par zero quand on recommence un niveau
	var sorting = function (a, b) {
		var valA = a.lap * (a.nextTrajectoryIndex + 1);
		var valB = b.lap * (b.nextTrajectoryIndex + 1);
		return valB - valA;
	}

	var arrayPos = [];
	for(var i = 0; i < instance.nbCars; i++)
	{
		//on emet la position au client 
		var carPos = {lap: instance.cars[ i ].lap,
					  nextTrajectoryIndex: instance.cars[ i ].nextTrajectoryIndex,
					  sock: instance.cars[ i ].sock
					};
		arrayPos.push(carPos);
	}

	//on trie le tableau de maniere à obtenir l'ordre des positions 
	// de maniere decroissante
	arrayPos.sort(sorting);

	for(var i = 0; i < arrayPos.length; i++)
	{
		//on emet la position au client 
		var pos = i + 1;
		io.to( arrayPos[ i ].sock ).emit('trackPosition', pos);
	}
}