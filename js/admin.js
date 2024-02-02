// API BASE URL
var API_BASE_URL = "http://localhost:3000";

getAllGames();

let games; // Array of all games in the database
let focusedGame; // Changes on row click
let gameWrapper = document.getElementsByClassName("add-game-wrapper")[0];

// Delete game
function deleteGame(title, image) {
    let gmTitle = title;
    axios({
        method: "POST",
        url: API_BASE_URL+"/delete",
        data: {
            delete_title: title,
            delete_image: image
        }
    }).then((res) => {
        alert(gmTitle +"has been successfully deleted!");
    }).catch((err) => {
        console.error(err);
    });
}

// Get all games
function getAllGames() {
    axios({
        method: "GET",
        url: API_BASE_URL+"/getAllGames"
    }).then((res) => {
        games = res.data;
        populateTable(res.data);
    }).catch((err) => {
        console.error(err);
    });
}

// Populates table with data
function populateTable(data) {
    let table = document.getElementById("gamesTable");
    // Helper function        
    function addCell(tr, text) {
        let td = tr.insertCell();
        if(!text) {
            text = "";
        }
        td.textContent = text;
        return td;
    }

    // Insert data
    data.forEach(function(item) {
        let row = table.insertRow();
        row.classList.add("game-row");
        addCell(row, item.game_title);
        addCell(row, item.cat_name);
        
        let price = document.createElement("td");
        price.innerHTML = item.game_price + "&euro;";
        row.appendChild(price);

        let modTd = document.createElement("td");
        modTd.appendChild(createModButton());
        row.appendChild(modTd);

        let delTd = document.createElement("td");
        delTd.appendChild(createDelButton());
        row.appendChild(delTd);
    });
}

// Helper to create a delete button in every row
function createDelButton() {
    let btn = document.createElement("input");
    btn.value = "Delete";
    btn.type = "button";
    btn.classList.add("button-rest");
    btn.classList.add("delButton");
    btn.addEventListener("click", (e) => { 
        delGame(e.target);
    });
    return btn;
}

// Helper to create a modify button in every row
function createModButton() {
    let btn = document.createElement("input");
    btn.value = "Modify";
    btn.type = "button";
    btn.classList.add("button-rest");
    btn.classList.add("delButton");
    btn.addEventListener("click", (e) => { 
        modGame(e.target);
    });
    return btn;
}

function delGame(target) {
    let row = target.closest("tr");
    focusedGame = games[row.rowIndex];
    console.log(focusedGame);
    deleteGame(focusedGame.game_title, focusedGame.image_file);
    window.location.reload();
}

function modGame(target) {
    let row = target.closest("tr");
    focusedGame = games[row.rowIndex];
    localStorage.setItem("focused", JSON.stringify(focusedGame));
    window.location.replace("../html/modify.html");
}

function addGame() {
    window.location.replace("../html/add.html");
}

function back() {
    window.location.replace("../html/index.html");
}