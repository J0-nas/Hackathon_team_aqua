jQuery(function($) {
    $("#button__refresh").click(function(){
      // clearMarkers();/
        getData();
    });
    getData();
});

var map;
var infoWindow;
var infoWindowContents = [];
var markersList = [];

function getData() {
  // let url = 'http://172.16.72.197:8080/coordinates';
  let url = 'http://localhost:8080/coordinates';
  $.getJSON(url, function (data) {
    addAllMarkers(data);
  });
}

function addAllMarkers(markers) {
  clearMarkers();
  for (i = 0; i < markers.length; i++) {
    var position = {lat: markers[i]['lat'], lng: markers[i]['long']};
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: markers[i]['time'],
      animation: google.maps.Animation.DROP
    });
    infoWindow = new google.maps.InfoWindow(), marker, i;
    infoWindowContents[i] = "<div class='info_content'><h4>Record Time</h4><p>" + markers[i]['time'] + "</p></div><h4>Position</h4><p>" + markers[i]['lat'] + ", " + markers[i]['long'] + "</p></div>";
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infoWindow.setContent(infoWindowContents[i]);
        infoWindow.open(map, marker);
      }
    })(marker, i));
    markersList.push(marker);
  }  
}

function setMapOnAll(map) {
  for (var i = 0; i < markersList.length; i++) {
    markersList[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
  markersList = [];
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map--canvas'), {
    center: {lat: 0, lng: 0},
    zoom: 3
  });
}

// function initialize() {
//     var bounds = new google.maps.LatLngBounds();
//     var mapOptions = {
//         mapTypeId: 'roadmap'
//     };
//
//     // Display a map on the page
//     map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
//     map.setTilt(45);
//
//     // Info Window Content
//     var infoWindowContent = [];
//
//     // Display multiple markers on a map
//     var infoWindow = new google.maps.InfoWindow(), marker, i;
//
//     // Loop through our array of markers & place each one on the map
//     for( i = 0; i < markers.length; i++ ) {
//         var position = new google.maps.LatLng(markers[i]['long'], markers[i]['lat']);
//         bounds.extend(position);
//         marker = new google.maps.Marker({
//             position: position,
//             map: map,
//             title: markers[i]['time']
//         });
//         // Allow each marker to have an info window
//         infoWindowContent[i] = "<div class='info_content'><h4>Record Time</h4><p>" + markers[i]['time'] + "</p></div><h4>Position</h4><p>" + markers[i]['lat'] + ", " + markers[i]['long'] + "</p></div>";
//         google.maps.event.addListener(marker, 'click', (function(marker, i) {
//             return function() {
//                 infoWindow.setContent(infoWindowContent[i]);
//                 infoWindow.open(map, marker);
//             }
//         })(marker, i));
//
//         // Automatically center the map fitting all markers on the screen
//         map.fitBounds(bounds);
//     }
//
//     map.addListener('click', function(event) {
//       addMarker(event.latLng);
//     });
//
//     // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
//     var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
//         this.setZoom(14);
//         google.maps.event.removeListener(boundsListener);
//     });
//
// }
