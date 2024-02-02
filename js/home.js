import { Cart, CartItem } from "../models/cart.js";

// API BASE URL
var API_BASE_URL = "http://localhost:3000";

// Database logic
let categoryTitle;
let allCategoryPosts;
init();

// Get all games
function getAllGames() {
    axios({
        method: "GET",
        url: API_BASE_URL+"/getAllGames"
    }).then((res) => {
        initGames(res.data);
    }).catch((err) => {
        console.error(err);
    });
}

// Get all categories
function getAllCategories() {
    axios({
        method: "GET",
        url: API_BASE_URL+"/getAllCategories"
    }).then((res) => {
        initCategories(res.data);
    }).catch((err) => {
        console.error(err);
    });
}

// Init logic
function init() {
    getAllGames();
    getAllCategories();
}

function initGames(data) {
    let mainContainer = document.getElementById("posts-main-container");
    for(let i = 0; i < data.length; i++) {
        // Div all & category
        let divWrap = document.createElement("div");
        divWrap.classList.add("all");
        divWrap.classList.add(data[i].cat_name.toLowerCase());

        // Div post-image
        let divImage = document.createElement("div"); 
        divImage.classList.add("post-image");
        let img = document.createElement("img");
        if(!data[i].image_file) {
            img.src = "../images/noImage.png";
        } else {
            img.src = "../images/games/"+data[i].image_file;
            img.alt = "Post image";
        }
        divImage.appendChild(img);

        let span = document.createElement("span"); 
        span.classList.add("category-name");
        span.textContent = data[i].cat_name.toLowerCase();
        divImage.appendChild(span);

        // Div post-content
        let divContent = document.createElement("div"); 
        divContent.classList = "post-content";
        let h2 = document.createElement("h2"); 
        h2.textContent = data[i].game_title;
        divContent.appendChild(h2);
        let p = document.createElement("p"); 
        p.textContent = data[i].game_desc;
        divContent.appendChild(p);

        // Div add-to-cart
        let divCart = document.createElement("div"); 
        divCart.classList.add("add-to-cart");
        let divPrice = document.createElement("div"); 
        divPrice.classList.add("game-price");
        let h4 = document.createElement("h4"); 
        h4.innerHTML = data[i].game_price+"&euro;";
        divPrice.appendChild(h4);
        divCart.append(divPrice);

        // Div game-buy
        let divBuy = document.createElement("div"); 
        divBuy.classList.add("game-buy");
        let btn = document.createElement("button"); 
        btn.classList.add("button-cart");
        btn.innerHTML = "<i class='fas fa-cart-plus cart-icon-plus'></i>Add to cart";
        btn.addEventListener("click", (e) => {
            addToCart(data[i]);
        });
        divBuy.appendChild(btn);
        divCart.appendChild(divBuy);
        divWrap.appendChild(divImage);
        divWrap.appendChild(divContent);
        mainContainer.appendChild(divWrap);
        divWrap.appendChild(divCart);
    }
    let stored = JSON.parse(localStorage.getItem("loggedIn"));
    if(stored) {
        document.getElementById("user-login-register").style.display = "none";
        if(stored.role == 1) {
            // USER
            document.getElementById("user-logged-in").style.display = "flex";
            let buttons = document.getElementsByClassName("game-buy");
            for(let i = 0; i < buttons.length; i++) {
                buttons[i].style.visibility = "visible";
            }
        } else if(stored.role == 2) {
            // ADMIN
            document.getElementById("user-admin").style.display = "flex";
        }
    }
}

// Cart logic
let cartBadge = document.getElementsByClassName("cart-icon-badge")[0];
let cartIcon = document.getElementsByClassName("cart-icon")[0];

// Init cart
let myCart = new Cart();
myCart = JSON.parse(localStorage.getItem("cart"));
if(!myCart) { 
    myCart = new Cart();
}
cartBadge.innerHTML = myCart.number;

cartIcon.addEventListener("click", (e) => {
    if(myCart && myCart.number > 0) {
        localStorage.setItem("cart", JSON.stringify(myCart));
        window.location.replace("../html/cart-item.html");
    } else {
        alert("Your cart is empty!");
    }
});

function addToCart(data) {
    let ci = new CartItem(data);
    cartBadge.innerHTML = ++myCart.number;
    for(let i = 0; i < myCart.items.length; i++) {
        if(myCart.items[i].game.game_title == data.game_title) {
            myCart.items[i].quantity++;
            return;
        }
    }
    myCart.items.push(ci);
}

// Container
let containerIndex = document.getElementById("container-index");
containerIndex.style.display = "none";

function initCategories(data) {
    let gamesContainer = document.getElementById("category-head");
    let ul = document.createElement("ul");
    ul.innerHTML += "<div class='category-title active' id='all'>"+"<li>All</li></div>";
    for(let i = 0; i < data.length; i++) {
        let div = document.createElement("div");
        let li = document.createElement("li");
        div.classList.add("category-title");
        div.id = data[i].cat_name.toLowerCase();
        li.innerHTML = data[i].cat_name;
        div.appendChild(li);
        ul.appendChild(div);
    }
    gamesContainer.appendChild(ul);
    categoryTitle = document.querySelectorAll(".category-title");
    allCategoryPosts = document.querySelectorAll(".all");
    for(let i = 0; i < categoryTitle.length; i++) {
        categoryTitle[i].addEventListener("click", filterPosts.bind(this, categoryTitle[i]));
    }
}

// Loader
window.onload = () => {
    setTimeout(() => {
        $("#loader").fadeOut(1500);
        $("#container-index").fadeIn(1500);
    }, 3000);
}

// Image slider
let counter = 1;
setInterval(function() {
    document.getElementById("radio-button" + counter).checked = true;
    counter++;
    if(counter > 5) {
        counter = 1;
    }
}, 5000);

// Push content down
const pushContentDown = (e) => {
    let contentDiv = document.getElementById("content");
    let menuOpen = document.getElementById("menu-open");
    let menuClose = document.getElementById("menu-close");
    if(e.checked) {
        contentDiv.style.marginTop = "250px";
        contentDiv.style.transition = "all 0.5s";
        menuOpen.style.display = "none";
        menuClose.style.display = "inline-block";
    } else {
        contentDiv.style.marginTop = "";
        contentDiv.style.transition = "all 0.5s";
        menuOpen.style.display = "inline-block";
        menuClose.style.display = "none";
    }
}
window.pushContentDown = pushContentDown;

function filterPosts(item) {
    changeActivePosition(item);
    for(let i = 0; i < allCategoryPosts.length; i++) {
        if(allCategoryPosts[i].classList.contains(item.attributes.id.value)) {
            allCategoryPosts[i].style.display = "block";
        } else {
            allCategoryPosts[i].style.display = "none";
        }
    }
}

function changeActivePosition(activeItem) {
    for(let i = 0; i < categoryTitle.length; i++) {
        categoryTitle[i].classList.remove("active");
    }
    activeItem.classList.add("active");
}

// Scroll to top
window.addEventListener("scroll", function() {
    let scroll = document.querySelector(".scroll-to-top");
    scroll.classList.toggle("active", window.scrollY > 500);
});

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
window.scrollToTop = scrollToTop;

const contactForm = (e) => {
    e.preventDefault();
    document.getElementById("contact-full-name").value = "";
    document.getElementById("contact-email").value = "";
    document.getElementById("contact-textarea").value = "";
    alert("The message has been sent successfully.");
}
window.contactForm = contactForm;

const newsletter = (e) => {
    e.preventDefault();
    let newsletter = document.getElementById("subscribe").value;
    if(newsletter === "") {
        return;
    }
    alert("You have been successfully subscribed to our newsletter.");
}
window.newsletter = newsletter;