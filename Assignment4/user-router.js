const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("./usermodel");
const express = require("express");
let router = express.Router();
const session = require("express-session");
const path = require('path');
let oval;

router.get("/", queryParser);
router.get("/", loadUsers);
router.get("/", respondUsers);
router.get("/submit.js", function(req, res, next){
  res.sendFile(path.join(__dirname + "/public/submit.js"));
});

router.get("/:uid", sendSingleUser);

router.param("uid", function(req, res, next, value) {
  let oid;
  oval = value;
  try {
    oid = new ObjectId(value);
  } catch (err) {
    res.status(404).send("User ID " + value + " does not exist.");
    return;
  }

  User.findById(value, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send("Error reading user.");
      return;
    }

    if (!result) {
      res.status(404).send("User ID " + value + " does not exist.");
      return;
    }

    req.user = result;
    next();
  });
});

function sendSingleUser(req, res, next){
  res.format({
      "application/json": function() {
          res.status(200).json(req.user);
      },
      "text/html": () => {
        if(req.session.privacy == true){ 
          if(req.user.username == req.session.username){
            res.render("user", { user: req.user, session:req.session, sesuser:req.user.privacy });
          }
          else{
            res.status(403).render("user", { user: req.user, session:req.session, sesuser:req.user.privacy });
          }
        }
        else{
          res.render("user", { user: req.user, session:req.session, sesuser:req.user.privacy });
        }
      }
  });
  next();
};

function respondUsers(req, res, next) {
    User.find({}, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        let session = req.session.loggedin;
        res.render("users", {data: data, session: session});
      }
    });
};

function queryParser(req, res, next) {
  const MAX_USERS = 50;

  //build a query string to use for pagination later
  let params = [];
  for (prop in req.query) {
    if (prop == "page") {
      continue;
    }
    params.push(prop + "=" + req.query[prop]);
  }
  req.qstring = params.join("&");

  try {
    req.query.limit = req.query.limit || 10;
    req.query.limit = Number(req.query.limit);
    if (req.query.limit > MAX_USERS) {
      req.query.limit = MAX_USERS;
    }
  } catch {
    req.query.limit = 10;
  }

  try {
    req.query.page = req.query.page || 1;
    req.query.page = Number(req.query.page);
    if (req.query.page < 1) {
      req.query.page = 1;
    }
  } catch {
    req.query.page = 1;
  }

  if (!req.query.name) {
    req.query.name = "?";
  }

  next();
};

function loadUsers(req, res, next) {
  let startIndex = (req.query.page - 1) * req.query.limit;
  let amount = req.query.limit;

  User.find().where("name").regex(new RegExp(".*" + req.query.name + ".*", "i")).limit(amount).skip(startIndex).exec(function(err, results) {
      if (err) {
        res.status(500).send("Error reading users.");
        console.log(err);
        return;
      }
      res.users = results;
      next();
      return;
    });
};

//Export the router object, so it can be mounted in the store-server.js file
module.exports = router;
