jQuery(function($) {
    $("#button__refresh").click(function(){
      // clearMarkers();/
        getData();
    });
    $("#button__clear").click(function(){
      sendClearDatabaseRequest();
    });
    $("#button__refresh--interval").click(function(){
      refreshIntervalButtonClicked();
    });
    $("#data-list__expand-button").click(function(){
      toggleDataList();
    });
    getData();
    setTimeout(refresh(), 5000);

    'use strict';
    var snackbarContainer = document.querySelector('#refresh-message');
    var showSnackbarButton = document.querySelector('#demo-show-snackbar');
    var handler = function(event) {
    };
    showSnackbarButton.addEventListener('click', function() {
      'use strict';
      var data = {
        message: 'Refreshed sightings.',
        timeout: 2000,
        actionHandler: handler,
        actionText: 'Okay'
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });
});

var map;
var infoWindow;
var infoWindowContents = [];
var markersList = [];
var labels = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var labelIndex = 0;
var route;
var routeLength = 0;
var url = 'http://localhost:8080/coordinates';
// var url = 'http://172.16.72.197:8080/coordinates';
var refreshInterval = 10000;

function refreshIntervalButtonClicked() {
  var button = $("#button__refresh--interval");
  if (button.html() == "10") {
    button.html(5);
    refreshInterval = 5000;
  } else if (button.html() == "5") {
    button.html("<i class='material-icons'>clear</i>");
    refreshInterval = 0;
  } else {
    button.html("10");
    refreshInterval = 10000;
    setTimeout(refresh, refreshInterval);
  }
}

function refresh() {
  if (refreshInterval == 0) {
    return;
  }
   console.log("Refreshing.");
   getData();
   if (refreshInterval > 0) {
     setTimeout(refresh, refreshInterval);
   }
}

function toggleDataList() {
  var table = $("#data-list__table");
  table.toggle();
  var icon = $("#data-list__expand-button--icon");
  icon.html() == "expand_less" ? icon.html("expand_more") : icon.html("expand_less");
}

function getData() {
  var showSnackbarButton = document.querySelector('#demo-show-snackbar');
  showSnackbarButton.click();
  $.getJSON(url, function (data) {
    addAllMarkers(data);
  });
}

function addAllMarkers(markers) {
  clearMarkers();
  if (markers == null || markers.length == 0) {
    return;
  }
  for (i = 0; i < markers.length; i++) {
    var position = {lat: markers[i]['lat'], lng: markers[i]['long']};
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: markers[i]['time'],
      label: labels[labelIndex++ % labels.length],
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
  setPolyline();
  fillTable();
}

function fillTable() {
  clearTable();
  var table = $("#data-list__body");
  for (var i = 0; i < markersList.length; i++) {
    var entry = "\
    <tr>\
      <td class='mdl-data-table__cell--non-numeric'>" + markersList[i].title + "</td>\
      <td>" + markersList[i].position + "</td>\
    </tr>\
    "
    table.append(entry);
  }
}

function clearTable() {
  var table = $("#data-list__body");
  table.empty();
}

function setPolyline() {
  var routeCoords = [];
  routeLength = 0;
  for (var i = 0; i < markersList.length; i++) {
    routeCoords[i] = markersList[i].position;
    if (i > 0) {
      routeLength += Math.abs(markersList[i].position.lat() - markersList[i - 1].position.lat());
      routeLength += Math.abs(markersList[i].position.lng() - markersList[i - 1].position.lng());
    }
  }
  var lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: '#393'
  };
  if (route != null) {
    route.setMap(null);
  }
  route = new google.maps.Polyline({
    path: routeCoords,
    icons: [{
      icon: lineSymbol,
      offset: '100%'
    }],
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  route.setMap(map);
  animateCircle(route);
}

function animateCircle(route) {
    var count = 0;
    window.setInterval(function() {
      count = (count + 1) % 200;

      var icons = route.get('icons');
      icons[0].offset = (count / 2) + '%';
      route.set('icons', icons);
  }, routeLength / 5);
}

function setMapOnAll(map) {
  for (var i = 0; i < markersList.length; i++) {
    markersList[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
  clearTable();
  markersList = [];
  labelIndex = 0;
  if (route != null) {
    route.setMap(null);
  }
}

function sendClearDatabaseRequest() {
  $.ajax({
      url: url,
      type: 'DELETE',
      crossDomain: true,
      contentType:'application/json',
      dataType: 'text',
      data: "",
      success: function(result) {
          console.log(result);
          clearMarkers();
      }
      // error: function(err) {
      //   console.log(err.err());
      // }
  });
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map--canvas'), {
    center: {lat: 0, lng: 0},
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.SATELLITE
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
