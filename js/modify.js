// API BASE URL
var API_BASE_URL = "http://localhost:3000";

localStorage.removeItem("modifyGame");
let focusedGame = JSON.parse(localStorage.getItem("focused"));
if(!focusedGame) {
    window.location.replace("../html/admin-panel.html");
}

let titles = document.getElementsByClassName("title");
let price = document.getElementById("price");
let desc = document.getElementById("desc");
let category = document.getElementById("category");
let image = document.getElementById("image");

titles[0].value = focusedGame.game_title;
titles[1].value = focusedGame.game_title;
price.value = focusedGame.game_price;
desc.value = focusedGame.game_desc;
category.value = focusedGame.game_category;

function mod() {
    let form = document.getElementById("mod-game-form");
    let formData = new FormData(form);
    axios({
        method: "POST",
        url: API_BASE_URL+"/update",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
        }).then((res) => {
            console.log(res);
            window.location.replace("../html/admin-panel.html");
        }).catch((err) => {
            console.error(err);
            alert("An error has occurred!");
      });
    alert("Game successfully modified");
}