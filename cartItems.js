let cart = JSON.parse(localStorage.getItem("cart"));

updateTotal();
updateTable();

function updateTable() {
    let table = document.getElementById("cart-content");
    table.innerHTML = "<tr><th>Title</th><th>Price</th>"+"<th>Quantity</th><th>Remove</th></tr>";
    for(let i = 0; i < cart.items.length; i++) {
        addRow(table, cart.items[i]);
    }
    table.innerHTML += "<td></td><td></td><td>Total:</td><td>"+cart.total+"&euro;</td>";
}

// Adds a row into the table with data from item (title, quantity, total price)
function addRow(table, item) {
    let tr = document.createElement("tr");
    // Title
    let title = document.createElement("td");
    title.textContent = item.game.game_title;
    tr.appendChild(title);

    // Price
    let price = document.createElement("td");
    price.innerHTML = item.game.game_price+"&euro;";
    tr.appendChild(price);

    // Quantity
    let quantity = document.createElement("td");
    quantity.textContent = item.quantity;
    tr.appendChild(quantity);

    // Remove
    let delTd = document.createElement("td");
    delTd.innerHTML = createDelButton();
    tr.appendChild(delTd);
    table.appendChild(tr);
}

// Helper to create a delete button in every row
function createDelButton() {
    let btn = "<input type='button' onclick='delGame(event.target)' class='button-rest' value='Remove'/>"
    return btn;
}

function delGame(row) {
    removeFromCart(row.closest("tr").rowIndex - 1);
}

function removeFromCart(index) {
    let item = cart.items[index];
    cart.number--;
    if(--item.quantity == 0) {
        cart.items.splice(index, 1);
    }
    if(cart.number == 0) {
        alert("Your cart is empty!");
        window.location.replace("../html/index.html");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateTotal();
    updateTable();
}

function updateTotal() {
    let sum = 0;
    for(let i = 0; i < cart.items.length; i++) {
        let item = cart.items[i];
        sum += item.quantity * item.game.game_price;
    }
    cart.total = sum;
}

function back() {
    window.location.replace("../html/index.html");
}

function checkout() {
    window.location.replace("../html/checkout.html");
}