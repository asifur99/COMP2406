document.getElementById("submitres").addEventListener("click", function(){
    let resName = document.getElementById("resName");
    let delFee = document.getElementById("delFee");
    let minOrder = document.getElementById("minOrder");
    let obj = {name: resName.value, min_order: minOrder.value, delivery_fee: delFee.value};

    let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
            let res = JSON.parse(this.responseText);
            window.location.href = "http://localhost:3000/restaurants/" + res.id;
		}
	}
    req.open("POST", '/restaurants', true);
    req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(obj));
});
