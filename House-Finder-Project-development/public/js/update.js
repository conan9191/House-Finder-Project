
let errorContainer = document.getElementById('errorContainerReg');
let updForm = document.getElementById('updateForm');
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let email = document.getElementById('email');
let password = document.getElementById('password');
let street = document.getElementById('street');
let profilepircture = document.getElementById('profilepicture');
let housenumber = document.getElementById('house_number');
let city = document.getElementById('city');
let state = document.getElementById('state');
let pincode =document.getElementById('pincode');
let age = document.getElementById('age');

let FirstNameError = document.getElementById('FirstNameError');
let LastNameError = document.getElementById('LastNameError');
let EmailError = document.getElementById('EmailError');
let PasswordError = document.getElementById('passwordError');
let AgeError = document.getElementById('ageError');
let streetError = document.getElementById('stateError');
let profilepicError = document.getElementById('pictureError');
let housenumberError = document.getElementById('housenumberError');
let cityError = document.getElementById('cityError');
let stateError = document.getElementById('stateError');
let pincodeError = document.getElementById('pincodeError');

let error = false;

if (errorContainer) {
    errorContainer.style.display = "none";
    FirstNameError.style.display = "none";
    LastNameError.style.display = "none";
    EmailError.style.display = "none";
    PasswordError.style.display = "none";
    AgeError.style.display = "none";
    profilepicError.style.display="none";
    streetError.style.display="none";
    housenumberError.style.display="none";
    cityError.style.display="none";
    stateError.style.display="none";
    pincodeError.style.display ="none"
}



if (updForm) {
    updForm.addEventListener('submit', (event) => {
        event.preventDefault();
        error = false;
        errorContainer.style.display = "none";
        FirstNameError.style.display = "none";
        LastNameError.style.display = "none";
        EmailError.style.display = "none";
        PasswordError.style.display = "none";
        AgeError.style.display = "none";
        profilepicError.style.display="none";
        streetError.style.display="none";
        housenumberError.style.display="none";
        cityError.style.display="none";
        stateError.style.display="none";
        pincodeError.style.display ="none"

        if(firstName.value.trim().length<1)
        {
            error = true;
            FirstNameError.style.display = "block";
        }
        if(lastName.value.trim().length<1)
        {
            error = true;
            LastNameError.style.display = "block";
        }
        if(email.value.trim().length<1)
        {
            error = true;
            EmailError.style.display = "block";
        }
        if(password.value.trim().length<1)
        {
            error = true;
            PasswordError.style.display = "block";
        }
        if(age.value.trim().length<1)
        {
            error = true;
            AgeError.style.display = "block";
        }
        if(profilepircture.value.trim().length<1)
        {
            error = true;
            profilepicError.style.display = "block";
        }

        if(street.value.trim().length<1)
        {
            error = true;
            streetError.style.display = "block";
        }
        if(housenumber.value.trim().length<1)
        {
            error = true;
            housenumberError.style.display = "block";
        }
        if(city.value.trim().length<1)
        {
            error = true;
            cityError.style.display = "block";
        }
        if(state.value.trim().length<1)
        {
            error = true;
            stateError.style.display = "block";
        }
        if(pincode.value.trim().length<1)
        {
            error = true;
            pincodeError.style.display = "block";
        }

        if(error)
        {
            errorContainer.style.display = "block"
        }

        if(!error)
        {
            updForm.submit()

        }

    });
}
