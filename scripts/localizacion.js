function iniciarMap() {
    // Define the coordinates
    var coord = { lat: 40.942386, lng: -4.113373 }; // Replace with your desired latitude and longitude
    // Create a Google Map object
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16, // Set the initial zoom level (higher zoom shows more detail)
      center: coord // Center the map on the specified coordinates
    });
    // Create a marker object and place it on the map
    var marker = new google.maps.Marker({
      position: coord, // Set the marker's position
      map: map // Add the marker to the map
    });
    // (Optional) Add an information window to the marker (clickable popup)
    var infoWindow = new google.maps.InfoWindow({
      content: 'This is the marker location!' // Customize the content
    });
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
}
