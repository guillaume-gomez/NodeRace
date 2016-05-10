/*
This module loads levels for each game
*/
var fs = require('fs');

var NB_RAIL = 1;
var NB_TOUR = 3;

exports.loadLevel = function(trackName) {

    var tiles = JSON.parse(fs.readFileSync(trackName + '.json', 'utf8'));
    var rails = [];

    var tileInfo = JSON.parse(fs.readFileSync('TileInfo.json', 'utf8'));

    var tileInfoArrayPoints = [];

    for (var i = 0; i < tileInfo.length; i++) {
        tileInfoArrayPoints[tileInfo[i].id] = tileInfo[i].points;
    }

    for (var i = 0; i < NB_RAIL; i++) {
        rails[i] = [];
    }

    // console.log("\ntiles :");
    // console.log(tiles);

    console.log("");
    console.log("tileInfoArrayPoints :");
    console.log(tileInfoArrayPoints);
    console.log("");

    // build the rail
    for (var i = 0; i < tiles.parts.length; i++) { // for each part of the track

        rotate(tileInfoArrayPoints[tiles.parts[i].id], tiles.parts[i].rotation);

        for (var j = 0; j < tileInfoArrayPoints[tiles.parts[i].id].length; j++) { // for each point of this part

            for (var k = 0; k < NB_RAIL; k++) { // for each rail

                // next step when rails will be properly created
                //use rails[ k ].push(tiles[ i ].listPoint[ k ][ j ]);

                rails[k].push(tileInfoArrayPoints[tiles.parts[i].id][j]);
            }
        }
    };

    return rails;
}

exports.isFinish = function(instance) {
    if (instance.launched) {
        //check if a player has finished the track
        for (var i = 0; i < instance.nbCars; i++) {
            if (instance.cars[i].lap < instance.nbLaps) {
                return false;
            }
        }
        //otherwise that means the track is not finished
        return true;
    }
    return false;
}

exports.getTrackPosition = function(instance, io) {
    //nextTrajectoryIndex + 1 to avoid mul by zero when the game is restarted
    var sorting = function(a, b) {
        var valA = a.lap * (a.nextTrajectoryIndex + 1);
        var valB = b.lap * (b.nextTrajectoryIndex + 1);
        return valB - valA;
    }

    var arrayPos = [];
    for (var i = 0; i < instance.nbCars; i++) {
        //emit client position
        var carPos = {
            lap: instance.cars[i].lap,
            nextTrajectoryIndex: instance.cars[i].nextTrajectoryIndex,
            sock: instance.cars[i].sock
        };
        arrayPos.push(carPos);
    }

    //sort the array in descending order
    arrayPos.sort(sorting);

    for (var i = 0; i < arrayPos.length; i++) {
        //emit client position
        var pos = i + 1;
        io.to(arrayPos[i].sock).emit('trackPosition', pos);
    }
}

function rotateXY(point, a) {

    var x = point.x;
    var y = point.y;

    return {
        x: x * Math.cos(a) + y * Math.sin(a),
        y: y * Math.cos(a) + x * Math.sin(a)
    };

}

function roundCoordinates(point) {

    const ROUND_FACTOR = 100;

    point.x = Math.round(point.x * ROUND_FACTOR) / ROUND_FACTOR;
    point.y = Math.round(point.y * ROUND_FACTOR) / ROUND_FACTOR;;

    return point;

}

function rotate(tileInfoPoints, rotation) {

    resultCoords = [];

    rotation = Math.PI * rotation / 180;

    for (var i = 0; i < tileInfoPoints.length; i++) {
        resultCoords.push(roundCoordinates(rotateXY(tileInfoPoints[i], rotation)));
    };

    console.log("rotate resultCoords : ");
    console.log(resultCoords);

    return resultCoords;

}
