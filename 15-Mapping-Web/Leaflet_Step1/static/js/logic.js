function createMap(eqPlaces) {

  // Create the tile layer that will be the background of our map.
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create a baseMaps object to hold the streetmap layer.
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the Earthquake places layer.
  var overlayMaps = {
    "Earthquake Places": eqPlaces
  };

  // Create the map object with options.
  var myMap = L.map("map", {
    //center: [40.73, -74.0059],
    center: [38.81,-122.85],
    zoom: 12,
    layers: [streetmap, eqPlaces]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false }).addTo(myMap);
    
    
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {
    
        var div = L.DomUtil.create('div', 'info legend');
        depth = [-10, 10, 30, 50, 70,90];
        //labels = ['-10 - 10','10-30','30-50','50-70','70-90','Above 90'];
        colorsarray=["Green","LightGreen","Yellow","Gold","Orange","Red"];
        div.innerHTML = '<div><b>Legend</b></div>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML += 
            '<i style="background:' + colorsarray[i] + '"></i> ' +
                 depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + 
                 '<br>' : '+');
        
            };
        return div;
          }
    legend.addTo(myMap);  
  
}

function createMarkers(response) {
  
  var features = response.features;
  // Initialize an array to hold earthquake markers.
  var eqMarkers = [];

  // Loop through the earthquakeplaces array.
  for (var index = 0; index < features.length; index++) {
    var feature = features[index];

  //   //  * Your data markers should reflect the magnitude of the earthquake 
  // by their size and and depth of the earthquake by color. 
  // Earthquakes with higher magnitudes should appear larger and earthquakes 
  // with greater depth should appear darker in color.

  //  * **HINT:** The depth of the earth can be found as the third coordinate for 
  // each earthquake.
 
    // var eqMarker = L.marker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]])
    //                 .bindPopup("<h3>" + feature.properties.place 
    //                 + "<h3><h3>Magnitude: " + feature.properties.mag + "</h3>");


    var eqMarker = L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],
                    {
                      //color: "grey",
                      color: getColorbyDepth(feature.geometry.coordinates[2]),
                      fillOpacity: 0.75,
                      radius:drawPerMagnitude(feature.properties.mag)
                    })
                    .bindPopup("<h3>" + feature.properties.place 
                    + "<h3><h3>Magnitude: " + feature.properties.mag + "</h3>");
  
  function drawPerMagnitude(mag) 
    {return mag * 100;}

    // function for displaying the marker in diff colors depending on the depth
  function getColorbyDepth(depth) {
    
    var color = "";
    if (depth > 90) 
      {color = "red";}
    else if (depth > 70) 
      {color = "orange";}
    else if (depth > 50) 
      {color = "gold";}
    else if (depth > 30) 
      {color = "yellow";}
    else if (depth > 10) 
      {color = "lightgreen";}
    else {color = "green";}

    return color;
  }                
  //   // // Add the marker to the earthquakemarker array.
    eqMarkers.push(eqMarker);
}

  // Create a layer group that's made from the earthquake markers array, and pass it to the createMap function.
  createMap(L.layerGroup(eqMarkers));
}

//Perform an API call to the Earthquake API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(createMarkers);
