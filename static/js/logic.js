function getColor(d) {
  return d > 200 ? '#800026' :
         d > 100  ? 'green' :
         d > 50   ? '#FD8D3C' :
         d > 10   ? 'lightgreen' :
                    '#FFEDA0';
}
//map 
const url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const UnitedStates = [39.94040, -104.51633]
var map = L.map('map').setView(UnitedStates,4.5)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,
    attribution:'&copy; <a href="http:www.openstreetmap.org/copyright">\
          OpenStreetMap</a>'}).addTo(map)
var earthquakeLayer= L.geoJSON().addTo(map)

//map circles
d3.json(url).then(function(data){
colorscale=d3.scaleLinear().domain([-10, 10, 50, 100, 200]).range(['#82D53A','lightgreen', '#FD8D3C', 'green', '#FFEDA0'])
L.geoJSON(data,
{
  pointToLayer:function(feature, latlng){
  return L.circleMarker(latlng,{
  radius:feature.properties.mag*4,
  color:"darkgreen",
  fillColor:colorscale(latlng.alt),
  weight:1,
  opacity:1,
  fillOpacity:0.8
  })
  },
  onEachFeature:function(feature, layer){
    layer.bindPopup("<h5>Magnitude: "+feature.properties.mag+"</h5>"+"<h5>location: "+feature.properties.place+"</h5>"+"<h5>depth: "+feature.geometry.coordinates[2]+"</h5>")
  }
}).addTo(earthquakeLayer)

//legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
      grades = [-10, 10, 50, 100, 200],
      labels = [];

  // loop
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);

console.log(data)
}) 