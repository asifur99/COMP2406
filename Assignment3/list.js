let val = document.getElementById("hid");
let div = document.getElementById("menu");

let obj = JSON.parse(val.value);
let num = 0;

div.innerHTML = menu();

function menu(){
    let menu = obj.menu;
    let result = "<h3> MENU </h3>";
    //For each category in the menu
    Object.keys(menu).forEach(key => {
      result += `<b>${key}</b><a name="${key}"></a><br>`;
      //For each menu item in the category
      Object.keys(menu[key]).forEach(id => {
        num++;
        item = menu[key][id];
        result += `${item.name} (\$${item.price}) <br>`;
        result += item.description + "<br><br>";
      });
    });
    return result;
}

function onload(){
    document.getElementById("catsel").innerHTML = genDropDownList();
}

function genDropDownList() {
  let result = '<select name="catsel" id="restaurant-select">';
  Object.keys(obj.menu).forEach(elem => {
    result += `<option value="${elem}">${elem}</option>`;
  });
  result += "</select>";
  return result;
}

document.getElementById("addCat").addEventListener("click", function() {
  let inp = document.getElementById("addCattxt").value;

  let sel = document.getElementById("catsel");
  let opt = document.createElement('option');
  opt.appendChild(document.createTextNode(inp));
  opt.value = inp;
  sel.appendChild(opt);

  let men = document.getElementById("menu");
  let b = document.createElement('B');
  let t = document.createTextNode(inp);
  b.appendChild(t);
  men.appendChild(b)

  obj.menu[inp] = {};

  let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
            let res = JSON.parse(this.responseText);
            location.reload();
		}
	}
    req.open("POST", '/addc', true);
    req.setRequestHeader("Content-Type", "application/json");
	  req.send(JSON.stringify(obj));
});

document.getElementById("addItem").addEventListener("click", function () {
  let itemName = document.getElementById("itemName").value;
  let itemDesc = document.getElementById("itemDesc").value;
  let itemP = document.getElementById("itemP").value;
  console.log("Printing Items: " + num);
  
});