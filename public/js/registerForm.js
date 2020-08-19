let errorContainer = document.getElementById("errorContainerReg");
let regForm = document.getElementById("regForm");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let email = document.getElementById("email");
let password = document.getElementById("password");
let street = document.getElementById("street");
let profilepircture = document.getElementById("profilepicture");
let housenumber = document.getElementById("house_number");
let city = document.getElementById("city");
let state = document.getElementById("state");
let pincode = document.getElementById("pincode");
let age = document.getElementById("age");

let FirstNameError = document.getElementById("FirstNameError");
let LastNameError = document.getElementById("LastNameError");
let EmailError = document.getElementById("EmailError");
let PasswordError = document.getElementById("passwordError");
let AgeError = document.getElementById("ageError");
let streetError = document.getElementById("streetError");
let profilepicError = document.getElementById("pictureError");
let housenumberError = document.getElementById("housenumberError");
let cityError = document.getElementById("cityError");
let stateError = document.getElementById("stateError");
let pincodeError = document.getElementById("pincodeError");

let error = false;

if (errorContainer) {
  errorContainer.style.display = "none";
  FirstNameError.style.display = "none";
  LastNameError.style.display = "none";
  EmailError.style.display = "none";
  PasswordError.style.display = "none";
  AgeError.style.display = "none";
  profilepicError.style.display = "none";
  streetError.style.display = "none";
  housenumberError.style.display = "none";
  cityError.style.display = "none";
  stateError.style.display = "none";
  pincodeError.style.display = "none";
}

if (regForm) {
  regForm.addEventListener("submit", (event) => {
    event.preventDefault();
    error = false;
    errorContainer.style.display = "none";
    FirstNameError.style.display = "none";
    LastNameError.style.display = "none";
    EmailError.style.display = "none";
    PasswordError.style.display = "none";
    AgeError.style.display = "none";
    profilepicError.style.display = "none";
    streetError.style.display = "none";
    housenumberError.style.display = "none";
    cityError.style.display = "none";
    stateError.style.display = "none";
    pincodeError.style.display = "none";

    if (firstName.value.trim().length < 1) {
      error = true;
      FirstNameError.style.display = "block";
    }
    if (lastName.value.trim().length < 1) {
      error = true;
      LastNameError.style.display = "block";
    }
    if (email.value.trim().length < 1) {
      error = true;
      EmailError.style.display = "block";
    }
    if (password.value.trim().length < 1) {
      error = true;
      PasswordError.style.display = "block";
    }
    if (age.value.trim().length < 1) {
      error = true;
      AgeError.style.display = "block";
    }
    if (profilepircture.value.trim().length < 1) {
      error = true;
      profilepicError.style.display = "block";
    }

    if (street.value.trim().length < 1) {
      error = true;
      streetError.style.display = "block";
    }
    if (housenumber.value.trim().length < 1) {
      error = true;
      housenumberError.style.display = "block";
    }
    if (city.value.trim().length < 1) {
      error = true;
      cityError.style.display = "block";
    }
    if (state.value.trim().length < 1) {
      error = true;
      stateError.style.display = "block";
    }
    if (pincode.value.trim().length < 1) {
      error = true;
      pincodeError.style.display = "block";
    }

    if (error) {
      errorContainer.style.display = "block";
    }

    if (!error) {
      regForm.submit();
    }
  });
}

function validateEmail(elementValue) {
  let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(elementValue);
}
//Select and load image

function readimage() {
  let showpicture = document.getElementById("showpicture");
  let profilepicturefile = document.getElementById("profilepicturefile");
  if (!profilepicturefile.files || !profilepicturefile.files[0]) return;
  while (showpicture.firstChild) {
    showpicture.removeChild(showpicture.firstChild);
  }
  let curFiles = profilepicturefile.files;

  if (curFiles.length === 0) {
    let para = document.createElement("p");
    para.textContent = "No files currently selected for upload";
    showpicture.appendChild(para);
  } else {
    let list = document.createElement("ol");
    showpicture.appendChild(list);

    for (let file of curFiles) {
      let listItem = document.createElement("li");
      let para = document.createElement("p");

      para.textContent = `File name ${file.name}, file size ${returnFileSize(
        file.size
      )}.`;

      let FR = new FileReader();
      let profilePictureArray2 = [];
      FR.addEventListener("load", (evt) => {
        let img = new Image();
        img.height = "100";
        img.width = "100";
        img.src = evt.target.result;
        console.log("image source =" + img.src);
        profilepircture.value = img.src;
        profilePictureArray2.push(img.src);
        listItem.appendChild(img);
      });
      FR.readAsDataURL(file);
      listItem.appendChild(para);
      list.appendChild(listItem);
    }
  }
}

const fileTypes2 = [
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
  return fileTypes2.includes(file.type);
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