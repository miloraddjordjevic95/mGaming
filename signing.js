import User from "./models/user.js";

// API BASE URL
var API_BASE_URL = "http://localhost:3000";

// Login user
const loginUser = (e) => {
    e.preventDefault();
    let inputError = false;
    let email = document.getElementById("login-email");
    let password = document.getElementById("login-password");
    let emailValue = email.value.trim();
    let passwordValue = password.value.trim();
    if(emailValue === "") {
        setError(email, "This field cannot be empty!");
        inputError = true;
    } else if(!isValidEmail(emailValue)) {
        setError(email, "Email is not valid!");
        inputError = true;
    } else {
        setSuccess(email);
    }

    if(passwordValue === "") {
        setError(password, "This field cannot be empty!");
        inputError = true;
    } else {
        setSuccess(password);
    }

    if(!inputError) {
        // Login
        axios({
            method: "POST",
            url: API_BASE_URL+"/login",
            data: {
                login_email: emailValue,
                login_password: passwordValue
            }
        }).then((res) => {
            if(res.data[0]) {
                let data = res.data[0];
                let loggedIn = new User(data.usr_firstname, data.usr_lastname, data.usr_email, data.usr_password, data.role_role_id);
                window.localStorage.setItem("loggedIn", JSON.stringify(loggedIn));
                window.location.replace("../html/index.html");
            } else {
                alert("Invalid email and/or password!");
                email.value = "";
                password.value = "";
            }
        }).catch((err) => {
            console.error(err);
        });
    }
}
window.loginUser = loginUser;

// Register user
const registerUser = (e) => {
    e.preventDefault();
    let inputError = false;
    let firstName = document.getElementById("register-first-name");
    let lastName = document.getElementById("register-last-name");
    let email = document.getElementById("register-email");
    let password = document.getElementById("register-password");
    let confirmPassword = document.getElementById("register-confirm-password");
    let firstNameValue = firstName.value.trim();
    let lastNameValue = lastName.value.trim();
    let emailValue = email.value.trim();
    let passwordValue = password.value.trim();
    let confirmPasswordValue = confirmPassword.value.trim();
    if(firstNameValue === "") {
        setError(firstName, "This field cannot be empty!");
        inputError = true;
    } else {
        setSuccess(firstName);
    }

    if(lastNameValue === "") {
        setError(lastName, "This field cannot be empty!");
        inputError = true;
    } else {
        setSuccess(lastName);
    }

    if(emailValue === "") {
        setError(email, "This field cannot be empty!");
        inputError = true;
    } else if(!isValidEmail(emailValue)) {
        setError(email, "Email is not valid!");
        inputError = true;
    } else {
        setSuccess(email);
    }

    if(passwordValue === "") {
        setError(password, "This field cannot be empty!");
        inputError = true;
    } else if(passwordValue.search("(?=.{8,})")) {
        setError(password, "Must be at least 8 characters in length!");
        inputError = true;
    } else if(passwordValue.search("(?=.*[a-z])")) {
        setError(password, "Must contain at least 1 lowercase character!");
        inputError = true;
    } else if(passwordValue.search("(?=.*[A-Z])")) {
        setError(password, "Must contain at least 1 uppercase character!");
        inputError = true;
    } else if(passwordValue.search("(?=.*[0-9])")) {
        setError(password, "Must contain at least 1 number!");
        inputError = true;
    } else if(passwordValue.search("(?=.*[!@#$%^&*])")) {
        setError(password, "Must contain at least 1 special character!");
        inputError = true;
    } else {
        setSuccess(password);
    }

    if(confirmPasswordValue === "") {
        setError(confirmPassword, "This field cannot be empty!");
        inputError = true;
    } else if(passwordValue !== confirmPasswordValue) {
        setError(confirmPassword, "Passwords does not match!");
        inputError = true;
    } else {
        setSuccess(confirmPassword);
    }

    if(!inputError) {
        // Register
        axios({
            method: "POST",
            url: API_BASE_URL+"/register",
            data: {
                register_firstName: firstNameValue,
                register_lastName: lastNameValue,
                register_email: emailValue,
                register_password: passwordValue
            }
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error(err);
        });
        alert("You have");
        window.location.replace("../html/login.html");
    }
}
window.registerUser = registerUser;

// Handle login and register successes and errors
function setError(input, message) {
    let formContent = input.parentElement;
    let smallElement = formContent.querySelector("small");
    smallElement.innerText = message;
    formContent.className = "register-form-content error";
    formContent.className = "login-form-content error";
}

function setSuccess(input) {
    let formContent = input.parentElement;
    formContent.className = "register-form-content success";
    formContent.className = "login-form-content success";
}

function isValidEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}