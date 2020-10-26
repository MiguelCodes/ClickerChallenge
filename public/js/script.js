var money = 0;
var moneyPerClick = 1;
var autoClickers = 0;
var clickerBuyers = 0;
var extraBuyers = 0;
var autoClickersStarted = false;
var clickerBuyersStarted = false;
var extraBuyersStarted = false;
const socket = io.connect(window.location.hostname);

document.addEventListener('contextmenu', event => event.preventDefault());

function deleteCookie(cname) {
  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

if (document.getElementsByClassName("file")[0].innerHTML == "game") {
  socket.emit('getdata1', {"username": getCookie("username")});

  socket.on('returndata1', (data) => {
    money = data.money;
    moneyPerClick = data.mpc;
    autoClickers = data.mps;
    clickerBuyers = data.acb;
    extraBuyers = data.ecb;

    document.getElementById("usermoney").innerHTML = getCookie("username") + " - $" + money;
    if (moneyPerClick > 1) {
      document.getElementById("mpc").innerHTML ="Money Per Click - $" + moneyPerClick;
    }
    if (autoClickers > 0) {
      document.getElementById("cps").innerHTML ="Money Per Second - $" + autoClickers;
    }
    if (clickerBuyers > 0) {
      document.getElementById("bps").innerHTML ="Autoclickers Per Second - " + clickerBuyers;
    }
    if (extraBuyers > 0) {
      document.getElementById("eps").innerHTML ="Extra Clicks Per Second - " + extraBuyers;
    }


    if (autoClickers > 0) {
      startAutoClickers();
    }
    if (clickerBuyers > 0) {
      startClickerBuyers();
    }
    if (extraBuyers > 0) {
      startExtraBuyers();
    }
  });
}

console.log('%cHold it!', 'color:lightskyblue; font-size:75px; -webkit-text-stroke: 2px black;');
console.log("If someone told you to enter something in here, you are most likely being scammed.");
console.log("In case you have been scammed after our warning, refresh the page. This will put all your data into it's original state.");

socket.on('displayreset', (resetval) => {
  document.getElementById("reset").innerHTML = resetval;
});

socket.on('initiateaccount', () => {
  document.cookie = 'username='+document.getElementById("usernameinput").value+';';
  document.cookie = 'password='+document.getElementById("passwordinput").value+';';
  location.reload();
});

socket.on('homeerror', (err) => {
  document.getElementById("validnamecheck").style.display = "block";
  document.getElementById("validnamecheck").innerHTML = err;
});

socket.on('refresh', () => {
  location.reload();
});

/* 
Copy ME.

socket.emit("changedata", {"mpc": moneyPerClick})
*/

// {"mpc": moneyPerClick, "mps": autoClickers, "acb": clickerBuyers, "scb": extraBuyers}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  var reload = true;
  for (var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      reload = false;
      return c.substring(name.length, c.length);
    }
  }
  location.reload();
}

function clickButton(){
  console.log("Clicked!");
  money = money + moneyPerClick;
  document.getElementById("usermoney").innerHTML = getCookie("username") + " - $" + money;
  document.getElementById("clicky").blur();
}

if (document.getElementsByClassName("file")[0].innerHTML == "index") {
  document.getElementById("usernameinput").addEventListener("input", () => {
    document.getElementById("usernameinput").value = document.getElementById("usernameinput").value.replace(/[^a-zA-Z\d\s:]/g, "");
  });
}

function start(){
  if (document.getElementById("usernameinput").value == '' || document.getElementById("usernameinput").value.length > 15 && document.getElementById("passwordinput").value.length === 0){
    document.getElementById("validnamecheck").style.display = "block";
  } else {
    // window.location = "game.html";
    // localStorage.setItem("username", document.getElementById("usernameinput").value);
    socket.emit('checkhomedata', {password: document.getElementById("passwordinput").value, username: document.getElementById("usernameinput").value});
  }
}

function extraClicks(){
  if (money > 99){
    moneyPerClick++;
     document.getElementById("mpc").innerHTML ="Money Per Click - $" + moneyPerClick;
     money = money - 100;
     document.getElementById("usermoney").innerHTML = getCookie("username") + " - $" + money;
  }
}

function superClicks(){
  if (money > 999){
    moneyPerClick = moneyPerClick + 15;
     document.getElementById("mpc").innerHTML ="Money Per Click - $" + moneyPerClick;
     money = money - 1000;
     document.getElementById("usermoney").innerHTML = getCookie("username") + " - $" + money;
  }
}

function startAutoClickers(){
  if(autoClickersStarted == false){
    autoClickersStarted = true;
    console.log("started");
    setInterval(function(){ 
    money = money + autoClickers;
    document.getElementById("usermoney").innerHTML = getCookie("username") + " - $" + money;
    console.log("Autoclickers: " + autoClickers);
    }, 1000);
  }
}

function startClickerBuyers(){
  if(clickerBuyersStarted == false){
    clickerBuyersStarted = true;
    console.log("started");
    setInterval(function(){ 
    for (let i = 0; i < clickerBuyers; i++) {
	    autoClicker();
    }
    document.getElementById("usermoney").innerHTML = getCookie("username") + " - $" + money;
    }, 1000);
  }
}

function startExtraBuyers(){
  if(extraBuyersStarted == false){
    extraBuyersStarted = true;
    console.log("started");
    setInterval(function(){ 
    for (let i = 0; i < extraBuyers; i++) {
	    extraClicks();
    }
    document.getElementById("cps").innerHTML ="Money Per Second - $" + autoClickers;
    }, 1000);
  }
}

function autoClicker(){
  if (money > 999){
    startAutoClickers();
    autoClickers++;
    document.getElementById("cps").innerHTML ="Money Per Second - $" + autoClickers;
    money = money - 1000;
    document.getElementById("usermoney").innerHTML = getCookie("username") + " - $" + money;
  }
}

function superClicker(){
  if (money > 9999){
    startAutoClickers();
    autoClickers = autoClickers + 15;
    document.getElementById("cps").innerHTML ="Money Per Second - $" + autoClickers;
    money = money - 10000;
    document.getElementById("usermoney").innerHTML = getCookie("username") + " - $" + money;
  }
}

function clickerBuyer(){
  if (money > 999999){
    startClickerBuyers();
    clickerBuyers++;
    document.getElementById("bps").innerHTML ="Autoclickers Per Second - " + clickerBuyers;
    money = money - 1000000;
    document.getElementById("usermoney").innerHTML = getCookie("username") + " - $" + money;
  }
}

function extraBuyer(){
  if (money > 9999999){
    startExtraBuyers();
    extraBuyers++;
    document.getElementById("eps").innerHTML ="Extra Clicks Per Second - " + extraBuyers;
    money = money - 10000000;
    document.getElementById("usermoney").innerHTML = getCookie("username") + " - $" + money;
  }
}

function save() {
  socket.emit("changedata", {"username": getCookie("username"), "money": money, "mpc": moneyPerClick, "mps": autoClickers, "acb": clickerBuyers, "ecb": extraBuyers});
}

// all the leaderboard stuff

if (document.getElementsByClassName("file")[0].innerHTML == "leader") {
  socket.emit("getdata2");
  socket.on("returndata2", (data) => {
    var places = []
    console.log(Object.entries(data))
    Object.entries(data).forEach(([key, val]) => {
      var push = {};
      push[key] = val.money;
      places.push(push); 
    })
    places.sort(function(a, b){ return b[Object.keys(b)[0]]-a[Object.keys(a)[0]] })

    var spots = document.querySelectorAll(".place");
    var i = 0;
    console.log(places)
    places.forEach((dict) => {
      if (i > 9) {

      } else {
        var place_num = (i+1).toString();
        if (place_num === "1") {
          place_num += "st";
        } else if (place_num === "2") {
          place_num += "nd";
        } else if (place_num === "3") {
          place_num += "rd"
        } else {
          place_num += "th";
        }
        place_num += " - ";
        place_num += Object.keys(dict)[0];
        place_num += " - ";
        place_num += "$"+dict[Object.keys(dict)[0]];
        spots[i].innerHTML = place_num;
        i++;
      }
    });
  });
}
