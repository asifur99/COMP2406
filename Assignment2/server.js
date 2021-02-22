const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

let obj = {};
let restaurants = {};
let arr = [];
let rName = [];
let count = 0;
let itemNo = 0;

//reads the files and makes array for name and restaurants obj just like in clients.js
let readf = fs.readdirSync('./restaurants/').forEach(file =>{
  let cont = fs.readFileSync('./restaurants/' + file);
  arr.push(JSON.parse(cont));
  rName.push(JSON.parse(cont).name);
//  console.log(rName);
});
Object.assign(obj,arr);
for(let i = 0; i<arr.length; i++){
  restaurants[rName[i]] = obj[i];
}

//function to make error 404 message
function send404(response){
  response.statuscode = 404;
  response.write("Error");
  response.end();
}

//createsServer
const server = http.createServer(function(request, response){

  //matches the url
  if(request.method === 'GET'){
    if(request.url === "/" || request.url === "/Homepage.html"){
      response.writeHead(200,{'Content-Type': "text/html"});
      fs.createReadStream("./Homepage.html").pipe(response);
    }
    else if(request.url === "/orderform.html"){
      response.writeHead(200,{'Content-Type': "text/html"});
      fs.createReadStream("./orderform.html").pipe(response);
    }
    else if(request.url === "/style.css"){
      response.writeHead(200,{'Content-Type': "text/html"});
      fs.createReadStream("./style.css").pipe(response);
    }
    else if(request.url === "/client.js"){
      response.writeHead(200,{'Content-Type': "text/html"});
      fs.createReadStream("./client.js").pipe(response);
    }
    else if(request.url === "/script.js"){
      response.writeHead(200,{'Content-Type': "text/html"});
      fs.createReadStream("./script.js").pipe(response);
    }
    else if(request.url === "/add.jpg"){
      response.writeHead(200,{'Content-Type': "image/jpg"});
      fs.createReadStream("./add.jpg").pipe(response);
    }
    else if(request.url === "/remove.jpg"){
      response.writeHead(200,{'Content-Type': "image/jpg"});
      fs.createReadStream("./remove.jpg").pipe(response);
    }
    else if(request.url === "/favicon.ico"){
      response.writeHead(200,{'Content-Type': "image/ico"});
      fs.createReadStream("./favicon.ico").pipe(response);
    }
    else if(request.url === "/resName"){
      response.writeHead(200,{'Content-Type': "text/plain"});
      response.write(JSON.stringify(restaurants));
      response.end();
    }
    else if(request.url === "/stats"){
      ejs.renderFile('./stats/stats.ejs',{},{},function call(err, data){
        if(err){
          send404(err);
          return;
        }else{
          response.writeHead(200,{'Content-Type': "text/html"});
          response.end(data);
        }
      });
    }

  }
  else if(request.method === 'POST'){
    if(request.url === "/submit"){
      count++
      let body = '';
			request.on('data', chunk => {
				body += chunk; // convert Buffer to string
			});
			request.on('end', () => {
				let bJs = JSON.parse(body);
				response.end(JSON.stringify(bJs));
        // console.log(bJs);
        let obja = Object.keys(bJs);
        for(let i = 0; i < obja.length; i++){
          bJs[obja[i]];
          //console.log(bJs[obja[i]);
      	}
			});
    }
  }
  else{
    send404(response);
  }
});

server.listen(3000);
// console.log('Server running at 3000 port');
