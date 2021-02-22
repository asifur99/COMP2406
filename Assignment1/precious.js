let len = restaurants.length; // total restaurants
let rName = new Array(); // name of the restaurants in an array
let minOrder = new Array(); // min order of the restaurants in a n array {index is same}
let delCharge = new Array(); // delivery charge of the restaurants in a n array {index is same}
let countArr = new Array(); // no. of menu category
let n = true; // boolean for one time initilization!
let cnt = 0; // counting menu items
let subtotal = 0; // to calculate subtotal

function addName() {
  for (let i = 0; i < len; i++) {
    x = restaurants[i].name; // gets the name of the restaurant

		let get = document.getElementById("sel"); // gets the select tag from HTML
		let create = document.createElement("option"); // creates option tag
    create.text = x; // enters the value needed to be displayed in the option
    get.appendChild(create); // puts the option object to the select

    let att2 = document.createAttribute("Id"); // creates ID attribute
    att2.value = x; // what the attribute name is
    create.setAttributeNode(att2); // set the attribute for the element

    rName[i] = x; // restaurant name
    minOrder[i] = restaurants[i].min_order; // min order amt
    delCharge[i] = restaurants[i].delivery_charge; // delivery charge of the restaurant
    countArr[i] = Object.keys(restaurants[i].menu).length; // no. of menu category
  }
}

function ifClick(){ // this is called when the option is changed
  let selectVal = document.getElementById("sel").value; // gets the select tag
  let getheading = document.getElementById("heading"); // gets the p tag containing the heading
  let getminorder = document.getElementById("min_order"); // gets the p tag containing the min order
  let getdelcharge = document.getElementById("delivery_charge"); // gets the p tag containg the del charge



  for(let i = 0; i < len; i++){
    if(rName[i] === selectVal){ // if the restaurants is same as the the one in the selected tag
      if(getheading.innerHTML.length > 0){

        // This if shows the prompt to change or not
        if (confirm("Changing selection will remove the items! Do you want to Continue?")) {
          let getS = document.getElementById("subtotal");
          let getd = document.getElementById("div3");
          getd.innerHTML = "";
          subtotal = 0;
          countClicks = 0;
        }
        else{
          break;
        }
      }
      getheading.innerHTML = rName[i]; // sets the heading name
      getminorder.innerHTML = "Minimum order : $" + minOrder[i]; // sets the minOrder of the item
      getdelcharge.innerHTML = "Delivery charge : $" + delCharge[i]; // sets the dilevery charge of the item
      menu(i);
      addLeft(i);
      addRight(i,delCharge[i],minOrder[i]);
    }
  }
}

 // sets the menu
function menu(num){
  let nums = 0;
  let c = 0;

  for(let y = 0; y < countArr[num]; y++){

    let objectprop = Object.getOwnPropertyNames(restaurants[num].menu);
    let olen = Object.keys(restaurants[num]['menu'][objectprop[y]]).length;
    c += olen;

    let getd = document.getElementById("divMain");
    if(n === true){

      let createndiv0 = document.createElement("div");
      getd.appendChild(createndiv0);

      let attdiv0 = document.createAttribute("Id");
      attdiv0.value = "div1";
      createndiv0.setAttributeNode(attdiv0);

      let getd1 = document.getElementById("div1");

      let createndiv = document.createElement("div");
      getd1.appendChild(createndiv);

      let att = document.createAttribute("Id");
      att.value = "div2";
      createndiv.setAttributeNode(att);

      let createndiv3 = document.createElement("div3");
      getd1.appendChild(createndiv3);

      let attd3 = document.createAttribute("Id");
      attd3.value = "div3";
      createndiv3.setAttributeNode(attd3);

      let createndiv4 = document.createElement("div4");
      getd1.appendChild(createndiv4);

      let attd4 = document.createAttribute("Id");
      attd4.value = "div4";
      createndiv4.setAttributeNode(attd4);


      let objectprop = Object.getOwnPropertyNames(restaurants[num].menu);

      for(let yt = 0; yt < objectprop.length; yt++){
        let olen = Object.keys(restaurants[num]['menu'][objectprop[yt]]).length;
        let getd2 = document.getElementById("div2");

        let create = document.createElement("a");
        getd2.appendChild(create);

        let att2 = document.createAttribute("Id");
        att2.value = "menu" + yt;
        create.setAttributeNode(att2);

        let attc = document.createAttribute("class");
        attc.value = "menu";
        create.setAttributeNode(attc);

        let createdl = document.createElement("dl");
        getd2.appendChild(createdl);

        let att3 = document.createAttribute("Id");
        att3.value = "dl" + yt;
        createdl.setAttributeNode(att3);

        for(let z = 0; z < olen; z++){
          let createdt = document.createElement("dt");
          createdl.appendChild(createdt);
          let att2 = document.createAttribute("Id");
          att2.value = "dt" + cnt;
          createdt.setAttributeNode(att2);

          let createdd = document.createElement("dd");
          createdl.appendChild(createdd);
          let att3 = document.createAttribute("Id");
          att3.value = "dd" + cnt;
          createdd.setAttributeNode(att3);

          cnt++
        }
      }
      cnt = 0;
      n = false;
    }

    let getId = document.getElementById("menu" + y);

    //Takes elem thats full and calls fucntion to delete and then create the <p>. We then reinit getId so it can restart from i=0
    if(getId.innerHTML.length > 0){
      del(num);
      creatp(num, olen);
      getId = document.getElementById("menu" + y);
    }

    getId.innerHTML = objectprop[y];

    for(let i = nums; i<c; i++){
      let createname = restaurants[num]['menu'][objectprop[y]][i].name;
      let createprice = restaurants[num]['menu'][objectprop[y]][i].price;
      let getdt = document.getElementById("dt" + nums);
      getdt.innerHTML = createname + " ($ <span id = 'price" + i + "'>" + createprice + "</span>)";

      let createdesc = restaurants[num]['menu'][objectprop[y]][i].description;

      let getdd = document.getElementById("dd" + nums);
      getdd.innerHTML = createdesc + "<br>";
      nums++;
    }
  }
}

//reinitializes the deleted nodes
function creatp(num, olen){
  let getd1 = document.getElementById("div1");
  let createndiv = document.createElement("div");
  getd1.appendChild(createndiv);

  let att = document.createAttribute("Id");
  att.value = "div2";
  createndiv.setAttributeNode(att);

  let objectprop = Object.getOwnPropertyNames(restaurants[num].menu);

  for(let yt = 0; yt < objectprop.length; yt++){
    let olen = Object.keys(restaurants[num]['menu'][objectprop[yt]]).length;
    let getd2 = document.getElementById("div2");

    let create = document.createElement("a");
    getd2.appendChild(create);

    let att2 = document.createAttribute("Id");
    att2.value = "menu" + yt;
    create.setAttributeNode(att2);

    let attc = document.createAttribute("class");
    attc.value = "menu";
    create.setAttributeNode(attc);

    let createdl = document.createElement("dl");
    getd2.appendChild(createdl);

    let att3 = document.createAttribute("Id");
    att3.value = "dl" + yt;
    createdl.setAttributeNode(att3);

    for(let z = 0; z < olen; z++){
      let createdt = document.createElement("dt");
      createdl.appendChild(createdt);
      let att2 = document.createAttribute("Id");
      att2.value = "dt" + cnt;
      createdt.setAttributeNode(att2);

      let createdd = document.createElement("dd");
      createdl.appendChild(createdd);
      let att3 = document.createAttribute("Id");
      att3.value = "dd" + cnt;
      createdd.setAttributeNode(att3);
      cnt++
    }
  }
  cnt = 0;
}

//deletes the node to clear the items
function del(){
  let getd2 = document.getElementById("div2");
  getd2.remove();
}

//Adds items in the Summary side
function addRight(num, del, amt){
  let c = 0;
  for(let y = 0; y < countArr[num]; y++){
    let objectprop = Object.getOwnPropertyNames(restaurants[num].menu);
    let olen = Object.keys(restaurants[num]['menu'][objectprop[y]]).length;
    c += olen;

    for(let z = 0; z < olen; z++){
      let getIdt = document.getElementById("dt" + cnt);
      getIdt.innerHTML += "  <input type='image' src='add.jpg' onclick='getClass(" + cnt + "," + amt + "," + del + "," + y +")' width='20' height='20'/>";
      cnt++
    }
  }
  cnt = 0;

  let getId = document.getElementById("div3");

  let delivery = del;
  let tax = 0.1 * subtotal;
  let total = subtotal + delivery + tax;
  let amtn = amt - subtotal;

  getId.innerHTML += "<em><strong> Subtotal:   </em></strong> $ <span id ='subtotal'>" + Math.round(subtotal*100)/100 + "</span> <br>";
  getId.innerHTML += "<em><strong> Delivery:</em></strong>   $ <span id ='delivery'>" + Math.round(delivery*100)/100 + "</span><br>"
  getId.innerHTML += "<em><strong> Tax:</em></strong>   $ <span id ='tax'>" + Math.round(tax*100)/100 + "</span><br>"
  getId.innerHTML += "<em><strong> Total:</em></strong>   $ <span id ='total'>" + Math.round(total * 100)/100 + "</span><br>";

  if(amtn > 0){
    getId.innerHTML += "<span id ='no'>Add $</span> <span id ='amtn'>" + Math.round(amtn*100)/100 + "</span><span id = 'no1'> more to your order!</span>" + "<br>"
  }else{
    getId.innerHTML += "You're good to go!"
  }
}

//To add the items when the plus icon is clicked
var countClicks = 0;
function getClass(x, amt, del, o) {
  let getC = Number(document.getElementById("price" + x).innerText);
  let getS = document.getElementById("subtotal");
  let getD = document.getElementById("delivery");
  let getT = document.getElementById("tax");
  let getTot = document.getElementById("total");
  let getamtn = document.getElementById("amtn");

  subtotal += getC;

  let delivery = del;
  let tax = 0.1 * subtotal;
  let total = subtotal + delivery + tax;
  let amtn = amt - subtotal;

  getS.innerText = Math.round(subtotal*100)/100;
  getD.innerText = Math.round(delivery*100)/100;
  getT.innerText = Math.round(tax*100)/100;
  getTot.innerText = Math.round(total*100)/100;

  if(amtn > 0){
    getamtn.innerText =  Math.round(amtn*100)/100;
  }else{
    getamtn.innerText = "You're good to go!"
    document.getElementById('no').innerText= "";
    document.getElementById('no1').innerText= "";
    if(countClicks === 0){
      let getId = document.getElementById("div3");
      let but = document.createElement("button");
      but.innerHTML = "Submit";
      let att3 = document.createAttribute("Id");
      att3.value = "submit";
      but.setAttributeNode(att3);
      let att4 = document.createAttribute("onclick");
      att4.value = "alert('YOU ARE THE CHOSEN ONE!')";
      but.setAttributeNode(att4);
      getId.appendChild(but);
      countClicks = 1;
    }
  }
}

//Adds the category o the left hand side
function addLeft(num){
  let getIddiv = document.getElementById("div4");
  if(getIddiv.innerHTML.length > 0){
    getIddiv.innerHTML = "";
  }

  getIddiv.innerHTML += "<strong> Categories </strong>" + "<br>";
  for(let y = 0; y < countArr[num]; y++){
    let getId = document.getElementById("menu" + y).innerHTML;
    getIddiv.innerHTML += "<a href = #menu" + y + ">" + getId + "</a>" + "<br>";
  }
}
