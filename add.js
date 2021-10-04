// API BASE URL
var API_BASE_URL = "http://localhost:3000";

function add() {
    let form = document.getElementById("add-game-form");
    let formData = new FormData(form);
    axios({
        method: "POST",
        url: API_BASE_URL+"/add",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.error(err);
        alert("An error has occurred!");
    });
    alert("Game successfully added!");
    window.location.replace("../html/admin-panel.html");
}