let userNames = ["winnifred", "lorene", "cyril", "vella", "erich", "pedro", "madaline", "leoma", "merrill",  "jacquie"];
let users = [];

userNames.forEach(name =>{
	let u = {};
	u.username = name;
	u.password = name;
	u.privacy = false;
	users.push(u);
});

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

MongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, function(err, client) {
  if(err) throw err;	

  db = client.db('a5');
  
  db.listCollections().toArray(function(err, result){
	 if(result.length == 0){
		 db.collection("users").insertMany(users, function(err, result){
			if(err){
				throw err;
			}
			client.close();
		});
		return;
	 }

	 result.forEach(collection => {
		db.collection("users").insertMany(users, function(err, result){
			if(err){
				throw err;
			}
			client.close();
	 	});
	 });

	 
  });
});