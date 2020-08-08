let favButtonObject = document.getElementById("favButton");

favButtonObject.addEventListener("click", addFavouriteHouse);

/**
 * When tap on favourite button check if house is mark as "Favourite",
 * if so, when tap again will remove from favourite list and changed to "Add Favourite"
 * and vice versa.
 *
 * When house is marked as "Favourite", POST method is call and favourite house added in favourite collection
 * with houseid and favhouse id.
 *
 * when house is marked as "Add Favourite", DELETE method is call and favourite house removed from favourite collection
 * for given houseid.
 */
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
