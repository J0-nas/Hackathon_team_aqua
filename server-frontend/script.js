jQuery(function($) {
    // Get data.
    getData();
    // Asynchronously Load the map API
    var script = document.createElement('script');
    script.src = "//maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
    document.body.appendChild(script);
});

// var markers = [
//     ['London Eye, London', 51.503454, -0.119562],
//     ['Palace of Westminster, London', 51.499633, -0.124755]
// ];
var markers = [];

function getData() {
  $.getJSON('http://172.16.72.197:8080/coordinates', function (data) {
    markers = data;
    console.log(markers);
    // for (i = 0; i < data.length; i++) {
      //
      // alert(data[i]['time']);
      // markersFromServer[i]['time'] = data[i]['time'];
      // markersFromServer[i][1] = data[i]['lat'];
      // markersFromServer[i][2] = data[i]['long'];
    // }
    // console.log(markersFromServer);
    // console.log(markers);
  });
}

function initialize() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };

    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setTilt(45);

    // Info Window Content
    var infoWindowContent = [];
    // var infoWindowContent = [
    //     ['<div class="info_content">' +
    //     '<h3>Record Time</h3>' +
    //     '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
    //     ['<div class="info_content">' +
    //     '<h3>Palace of Westminster</h3>' +
    //     '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
    //     '</div>']
    // ];

    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i]['long'], markers[i]['lat']);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i]['time']
        });
        // Allow each marker to have an info window
        infoWindowContent[i] = "<div class='info_content'><h3>Record Time</h3><p>" + markers[i]['time'] + "</p></div>";
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });

}
