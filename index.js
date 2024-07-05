const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb+srv://sachin:02092004ss@cluster0.kqrbl45.mongodb.net/';
const app = express();

const fs = require('fs');


app.use(express.static("public"));
app.use(express.static("images"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/register.html");
});

let userName = "";
let userPassword = "";
let userAddress = "";


app.post("/addtocart", (req, res) => {
    const body = req.body;
    console.log(body);

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        const dbo = db.db("fooddb");
        dbo.collection("Cart").insertOne({ userName, userPassword, userAddress, body }, function (err, result) {
            console.log("Item added to cart");
            db.close();
        });
    });
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});
app.get('/adminmenu', (req, res) => {
    res.sendFile(__dirname + '/admin_menu.html');
});
app.get('/take_away', (req, res) => {
    res.sendFile(__dirname + '/take_away.html');
});

app.get('/adminmain_course', (req, res) => {
    res.sendFile(__dirname + '/adminmain_course.html');
});
app.get('/admindessert', (req, res) => {
    res.sendFile(__dirname + '/admindessert.html');
});
app.get('/adminsnacks', (req, res) => {
    res.sendFile(__dirname + '/admin_snacks.html');
});




app.post("/removeFromCart", (req, res) => {
    const body = req.body;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        const dbo = db.db("fooddb");
        dbo.collection("Cart").deleteOne({ "_id": ObjectId(body._id) }, function (err, result) {
            console.log(body._id + " Deleted.");
            db.close();
        });
    });
});

app.post("/register", function (req, res) {
    const name = req.body.name;
    const password = req.body.password;
    const phone = req.body.phone;
    const email = req.body.email;

    userName = name;
    userPassword = password;
    userAddress = req.body.address;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("fooddb");
        const r = {
            name,
            password,
            phone,
            email,
        };
        dbo.collection('User').insertOne(r, function (err, result) {
            if (err) throw err;
            console.log(result + "\n inserted to Database!");
            db.close();
        });
    });

    res.sendFile(__dirname + "/index.html");
});

app.post("/login", function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log("Connected to Database");
        const dbo = db.db("fooddb");
        const find = { name: req.body.name };

        dbo.collection("User").find(find).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log("You are not an existing user");
                res.send("Not a user");
            } else {
                if (result[0].password != req.body.password) {
                    res.send("Invalid Password");
                    console.log("Wrong Password");
                } else {
                    userName = result[0].name;
                    userPassword = result[0].password;
                    userAddress = result[0].addres;
                    console.log(result);
                    res.sendFile(__dirname + "/index.html");
                }
            }
            db.close();
        });
    });
});

app.get("/snacks.html", function (req, res) {
    res.sendFile(__dirname + "/snacks.html");
    console.log(userName + " " + userPassword);
});

app.get("/main_course.html", function (req, res) {
    res.sendFile(__dirname + "/main_course.html");
});

app.get("/dessert", function (req, res) {
    res.sendFile(__dirname + "/admin_dessert.html");
});

app.get("/dessert.html", function (req, res) {
    res.sendFile(__dirname + "/dessert.html");
});

app.get("/login.html", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

app.get("/cart.html", function (req, res) {
    res.sendFile(__dirname + "/cart.html");
});

app.get("/index.html", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/pay.html", function (req, res) {
    res.sendFile(__dirname + "/pay.html");
});

app.post("/cartdetails", function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("fooddb");
        dbo.collection("Cart").find({ userName: userName }).toArray(function (err, result) {
            res.status(200).send(result);
            db.close();
        });
    });
});

const server = app.listen(9000, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("On-Time-Food listening at %s:%s Port", host, port);
});
