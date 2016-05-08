var ParseJsonFile = {

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

    }

}
