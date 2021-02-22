let privacy = document.getElementById("hid");
let userinfo = document.getElementById("hid2");

let pobj = JSON.parse(privacy.value).sesuser;
let uobj = JSON.parse(userinfo.value);

let url = String(window.location.href);

let parts = url.split("users/");
console.log();

//console.log(url);

if(pobj === true){
  document.getElementById("privacy").checked = pobj;
}


document.getElementById("privacy").addEventListener("click", function() {
  window.location.reload(true);
  let checked = document.getElementById("privacy").checked;

  let object = { "id" : parts[1], "privacy" : checked}

  console.log(object.id);
  console.log(object.privacy);
  
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(this.responseText);
    }
  };
  req.open("POST", "/updatep", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(object));
});