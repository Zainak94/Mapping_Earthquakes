// create the tile layer that will be the background of our map.
    let day = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "navigation-guidance-day-v4",
        maxZoom: 18,
        accessToken: API_KEY
    });
    
    let night = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "navigation-guidance-night-v4",
        maxZoom: 18,
        accessToken: API_KEY
    });
    
    let baseMaps = {"Day Navigation" : day, "Night Navigation": night};
    
    // Create the map object with a center and zoom level.
    let map = L.map("mapid", {
        center: [44, -80],
        zoom: 2,
        layers:[night]
    });
    
    
    // Pass our map layers into our layers control and add the layers control to the map.
    L.control.layers(baseMaps).addTo(map);
    
    // Accessing the airport GeoJSON URL
    let torontoData = "https://raw.githubusercontent.com/iFan13/Mapping_Earthquakes/main/torontoRoutes.json";
    
    // Create a style for the lines.
    let myStyle = {
        color: "#ffffa1",
        weight: 2
    }
    
    // Grabbing our GeoJSON data.
    d3.json(torontoData).then(function(data) {
        console.log(data);
      // Creating a GeoJSON layer with the retrieved data.
      L.geoJson(data,
        {
            style: myStyle,
            onEachFeature: function(feature,layer)
                {
                    layer.bindPopup(`<h3>Airline: ${feature.properties.airline}</h3><hr><h3>Destination: ${feature.properties.dst}</h3>`);
                }
            }).addTo(map);});