// API BASE URL
var API_BASE_URL = "http://localhost:3000";

let stored = JSON.parse(localStorage.getItem("loggedIn"));

let emailLS = stored.email;
let firstNameLS = stored.firstname;
let lastNameLS = stored.lastname;
let passwordLS = stored.password;

displayUser(firstNameLS, lastNameLS, passwordLS);

function displayUser(firstName, lastName, password) {
    document.getElementById("firstName").value = firstName;
    document.getElementById("lastName").value = lastName;
    document.getElementById("password").value = password;
}

function updateUser(e) {
    e.preventDefault();
    let valueChanged = false;
    let firstName = document.getElementById("firstName");
    let lastName = document.getElementById("lastName");
    let password = document.getElementById("password");

    let firstNameValue = firstName.value.trim();
    let lastNameValue = lastName.value.trim();
    let passwordValue = password.value.trim();

    let email = emailLS;
    let fn = firstNameLS;
    let ln = lastNameLS;
    let pw = passwordLS;

    if(firstNameValue !== fn) {
        valueChanged = true;
    } else if(lastNameValue !== ln) {
        valueChanged = true;
    } else if(passwordValue !== pw) {
        valueChanged = true;
    } else {
        valueChanged = false;
    }

    if(valueChanged === true) {
        axios({
            method: "POST",
            url: API_BASE_URL+"/updateUser",
            data: {
                update_email: email,
                update_firstName: firstNameValue,
                update_lastName: lastNameValue,
                update_password: passwordValue
            }
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error(err);
        });
        alert("Your profile has been updated successfully! You must sign in again to confirm new credentials in order to proceed further.");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("cart");
        window.location.replace("../html/index.html");
    }
}

function deleteUser(e) {
    e.preventDefault();
    let email = emailLS;
    let dialog = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if(dialog === false) {
        return;
    } else {
        axios({
            method: "POST",
            url: API_BASE_URL+"/deleteUser",
            data: {
                delete_user: email
            }
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error(err);
        });
        alert("Your account has been deleted successfully!");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("cart");
        window.location.replace("../html/index.html");
    }
}

function back() {
    window.location.replace("../html/index.html");
}