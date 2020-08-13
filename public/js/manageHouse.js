const input = document.querySelector("input");
const preview = document.querySelector(".preview");

let profilePictureArray = [];

input.style.opacity = 0;
input.addEventListener("change", updateImageDisplay);

function updateImageDisplay() {
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  const curFiles = input.files;
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
      if (validFileType(file)) {
        para.textContent = `File name ${file.name}, file size ${returnFileSize(
          file.size
        )}.`;
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        profilePictureArray.push(image.src);
        image.height = "100";
        image.width = "100";

        listItem.appendChild(image);
        listItem.appendChild(para);
      } else {
        para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
        listItem.appendChild(para);
      }

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
    bathroom: "",
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

function addHouse() {
  validateCompleteHouseInfo();
}

async function validateCompleteHouseInfo() {
  let errorArray = [];

  //profile picture
  if (profilePictureArray) {
    await isvalidProfilePicture(profilePictureArray);
  } else {
    errorArray.push("Invalid House profile picture url.");
  }

  //longitude and latitude
  if (lat && long && isValidLatitudeandLongitude(long.value, lat.value)) {
    houseData.longitude = long.value;
    houseData.latitude = lat.value;
  } else {
    errorArray.push("Missing House longitude/latitude or missing value.");
  }

  //street
  if (Street && Street.value && typeof Street.value === "string") {
    houseData.street = Street.value;
  } else {
    errorArray.push("Invalid House street or missing value.");
  }

  //house number
  if (
    houseNumber &&
    houseNumber.value &&
    typeof houseNumber.value === "string"
  ) {
    houseData.houseNumber = houseNumber.value;
  } else {
    errorArray.push("Invalid House Number or missing value.");
  }

  //city
  if (City && City.value && typeof City.value === "string") {
    houseData.city = City.value;
  } else {
    errorArray.push("Invalid House city or missing value.");
  }

  //state
  if (State && State.value && typeof State.value === "string") {
    houseData.state = State.value;
  } else {
    errorArray.push("Invalid House state or missing value.");
  }

  //pincode
  if (Pincode && Pincode.value && !isNaN(Pincode.value)) {
    houseData.pincode = Pincode.value;
  } else {
    errorArray.push("Invalid House pincode or missing value.");
  }

  //rent
  if (Rent && Rent.value && !isNaN(Rent.value)) {
    houseData.rent = Rent.value;
  } else {
    errorArray.push("Invalid House rent or missing value.");
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
    errorArray.push("Invalid House lease startDate or missing value.");
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
    errorArray.push("Invalid House lease endDate or missing value.");
  }

  if (startDate && endDate && startDate.value > endDate.value) {
    errorArray.push(
      "Lease end date should be greater than start end. Select valid lease end date"
    );
  }

  //otherAmenities
  if (
    otherAmenities &&
    otherAmenities.value &&
    typeof otherAmenities.value === "string"
  ) {
    houseData.otherAmenities = otherAmenities.value;
  } else {
    errorArray.push("Invalid House otherAmenities or missing value.");
  }

  //description
  if (
    description &&
    description.value &&
    typeof description.value === "string"
  ) {
    houseData.description = description.value;
  } else {
    errorArray.push("Invalid House description or missing value.");
  }

  //petFriendly
  houseData.petFriendly = false;
  if (!petFriendlyNo.checked && !petFriendlyYes.checked) {
    errorArray.push("Invalid House petFriendly info or missing value.");
  }
  if (petFriendlyYes.checked) {
    houseData.petFriendly = true;
  }

  //parkingAvailable
  houseData.parkingAvailable = false;
  if (!parkingAvailableYes.checked && !parkingAvailableNo.checked) {
    errorArray.push("Invalid House parkingAvailable info or missing value.");
  }
  if (parkingAvailableYes.checked === true) {
    houseData.parkingAvailable = true;
  }

  //house type

  if (houseType && houseType.value && typeof houseType.value === "string") {
    houseData.houseType.type = houseType.value;
  } else {
    errorArray.push("Invalid House type  or missing value.");
  }

  //number of bedroom
  if (bedroom && bedroom.value && !isNaN(bedroom.value)) {
    houseData.houseType.bedroom = bedroom.value;
  } else {
    errorArray.push("Invalid number of bedroom in house or missing value.");
  }
  //number of hall
  if (hall && hall.value && !isNaN(hall.value)) {
    houseData.houseType.hall = hall.value;
  } else {
    errorArray.push("Invalid number of hall in house or missing value.");
  }

  //number of kitchen
  if (kitchen && kitchen.value && !isNaN(kitchen.value)) {
    houseData.houseType.kitchen = kitchen.value;
  } else {
    errorArray.push("Invalid number of kitchen in house or missing value.");
  }

  if (errorArray.length > 0) {
    // throw `Errors : ${errorArray.toString()}`;
  } else {
    let xhttp = new XMLHttpRequest();
    let method = "POST";
    let url = "/house";
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhttp.send(JSON.stringify(houseData));

    if (xhttp.responseText) {
      console.log(xhttp.responseText);
    }
  }
}

async function isvalidProfilePicture(profilePicArray) {
  if (
    !profilePicArray ||
    !Array.isArray(profilePicArray) ||
    profilePicArray.length === 0
  ) {
    throw `Upload atleast one House  pictures.`;
  }

  for (const element of profilePicArray) {
    await checkImageExists(element, function (existsImage) {
      if (existsImage === true) {
        houseData.profilePicture.push(element);
      }
    });
  }
}

async function checkImageExists(imageUrl, callBack) {
  var imageData = new Image();
  imageData.onload = function () {
    callBack(true);
  };
  imageData.onerror = function () {
    callBack(false);
  };
  imageData.src = imageUrl;
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

function isValidLatitudeandLongitude(long, lat) {
  if (!lat || lat < -90 || lat > 90) {
    return false;
  }
  if (!long || long < -180 || long > 180) {
    return false;
  }

  return true;
}
