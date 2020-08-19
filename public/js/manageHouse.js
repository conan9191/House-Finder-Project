//Select and load image
const input = document.querySelector("input");
const preview = document.querySelector(".preview");

const EL = (sel) => document.querySelector(sel);
let profilePictureArray = [];

function readImage() {
  if (!this.files || !this.files[0]) return;

  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }
  const curFiles = this.files;

  if (curFiles.length === 0) {
    const para = document.createElement("p");
    para.textContent = "No files currently selected for upload";
    preview.appendChild(para);
  } else {
    const list = document.createElement("ol");
    preview.appendChild(list);

    for (const file of curFiles) {
      const listItem = document.createElement("li");
      const para = document.createElement("p");

      para.textContent = `File name ${file.name}, file size ${returnFileSize(
        file.size
      )}.`;

      const FR = new FileReader();
      FR.addEventListener("load", (evt) => {
        const img = new Image();
        img.height = "100";
        img.width = "100";
        img.src = evt.target.result;
        console.log("image source =" + img.src);
        profilePictureArray.push(img.src);
        listItem.appendChild(img);
      });
      FR.readAsDataURL(file);
      listItem.appendChild(para);
      list.appendChild(listItem);
    }
  }
}

EL("#image_uploads").addEventListener("change", readImage);

function createImageFromImageSrcList(imageSrcList) {
  profilePictureArray = [];
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  if (imageSrcList.length === 0) {
    const para = document.createElement("p");
    para.textContent = "No files currently selected for upload";
    preview.appendChild(para);
  } else {
    const list = document.createElement("ol");
    preview.appendChild(list);

    for (const file of imageSrcList) {
      const listItem = document.createElement("li");
      const para = document.createElement("p");

      const image = document.createElement("img");
      image.src = file;
      profilePictureArray.push(image.src);
      image.height = "100";
      image.width = "100";

      listItem.appendChild(image);
      listItem.appendChild(para);

      list.appendChild(listItem);
    }
  }
}

const fileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon",
];

function validFileType(file) {
  return fileTypes.includes(file.type);
}

function returnFileSize(number) {
  if (number < 1024) {
    return number + "bytes";
  } else if (number >= 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + "KB";
  } else if (number >= 1048576) {
    return (number / 1048576).toFixed(1) + "MB";
  }
}

//handling  house details
/**
 * houseData : house object to store and validate house data.
 */
let houseData = {
  _id: "",
  profilePicture: [],
  street: "",
  houseNumber: "",
  city: "",
  state: "",
  pincode: "",
  longitude: "",
  latitude: "",
  rent: "",
  startDate: "",
  endDate: "",
  houseType: {
    _id: "",
    type: "",
    bedroom: "",
    hall: "",
    kitchen: "",
  },
  petFriendly: "",
  otherAmenities: "",
  description: "",
  parkingAvailable: "",
  reviewIds: [],
};

//house Info validation

let houseNumber = document.getElementById("houseNumber");
let Street = document.getElementById("Street");
let City = document.getElementById("City");
let State = document.getElementById("State");
let Pincode = document.getElementById("Pincode");

let lat = document.getElementById("latitude");
let long = document.getElementById("longitude");

let Rent = document.getElementById("Rent");
let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");

let houseType = document.getElementById("houseType");
let bedroom = document.getElementById("bedroom");
let hall = document.getElementById("hall");
let kitchen = document.getElementById("kitchen");

let petFriendlyYes = document.getElementById("petFriendlyYes");
let petFriendlyNo = document.getElementById("petFriendlyNo");

let parkingAvailableYes = document.getElementById("parkingAvailableYes");
let parkingAvailableNo = document.getElementById("parkingAvailableNo");

let otherAmenities = document.getElementById("otherAmenities");
let description = document.getElementById("description");

//handle error

let pictureError = document.getElementById("pictureError");
let latitudeError = document.getElementById("latitudeError");
let longitudeError = document.getElementById("longitudeError");
let streetError = document.getElementById("streetError");
let housenumberError = document.getElementById("housenumberError");
let cityError = document.getElementById("cityError");
let stateError = document.getElementById("stateError");
let pincodeError = document.getElementById("pincodeError");
let rentError = document.getElementById("rentError");
let leasestartError = document.getElementById("leasestartError");
let leaseendError = document.getElementById("leaseendError");
let leaseendlessthanstartdateError = document.getElementById(
  "leaseendlessthanstartdateError"
);
let amenitiesError = document.getElementById("amenitiesError");
let descriptionError = document.getElementById("descriptionError");
let petError = document.getElementById("petError");
let parkingError = document.getElementById("parkingError");
let bedroomError = document.getElementById("bedroomError");
let hallError = document.getElementById("hallError");
let kitchenError = document.getElementById("kitchenError");
let displayErrorBar = document.getElementById("displayError");

let errorArray = [];

let houseId = ""; //needed to edit house

window.onload = function () {
  let houseDetails = document.getElementById("house");
  if (houseDetails) {
    this.editHouseInfoLoad(houseDetails);
  }
};

function editHouseInfoLoad(houseDetails) {
  let houseDetailsJson = JSON.parse(houseDetails.title);
  houseId = houseDetailsJson["_id"];

  let housePictures = houseDetailsJson["profilePicture"];
  createImageFromImageSrcList(housePictures);

  houseNumber.value = houseDetailsJson["houseNumber"];
  Street.value = houseDetailsJson["street"];
  long.value = houseDetailsJson["longitude"];
  lat.value = houseDetailsJson["latitude"];
  City.value = houseDetailsJson["city"];
  State.value = houseDetailsJson["state"];
  Pincode.value = houseDetailsJson["pincode"];
  Rent.value = houseDetailsJson["rent"];
  startDate.value = formatDate(houseDetailsJson["startDate"]);
  endDate.value = formatDate(houseDetailsJson["endDate"]);
  let housetypetemp = houseDetailsJson["houseType"];
  houseType.value = housetypetemp["type"];
  bedroom.value = housetypetemp["bedroom"];
  hall.value = housetypetemp["hall"];
  kitchen.value = housetypetemp["kitchen"];
  otherAmenities.value = houseDetailsJson["otherAmenities"];
  description.value = houseDetailsJson["description"];

  let petFriendly = houseDetailsJson["petFriendly"];
  if (petFriendly) {
    petFriendlyYes.checked = true;
  } else {
    petFriendlyNo.checked = true;
  }
  let parkingAvailable = houseDetailsJson["parkingAvailable"];
  if (parkingAvailable) {
    parkingAvailableYes.checked = true;
  } else {
    parkingAvailableNo.checked = true;
  }
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function addHouse() {
  errorArray = [];
  setdefaultErrorStyle();
  validateCompleteHouseInfo();

  if (errorArray.length > 0) {
    displayError(errorArray);
    console.log("Error in add house");
  } else {
    let xhttp = new XMLHttpRequest();
    let method = "POST";
    let url = "/house";

    if (houseId) {
      method = "PATCH";
      url = url + "/" + houseId;
    }

    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhttp.send(JSON.stringify(houseData));

    if (xhttp.responseText) {
      console.log(xhttp.responseText);
    }
    console.log("Succesfully added house");

    let msg = "Succesfully added house";
    if (houseId) {
      msg = "Succesfully edited house";
    }

    reloadHouseList();
    window.alert(msg);
  }
}

function deleteHouse() {
  let buttonId = event.srcElement.value;
  if (!buttonId) {
    throw `Cannot delete house. Invalid comment Id`;
  }

  let xhttp = new XMLHttpRequest();
  let method = "DELETE";
  let url = "/house";
  url = url + "/" + buttonId;

  xhttp.open(method, url, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhttp.send(JSON.stringify({ id: buttonId }));

  reloadHouseList();
}

function reloadHouseList() {
  let xhttpget = new XMLHttpRequest();
  method = "GET";
  url = "/updateHouse";

  xhttpget.open(method, url, true);
  xhttpget.setRequestHeader("Content-type", "application/json");
  xhttpget.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhttpget.send();

  location.reload();
}

function validateCompleteHouseInfo() {
  validateHouseProfilePicture();
  validateOtherHouseInfo();
}

function validateHouseProfilePicture() {
  //profile picture
  if (profilePictureArray && isvalidProfilePicture(profilePictureArray)) {
    houseData.profilePicture = profilePictureArray;
  } else {
    errorArray.push(pictureError);
  }
}

function validateOtherHouseInfo() {
  //longitude and latitude
  if (lat && isValidNumeric(lat) && isValidLatitude(lat.value)) {
    houseData.latitude = lat.value;
  } else {
    errorArray.push(latitudeError);
  }

  if (lat && isValidNumeric(long) && isValidLongitude(long.value)) {
    houseData.longitude = long.value;
  } else {
    errorArray.push(longitudeError);
  }

  //street
  if (isValidString(Street)) {
    houseData.street = Street.value;
  } else {
    errorArray.push(streetError);
  }

  //house number
  if (isValidString(houseNumber)) {
    houseData.houseNumber = houseNumber.value;
  } else {
    errorArray.push(housenumberError);
  }

  //city
  if (isValidString(City) && isValidStringOnlyLetters(City.value)) {
    houseData.city = City.value;
  } else {
    errorArray.push(cityError);
  }

  //state
  if (isValidString(State) && isValidStringOnlyLetters(State.value)) {
    houseData.state = State.value;
  } else {
    errorArray.push(stateError);
  }

  //pincode
  if (isValidNumeric(Pincode)) {
    houseData.pincode = Pincode.value;
  } else {
    errorArray.push(pincodeError);
  }

  //rent
  if (isValidNumeric(Rent)) {
    houseData.rent = Rent.value;
  } else {
    errorArray.push(rentError);
  }

  //startDate;
  let validDate = false;
  if (startDate) {
    let date = isValidDate(startDate);
    if (date) {
      houseData.startDate = date;
      validDate = true;
    }
  }

  if (!validDate) {
    errorArray.push(leasestartError);
  }

  validDate = false;
  if (endDate) {
    let date = isValidDate(endDate);
    if (date) {
      houseData.endDate = date;
      validDate = true;
    }
  }

  if (!validDate) {
    errorArray.push(leaseendError);
  }

  if (startDate && endDate && startDate.value > endDate.value) {
    errorArray.push(leaseendlessthanstartdateError);
  }

  //otherAmenities
  if (
    otherAmenities &&
    otherAmenities.value &&
    typeof otherAmenities.value === "string" &&
    otherAmenities.value.trim().length >= 10
  ) {
    houseData.otherAmenities = otherAmenities.value;
  } else {
    errorArray.push(amenitiesError);
  }

  //description
  if (
    description &&
    description.value &&
    typeof description.value === "string" &&
    description.value.trim().length >= 10
  ) {
    houseData.description = description.value;
  } else {
    errorArray.push(descriptionError);
  }

  //petFriendly
  houseData.petFriendly = false;
  if (!petFriendlyNo.checked && !petFriendlyYes.checked) {
    errorArray.push(petError);
  }
  if (petFriendlyYes.checked) {
    houseData.petFriendly = true;
  }

  //parkingAvailable
  houseData.parkingAvailable = false;
  if (!parkingAvailableYes.checked && !parkingAvailableNo.checked) {
    errorArray.push(parkingError);
  }
  if (parkingAvailableYes.checked === true) {
    houseData.parkingAvailable = true;
  }

  //house type

  if (isValidString(houseType)) {
    houseData.houseType.type = houseType.value;
  }

  //number of bedroom
  if (isValidNumeric(bedroom)) {
    houseData.houseType.bedroom = bedroom.value;
  } else {
    errorArray.push(bedroomError);
  }
  //number of hall
  if (isValidNumeric(hall)) {
    houseData.houseType.hall = hall.value;
  } else {
    errorArray.push(hallError);
  }

  //number of kitchen
  if (isValidNumeric(kitchen)) {
    houseData.houseType.kitchen = kitchen.value;
  } else {
    errorArray.push(kitchenError);
  }
}

function displayError(erorArray) {
  erorArray.forEach((element) => {
    element.style.display = "block";
  });
  displayErrorBar.style.display = "block";
}

function setdefaultErrorStyle() {
  pictureError.style.display = "none";
  latitudeError.style.display = "none";
  longitudeError.style.display = "none";
  streetError.style.display = "none";
  housenumberError.style.display = "none";
  cityError.style.display = "none";
  stateError.style.display = "none";
  pincodeError.style.display = "none";
  rentError.style.display = "none";
  leasestartError.style.display = "none";
  leaseendError.style.display = "none";
  leaseendlessthanstartdateError.style.display = "none";
  amenitiesError.style.display = "none";
  descriptionError.style.display = "none";
  petError.style.display = "none";
  parkingError.style.display = "none";
  bedroomError.style.display = "none";
  hallError.style.display = "none";
  kitchenError.style.display = "none";
  displayErrorBar.style.display = "none";
}

function isvalidProfilePicture(profilePicArray) {
  if (
    !profilePicArray ||
    !Array.isArray(profilePicArray) ||
    profilePicArray.length === 0
  ) {
    return false;
  }

  return true;
}

function isValidDate(inputText) {
  var pdate = inputText.value.split("-");
  var yy = parseInt(pdate[0]);
  var mm = parseInt(pdate[1]);
  var dd = parseInt(pdate[2]);

  let date = mm + "/" + dd + "/" + yy;
  var dateformat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/; ///^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  // Match the date format through regular expression
  if (date.match(dateformat)) {
    // Create list of days of a month [assume there is no leap year by default]
    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (mm == 1 || mm > 2) {
      if (dd > ListofDays[mm - 1]) {
        return false;
      }
    }

    if (mm == 2) {
      var lyear = false;
      if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
        lyear = true;
      }
      if (lyear == false && dd >= 29) {
        return;
      }
      if (lyear == true && dd > 29) {
        return;
      }
    }
  } else {
    return;
  }

  return date;
}

function isValidLatitude(lat) {
  if (lat < -90 || lat > 90) {
    return false;
  }
  return true;
}

function isValidLongitude(long) {
  if (long < -180 || long > 180) {
    return false;
  }

  return true;
}

function isValidStringOnlyLetters(inputtxt) {
  let value = inputtxt.replace(/\s+/g, "");
  let letters = /^[A-Za-z]+$/;
  if (value.match(letters)) {
    return true;
  }
  return false;
}

function isValidString(input) {
  if (
    input &&
    input.value &&
    typeof input.value === "string" &&
    input.value.trim().length > 0
  ) {
    return true;
  }
  return false;
}

function isValidNumeric(input) {
  if (
    input &&
    input.value &&
    !isNaN(input.value) &&
    input.value.trim().length > 0
  ) {
    return true;
  }
  return false;
}
