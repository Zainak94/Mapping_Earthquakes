// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
    "Streets": streets,
    "Satellite Streets": satelliteStreets
  };

let earthquakes = new L.layerGroup();

let overlays = { "Earthquakes": earthquakes};

  // Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets,earthquakes]
})
// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps,overlays).addTo(map);

function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
}


function getRadius(magnitude) {
    console.log(magnitude)
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
}

function getColor(magnitude) {
    if (magnitude > 5) {
      return "#ea2c2c";
    }
    if (magnitude > 4) {
      return "#ea822c";
    }
    if (magnitude > 3) {
      return "#ee9c00";
    }
    if (magnitude > 2) {
      return "#eecc00";
    }
    if (magnitude > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
}

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data,
        {
        // turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) 
            {
            console.log(data);
            return L.circleMarker(latlng, styleInfo(feature));
            },
        // create a popup for each circleMarker to display the magnitude and
        //  location of the earthquake after the marker has been created and styled.
        onEachFeature: function(feature, layer)
            {
            layer.bindPopup(`Magnitude: ${feature.properties.mag} <br>Location: ${feature.properties.place}`);
            }
        }
    ).addTo(map);
});

// Create a legend control object.
let legend = L.control({
    position: "bottomright"
  });
  
  legend.onAdd = function ()
    {
      let div = L.DomUtil.create("div", "legend");
      const magnitudes = [0, 1, 2, 3, 4, 5];
      const colors = [
        "#98EE00",
        "#D4EE00",
        "#EECC00",
        "#EE9C00",
        "#EA822C",
        "#EA2C2C"
      ];
    
      // Looping through our intervals to generate a label with a colored square for each interval.
      for (var i = 0; i < magnitudes.length; i++)
        {
        div.innerHTML +=`<i style='background: ${colors[i]}'></i>${magnitudes[i]}${magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+"}`; 
        }
    console.log(div)
    return div;
    };
  
  
  legend.addTo(map);