let cart = JSON.parse(localStorage.getItem("cart"));

updateTotal();

let total = cart.total;
document.getElementById("total").innerHTML = total+"&euro;";

function checkout(e) {
    e.preventDefault();
    alert("Payment successful!");
    window.localStorage.removeItem("cart");
    window.location.replace("../html/index.html");
}

function back() {
    window.location.replace("../html/cart-item.html");
}

function updateTotal() {
    let sum = 0;
    for(let i = 0; i < cart.items.length; i++) {
        let item = cart.items[i];
        sum += item.quantity * item.game.game_price;
    }
    cart.total = sum;
}