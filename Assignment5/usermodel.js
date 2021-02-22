const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//SCHEMA SETUP
const dbschema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
//   friends: { id: Boolean },
});

//const dbserver = mongoose.model("users", dbschema);

module.exports = mongoose.model("users", dbschema);
