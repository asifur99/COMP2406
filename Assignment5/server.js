const express = require('express'),
    path = require('path'),
    app = express(),
    mongoose = require("mongoose"),
    session = require('express-session'),
    MongoDBStore = require("connect-mongodb-session")(session),
    ObjectId = require('mongoose').Types.ObjectId,
    bodyParser = require("body-parser");

//making new collections for storing sessions
const store = new MongoDBStore({
    uri: "mongodb://localhost:27017/a5",
    collection: "sessions"
});
app.use(session({ secret: "sessions", store: store }));

//Sets up pug for express to use
app.set("view engine", "pug");
app.set("views", "./");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connecting to DataBase
mongoose.connect("mongodb://localhost:27017/a5", { useNewUrlParser: true, useUnifiedTopology: true });

//Route handlers
app.get("/", respondHome);
app.get("/registration", registration);
app.get("/logout", logout);

let userRouter = require("./user-router");
app.use("/users", userRouter);

app.post("/login", express.json(), login);
app.post("/registration", express.json(), register);


//Functions
function respondHome(req, res, next) {
    let session = req.session.loggedin;
    res.render("user/homepage", { session: session });
    next();
};

function login(req, res, next){
    if (req.session.loggedin) {
      res.send("Logged In!");
      return;
    }
    res.send("Log In PLEASE!");
};

function logout(req, res, next){
  req.session.loggedin = false;
  res.send("Logged out successfully");
}

function registration(req, res, next) {
  res.format({
    "application/json": function () {
      res.status(200).json(req.user);
    },
    "text/html": () => {
      res.render("user/registration", { exist: req.session.exist });
      req.session.exist = false;
    }
  });
  //console.log(req.user);
  next();
};

function register(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  let obj = { username: username, password: password, privacy: false };

  mongoose.connection.db.collection("users").findOne({ username: username }, function (err, result) {
    if (err) throw err;
    req.session.exist = false;
    if (result == undefined) {
      mongoose.connection.db.collection("users").insertOne(obj, function (err, result) {
        if (err) throw err;
        if (result) {
          res.send(result + "added");
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
    else {
      mongoose.connection.db.collection("users").insertOne(obj, function (err, result) {
        if (err) throw err;
        if (result) {
          res.send(result + " added ");
        } else {
          res.status(401).send("Registration Error");
          return;
        }
      });
    };
  });
};




















app.listen(3000);
console.log("Server listening on port 3000");