// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
  id: "streets-v11",
	accessToken: API_KEY
});

// We create the second tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
  id: "satellite-streets-v11",
	accessToken: API_KEY
});

let darkMode = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
  id: "dark-v10",
	accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
});

// Create a base layer that holds all three maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Dark": darkMode
};

// 1. Add a 3rd layer group for the major earthquake data.
let allEarthquakes = new L.LayerGroup();
let tectonicPlate = new L.LayerGroup();
let majorEQ = new L.LayerGroup();


// 2. Add a reference to the major earthquake group to the overlays object.
let overlays = {
  "Tectonic Plates": tectonicPlate,
  "Earthquakes": allEarthquakes,
  "Major Earthquakes": majorEQ
};

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data)
{function styleInfo(feature) {
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

  // This function determines the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    if (magnitude > 5) {return "#ea2c2c";}
    else if (magnitude > 4) {return "#ea822c";}
    else if (magnitude > 3) {return "#ee9c00";}
    else if (magnitude > 2) {return "#eecc00";}
    else if (magnitude > 1) {return "#d4ee00";}
    else {return "#98ee00"};
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
      pointToLayer: function(dummy, latlng) {
          return L.circleMarker(latlng);
        },
      style: styleInfo,
      onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }
  ).addTo(allEarthquakes);
});

// Then we add the earthquake layer to our map.
allEarthquakes.addTo(map);

// 3. Retrieve the major earthquake GeoJSON data >4.5 mag for the week.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson")
.then(
    function(data)
    {
      // 4. Use the same style as the earthquake data.
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

      // 5. Change the color function to use three colors for the major earthquakes based on the magnitude of the earthquake.
      function getColor(magnitude) {
        if (magnitude > 5) {return "#ea2c2c"; 
        }
        else if (magnitude > 4) {return "#ea822c";
        }
        else {return "#3A56A6"; 
        }  
      }

      // 6. Use the function that determines the radius of the earthquake marker based on its magnitude.
      function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 4;
      }

      // 7. Creating a GeoJSON layer with the retrieved data that adds a circle to the map 
      // sets the style of the circle, and displays the magnitude and location of the earthquake
      //  after the marker has been created and styled.
      L.geoJson(data, {
        pointToLayer: function(dummy, latlng)
        {
          return L.circleMarker(latlng)
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }   
      })
      // 8. Add the major earthquakes layer to the map.
      .addTo(majorEQ);

      // 9. Close the braces and parentheses for the major earthquake data.
    }
);

majorEQ.addTo(map);

// Here we create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");

  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

// Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < magnitudes.length; i++)
    {
    div.innerHTML +=`<i style='background: ${colors[i]}'></i>${magnitudes[i]}${magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+"}`; 
    }
  return div;
};

// Finally, we our legend to the map.
legend.addTo(map);

let myStyle = {
  color: "red",
  weight: 2,
  fillColor: "yellow",
  fillOpacity: 0.5
};

// Use d3.json to make a call to get our Tectonic Plate geoJSON data.
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
.then(function(data)
  {
    L.geoJSON(data, 
      {
        style: myStyle
      }
    ).addTo(tectonicPlate)
  }
)

tectonicPlate.addTo(map)