const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Used for deleting image files

// Init app
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log("Application is working on port: " + port);
});

app.use(express.static(`${__dirname}/../Frontend/images`));
app.use(express.static(`${__dirname}/../Frontend/html`));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.append("Access-Control-Allow-Origin", "*");
    res.append("Access-Control-Allow-Methods", 
    "GET, POST, PUT, PATCH, DELETE");
    res.append("Access-Control-Allow-Headers", "*");
    next();
});

// MYSQL connection
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "zavrsni_rad"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

// Setting up mutler for handling images
let uploadedName = "";
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/../Frontend/images/games`);
    },
    filename: (req, file, cb) => {
        uploadedName = Date.now() + path.extname(file.originalname); // Appending extension
        cb(null, uploadedName);
    }
});

let upload = multer({ storage: storage });

// User login
app.post("/login", (req, res) => {
    let user = {
        usr_email: req.body.login_email,
        usr_password: req.body.login_password
    }
    let sql = "SELECT * FROM users WHERE usr_email = ? AND usr_password = ?";
    connection.query(sql, [user.usr_email, user.usr_password], (err, rows) => {
        if(err) throw err;
        else {
            res.send(rows);
        }
    });
});

// User register
app.post("/register", (req, res) => {
    let user = {
        usr_firstname: req.body.register_firstName,
        usr_lastname: req.body.register_lastName,
        usr_email: req.body.register_email,
        usr_password: req.body.register_password
    }
    let sql = "INSERT INTO users (usr_firstname, usr_lastname, usr_email, usr_password) VALUES (?, ?, ?, ?)";
    connection.query(sql, [user.usr_firstname, user.usr_lastname, user.usr_email, user.usr_password], (err, rows) => {
        if(err) throw err;
        res.status(0);
    });
});

// Update user
app.post("/updateUser", (req, res) => {
    let user = {
        usr_firstname: req.body.update_firstName,
        usr_lastname: req.body.update_lastName,
        usr_password: req.body.update_password,
        usr_email: req.body.update_email
    }
    let sql = "UPDATE users "+
    "SET usr_firstname = ?, "+
    "usr_lastname = ?, "+
    "usr_password = ? "+
    "WHERE usr_email = ?";
    connection.query(sql, [user.usr_firstname, user.usr_lastname, user.usr_password, user.usr_email], (err, rows) => {
        if(err) throw err;
        res.status(0);
    });
});

// Delete user
app.post("/deleteUser", (req, res) => {
    let email = req.body.delete_user;
    let sql = "DELETE FROM users WHERE usr_email = ?";
    connection.query(sql, [email], (err, rows) => {
        if(err) throw err;
        res.status(0);
    });
});

// Add game
app.post("/add", upload.single("image"), (req, res) => {
    let game_title = req.body.title;
    let game_cat = req.body.category;
    let game_desc = req.body.desc;
    let game_price = req.body.price;
    let image_file = uploadedName;
    let image_id = null;

    if(req.file) { // If an image was uploaded
        let sql = "INSERT INTO images SET image_file = ?";
        connection.query(sql, [image_file], (err) => {
            if(err) throw err;
            connection.query("SELECT LAST_INSERT_ID()", (err, rows) => {
                if(err) throw err;
                image_id = rows[0]["LAST_INSERT_ID()"]; // Get inserted ID
                let sql = "INSERT INTO games (game_title, game_category, game_price, game_desc, game_image)"+
                " VALUES (?, ?, ?, ?, ?)";
                connection.query(sql, [game_title, game_cat, game_price, game_desc, image_id], (err, rows) => {
                    if(err) throw err;
                    res.status(0);
                });
            }); 
        });
    } else { // If there's no image
        let sql = "INSERT INTO games (game_title, game_category, game_price, game_desc)"+
        " VALUES (?, ?, ?, ?)";
        connection.query(sql, [game_title, game_cat, game_price, game_desc], (err, rows) => {
            if(err) throw err;
            res.status(0);
        });
    }
    uploadedName = "";
});

// Update game
app.post("/update", upload.single("image"), (req, res) => {
    let game_title = req.body.title;
    let game_cat = req.body.category;
    let game_desc = req.body.desc;
    let game_price = req.body.price;
    let image_file = uploadedName;
    let image_id = null;

    if(req.file) { // If an image was uploaded
        let sql = "INSERT INTO images SET image_file = ?";
        connection.query(sql, [image_file], (err) => {
            if(err) throw err;
            connection.query("SELECT LAST_INSERT_ID()", (err, rows) => {
                if(err) throw err;
                image_id = rows[0]["LAST_INSERT_ID()"]; // Get inserted ID
                let sql = "SELECT image_file FROM games JOIN images"+" ON games.game_image = images.image_id WHERE games.game_title = ?";
                connection.query(sql, [game_title], (err, rows) => {
                    if(err) throw err;
                    let old_image = rows[0]["image_file"]; // Get old image filename, to delete it
                    let sql = "UPDATE games "+
                    "SET game_category = ?, "+
                    "game_price = ?, "+
                    "game_desc = ?, "+
                    "game_image = ? "+
                    "WHERE game_title = ?";
                    connection.query(sql, [game_cat, game_price, game_desc, image_id, game_title], (err, rows) => {
                        if(err) throw err;
                        if(old_image) {
                            const path = `${__dirname}/../Frontend/images/games/`+old_image;
                            fs.unlink(path, (err) => {
                                if(err) {
                                    console.error(err);
                                    res.send("0");
                                }
                            });
                        }
                    });
                });
            }); 
        });
    } else { // If there's no image
        let sql = "UPDATE games "+
        "SET game_category = ?, "+
        "game_price = ?, "+
        "game_desc = ? "+
        "WHERE game_title = ?";
        connection.query(sql, [game_cat, game_price, game_desc, game_title], (err, rows) => {
            if(err) throw err;
            res.send("0");
        });
    }
    uploadedName = "";
});

// Delete game
app.post("/delete", (req, res) => {
    let game_title = req.body.delete_title;
    let image = req.body.delete_image;
    let sql = "DELETE FROM games WHERE game_title = ?";
    connection.query(sql, [game_title], (err) => {
        if(err) throw err;
        const path = `${__dirname}/../Frontend/images/games/`+image;
        if(image) {
            fs.unlink(path, (err) => {
                if(err) {
                    console.error(err);
                    return res.status(0);
                }
            });
        }
        res.status(0);
    });
});

// Get all games
app.get("/getAllGames", (req, res) => {
    let sql = "SELECT game_title, cat_name, game_price, game_desc, image_file, game_category"+
    " FROM ((games JOIN categories ON games.game_category = categories.cat_id)"+
    " LEFT JOIN images ON games.game_image = images.image_id)";
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        else {
            res.send(rows);
        }
    });
});

// Get all categories
app.get("/getAllCategories", (req, res) => {
    let sql = "SELECT * FROM categories";
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        else {
            res.send(rows);
        }
    });
});