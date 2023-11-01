// make functions first

// make radius function for circlemarkers
function getRadius(magnitude) {
    // 0 magnitude --> 1 unit
    if(magnitude === 0) {
        return 1
    }
    // not 0 --> magnitude times 4
    return magnitude * 4
}

// making colors based off magnitude
function chooseColor(depth) {
    // red-green gradient, high to low
    if(depth > 90) 
    {
        return "#ea2c2c"
    } 
    else if (depth > 70) 
    {
        return "#ea822c"
    } 
    else if( depth > 50) 
    {
        return "#ee9c00"
    }
    else if( depth > 30) 
    {
        return "#eecc00"
    } 
    else if(  depth > 10) 
    {
        return "#d4ee00"
    }
    else 
    {
        return "#98ee00"
    }
}

// make basemap layer
let basemap = L. tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", 
    {
    attribution: 'Map data: &copy;'
});
// make map/starting center
let myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
})
// add basemap to map
basemap.addTo(myMap);

// make url variable
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// main function using d3, get info from url and make the features using functions above
d3.json(url).then(function(data) 
{
    // getting stryle for geojson layer
   function createStyle(feature) 
   {
    // make variable for style
    var style = {
        opacity: 1,
        fillOpacity: 1,
        // color based off depth
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: "#00000",
        // radius based off magnitude
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.6
    }
    // returns style when called
    return style
   }

//    geojson layer
   L.geoJson(data, {
    // make circle marker
    pointToLayer: function(feature,coordinates) 
    {
        return L.circleMarker(coordinates);
    },
    // call style
    style: createStyle,
    // for the button display mag, depth, and location all in 1 popup
    onEachFeature: function(feature, layer) 
    {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>" +
        "Depth: " + feature.geometry.coordinates[2] + "<br>" +
        "Location: " + feature.properties.place);
    }
    // add to myMap
   }).addTo(myMap);

//    make a legend for map
   let legend = L.control({
        position: "bottomright"
   });

   legend.onAdd = function(){
        // set elements
        let div = L.DomUtil.create("div", "info legend");
        let depths = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for(i = 0; i < depths.length; i++) 
        {
            // div.innerHTML += `<i style="background: ${colors[i]}"></i> ${depths[i]}+ <br>`
            div.innerHTML += '<i style="background:' + chooseColor(depths[i] + 1) + '"></i> ' + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
   }

    legend.addTo(myMap);

})