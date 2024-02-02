const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("cart");
    window.location.replace("../html/index.html");
}