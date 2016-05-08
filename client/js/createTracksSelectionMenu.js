function createTracksSelectionMenu(menuId) {

    var xmlhttp = new XMLHttpRequest();
    var url = "tracksList.json";

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var tracksList = JSON.parse(xmlhttp.responseText);
            console.log(tracksList);

            for (var i = 0; i < tracksList.length; i++) {

                var option = document.createElement("option");
                option.text = tracksList[i];
                option.value = tracksList[i];
                var select = document.getElementById(menuId);
                select.appendChild(option);

            };

        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}
