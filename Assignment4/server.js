const express = require('express'),
      path = require('path'),
      app = express(),
      mongoose = require("mongoose"),
      session = require('express-session'),
      MongoDBStore = require("connect-mongodb-session")(session),
      ObjectId= require('mongoose').Types.ObjectId,
      bodyParser = require("body-parser");

const store = new MongoDBStore({
  uri: "mongodb://localhost:27017/a4",
  collection: "sessions"
});
app.use(session({ secret: "some secret here", store: store }));

const orderID = new MongoDBStore({
    uri: "mongodb://localhost:27017/a4",
    collection: "orderid"
});
app.use(session({ secret: "order stuff", orderID: orderID }));

//Sets up pug for express to use
app.set("view engine", "pug");
app.set("views", "./pug");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db;

//DataBase
mongoose.connect("mongodb://localhost:27017/a4", { useNewUrlParser: true, useUnifiedTopology: true });

//Define route handlers here
app.get("/", respondHome);

let userRouter = require("./user-router");
app.use("/users", userRouter);

app.get("/registration", registration);
app.get("/orderform", renderres);
app.get("/orderform.js", addpublic);
app.get("/database-initializer.js", addpublic);
app.get("/add.jpg", addpublic);
app.get("/remove.jpg", addpublic);
app.get("/logout", logout);

app.post("/orders", express.json(), order);
app.post("/login", express.json(), login);
app.post("/registration", express.json(), register);
app.post("/updatep", express.json(), updateprivacy);
app.get("/findorder", findorder);

function updateprivacy(req, res, next){
    let id = req.body.id;
    let privacy = req.body.privacy;
    let obj = { _id: ObjectId(id) };
    let prv = { $set: { privacy: privacy } };

    mongoose.connection.db.collection("users").updateOne(obj,prv, function(err, result) {
        if (err) throw err;
        console.log(result);

        res.format({
		"application/json": () => { res.status(200) }
	});
    });
}

function register(req, res, next){
    let username = req.body.username;
    let password = req.body.password;

    let obj = {username: username, password: password, privacy: false};

    mongoose.connection.db.collection("users").findOne({ username: username}, function(err, result){
        if (err) throw err;
        req.session.exist = false;
        if (result == undefined) {
            mongoose.connection.db.collection("users").insertOne(obj, function(err, result) {
                if (err) throw err;
                if (result) {
                    res.redirect("/users");
                } else {
                    res.status(401).send("Registration Error");
                    return;
                }
            });
        } 
        else if (result.username === username) {
            req.session.exist = true;
            res.redirect("/registration");
            return;
        }
        else{
            mongoose.connection.db.collection("users").insertOne(obj, function(err, result) {
                if (err) throw err;
                if (result) {
                res.redirect("/users");
                } else {
                res.status(401).send("Registration Error");
                return;
                }
            });
        };
    });
};

function login(req, res, next){
    if (req.session.loggedin) {
      res.redirect("/users");
      return;
    }

    let username = req.body.username;
    let password = req.body.password;

    mongoose.connection.db.collection("users").findOne({ username: username, password: password}, function(err, result) {
        if (err) throw err;

        if(result){
            req.session.loggedin = true;
            req.session.username = username;
            req.session.password = password;
            res.redirect("/users");
        } else {
            res.status(401).send("Not authorized. Invalid username.");
            return;
        }
    });
};

function logout(req, res, next){
    req.session.loggedin = false;
    res.redirect("/");
};

function renderres(req, res, next){
    if (!req.session.loggedin) {
      //console.log("Login Please!");
      res.redirect("/");
      return;
    }
    res.render("order", { session: req.session });
    next();
};

function respondHome(req, res, next) {
    let session = req.session.loggedin;
    res.render("homepage", {session: session});
    next();
};


function order(req, res,next){
    let obj = req.body;
    obj.orderid = req.session.username;
    mongoose.connection.db.collection("orderid").insertOne(obj, function (err, result) {
        if (err) throw err;
    });
};

function findorder(req, res, next){
    let fobj = { "orderid": req.session.username}
    mongoose.connection.db.collection("orderid").find(fobj, function (err, result) {
        if (err) throw err;
        console.log(req.body);
    });
};

function addpublic(req, res, next){
    let p = req.route.path;
    res.sendFile(path.join(__dirname + "/public" + p));
};

function registration(req, res, next) {
  res.format({
    "application/json": function() {
      res.status(200).json(req.user);
    },
    "text/html": () => {
      res.render("registration", {exist: req.session.exist});
      req.session.exist = false;
    }
  });
  //console.log(req.user);
  next();
};

app.listen(3000);
console.log("Server listening on port 3000");