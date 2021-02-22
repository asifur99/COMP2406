const express = require('express');
const app = express();
const fs = require('fs');
var bodyParser = require('body-parser');


obj = {}; // Object with all the restaurants
let restaurants = {};
let rName = []; //Restaurant Name
let arr = [];
//Object.keys(obj).length;


//Sets up pug for express to use
app.set("view engine", "pug");
app.set("views", "./source");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//reads the files and makes array for name and restaurants obj just like in clients.js
let readf = fs.readdirSync('./restaurants/').forEach(file =>{
	let cont = fs.readFileSync('./restaurants/' + file);
	arr.push(JSON.parse(cont));
	rName.push(JSON.parse(cont).name);
});


//Assigning id to object
Object.assign(obj,arr);
for(let i = 0; i<arr.length; i++){
	restaurants[rName[i]] = obj[i];
}


let numRes = arr.length;//number of restaurants


//Responses
app.get("/", respondHome);
app.get("/addrestaurant", [loadRes, respondAddres]);
app.get("/restaurants", [loadRes, respondRes]);
app.get("/restaurants/*", [loadRes, respondList]);


//app.get("/submit", express.json, postRes);
app.get("/res")


function respondHome(req, res, next){
	res.render("html/homepage", {});
	next();
}


function respondAddres(req, res, next){
	res.render("html/addrestaurant", {products: res.products});
	next();
}


function loadRes(req, res, next){
	res.products = arr;
	next();
}


function respondRes(req, res, next){
	res.render("html/restaurants", {products: res.products});
	next();
}


function respondList(req, res, next){
	//console.log(req.params[0]);
	for(let i = 0; i < arr.length; i++){
		if (arr[i].id == req.params[0]) {
			res.products = arr[i];
			//console.log(arr[i]);
		}
	}
	res.render("html/reslist", {products: res.products});
  	next();
}


app.post('/restaurants', express.json(), function(req, res) {
	console.log(req.body);
	let nthing = {};
	nthing.id = numRes;
	nthing.name = req.body.name;
	nthing.min_order = parseInt(req.body.min_order);
	nthing.delivery_fee = parseInt(req.body.delivery_fee);
	nthing.menu = {title: {}};

	obj[numRes] = nthing;
	numRes++;
	
	arr.push(nthing);

	res.format({
		"application/json": () => {res.status(200).json(nthing)}
	});
});

app.post('/addc', express.json(), function (req, res) {
	let nId = req.body.id;
	arr[nId].menu = req.body.menu;
	res.format({
		"application/json": () => { res.status(200).json(req.body.menu) }
	});
});


app.use('/client.js', express.static(__dirname + '/client.js'));
app.use("/list.js", express.static(__dirname + "/list.js"));


app.listen(3000);
