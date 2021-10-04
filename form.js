// API BASE URL
var API_BASE_URL = "http://localhost:3000";

getAllCategories();

// Adding listeners to the drop zone
document.querySelectorAll(".drop-zone__input").forEach(inputElement => {
    const dropZoneElement = inputElement.closest(".drop-zone");
    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });

    inputElement.addEventListener("change", (e) => {
        if(inputElement.files.length)
            updateImg(dropZoneElement, inputElement.files[0]);
    });

    // Event is triggered when you drag a file over the drop zone
    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });

    // Event is triggered when you leave the drop zone
    ["dragleave", "dragend"].forEach(type => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();
        updateImg(dropZoneElement, e.dataTransfer.files[0]);
        dropZoneElement.classList.remove("drop-zone--over");
    });
});

function updateImg(dropZoneElement, file) {
    if(!file.type.match(/image.*/)) {
        alert("The file type must be an image!");
        return false;
    }
    let imgElement = dropZoneElement.querySelector(".drop-zone__img");

    // First time remove the prompt
    if(dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // First time create the image
    if(!imgElement) {
        imgElement = document.createElement("div");
        imgElement.classList.add("drop-zone__img");
        dropZoneElement.appendChild(imgElement);
    }
    imgElement.dataset.label = file.name;
    dataLabel = file.name;

    // Show the image
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        imgElement.style.backgroundImage = `url('${reader.result}')`;
    }
    return true;
}

// Get all categories from the DB and calls fillList
function getAllCategories() {
    axios({
        method: "GET",
        url: API_BASE_URL+"/getAllCategories"
    }).then((res) => {
        fillList(res.data);
    }).catch((err) => {
        console.error(err);
    });
}

// Game helpers
function fillList(data) {
    let selectBox = document.getElementById("category");
    for(let i = 0; i < data.length; i++) {
        let selected = false;
        if(i == 0) {
            selected = true;
        }
        selectBox.options.add(new Option(data[i].cat_name, data[i].cat_id, selected));
    }
}

function formatPrice(event) {
    let priceInput = event.target;
    if(isNaN(priceInput.value)) {
        priceInput.value = 1;
    }
}

function back() {
    window.location.replace("../html/admin-panel.html");
}