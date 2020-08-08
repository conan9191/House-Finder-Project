let favButtonObject = document.getElementById("favButton");

favButtonObject.addEventListener("click", addFavouriteHouse);

function addFavouriteHouse() {
  let isDeleted = false;

  if (!favButtonObject.value) {
    throw `Provide valid house id to add fav house`;
  }

  let houseId = favButtonObject.value;

  if (favButtonObject.innerText === "Add Favourite") {
    favButtonObject.innerText = "Favourite";
  } else {
    favButtonObject.innerText = "Add Favourite";
    isDeleted = true;
  }

  let xhttp = new XMLHttpRequest();
  let method = "POST";
  let url = "/favourite";

  if (isDeleted) {
    method = "DELETE";
    url = url + "/" + houseId;
  }

  xhttp.open(method, url, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhttp.send(JSON.stringify({ houseId: houseId }));

  if (xhttp.responseText) {
    console.log(xhttp.responseText);
  }
}
