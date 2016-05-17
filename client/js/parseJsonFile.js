var ParseJsonFile = {

    // callback needs an argument, the result of JSON.parse
    parseJson: function(jsonFile, callback) {

        var xmlhttp = new XMLHttpRequest();
        var url = jsonFile;

        xmlhttp.onreadystatechange = function() {

            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                callback(JSON.parse(xmlhttp.responseText));

            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    },

    createCarsSelectionMenu: function(menuId) {

        var url = "carsList.json";
        var carsList = [];

        ParseJsonFile.parseJson(url, function(carsList) {

            for (var i = 0; i < carsList.length; i++) {

                var option = document.createElement("option");
                option.text = carsList[i];
                option.value = carsList[i];
                var select = document.getElementById(menuId);
                select.appendChild(option);

                jaws.assets.add('cars/'+carsList[i]+'.png');

            }

        });

    },

    createTracksSelectionMenu: function(menuId) {

        var url = "tracksList.json";
        var tracksList = [];

        ParseJsonFile.parseJson(url, function(tracksList) {

            for (var i = 0; i < tracksList.length; i++) {

                var option = document.createElement("option");
                option.text = tracksList[i];
                option.value = tracksList[i];
                var select = document.getElementById(menuId);
                select.appendChild(option);

            }

        });

    },

    // callback needs an argument, the result of JSON.parse
    getTileInfo: function(callback) {

        var url = "TileInfo.json";

        ParseJsonFile.parseJson(url, callback);

    }

}
