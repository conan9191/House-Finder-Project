let latitude = document.getElementById("latitude").innerText;
let longitude = document.getElementById("longitude").innerText;

function initMap() {
  var test = { lat: parseInt(latitude), lng: parseInt(longitude) };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: test,
  });
  var marker = new google.maps.Marker({
    position: test,
    map: map,
    mapTypeId: google.maps.MapTypeId.HYBRID,
  });
}
