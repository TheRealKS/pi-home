var filled = 0;
var code = "";

window.onkeydown = function(e) {
    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
        inputNumber(String.fromCharCode(e.keyCode));
    } else if (e.keyCode === 8) {
        e.preventDefault();
        backspace();
    } else if (e.keyCode === 46) {
        code = "";
        setPrePin();
    } else if (e.keyCode === 13) {
        checkPin();
    }
};

function setPrePin() {
    document.getElementById("pin").value = "----";

    if (!sessionStorage.getItem("serverip")) {
        fetch("getwsport.php")
        .then(res => {
            if (res.ok)
                return res.text();
        })
        .then(txt => {
            sessionStorage.setItem("serverip", txt);
        });
    }
}

function inputNumber(number) {
    if (code.length < 4) {
        code += number;
        var holder = document.getElementById("pin");
        holder.value = "";
        for (var i = 0; i < code.length; i++) {
            holder.value += "*";
        }
        for (var j = code.length; j < 4; j++) {
            holder.value += "-";
        }
    }
}

function backspace() {
    if (code != "") {
        var holder = document.getElementById("pin");
        if (code.length > 0) {
            code = code.substring(0, code.length - 1);
            holder.value = "";
            for (var i = 0; i < code.length; i++) {
               holder.value += "*";
            }
            for (var j = code.length; j < 4; j++) {
                   holder.value += "-";
               }
        } else {
            code = "";
            holder.value = "----";
        }
    }
}

function showPinScreen() {
    window.location.replace("pin.html");
}

function createSendable(pin) {
    //first hash the pin using a trivial function (i used md5), this so we don't just hash two charachters but also actually get something that is kind of long
    var firsthash= md5(pin);
    //md5 hashes are 32 bit, and we want two parts, so each part is 16 bits
    var firstpart = firsthash.substr(0, 15);
    var secondpart = firsthash.substr(31);
    //because the two parts actually have to be secured, use a keccak based function to hash them, i just used shake128
    var shake1 = shake128(firstpart, 512);
    var shake2 = shake128(secondpart, 512);
    //now, because shake128 is a secure function, so either of the parts cannot be derived from the other part (no merkle-damgard!)
    //because of preimage res the original string can also not be found, so the pin is never used in plaintext outside of the device
    return {part1: shake1, part2: shake2};
}

function checkPin() {
    if (code.length == 4) {
    var upin = createSendable(code);
    let url = "https://" + sessionStorage.getItem("serverip").split("/")[0] + "/pi-home/getcorrectpin.php?pin=" + JSON.stringify(upin);
    var date = new Date();
    localStorage.timeauthorized = date.getTime();
    localStorage.auth_token = pin;
    window.location.replace("index.html");
    return;
    fetch(url).then(function(res) {
            if (res.ok) {
                return res.text();
            } else {
                alert("error");
            }
        })
        .then(function(pin) {
            if (pin !== "0") {
                var date = new Date();
                localStorage.timeauthorized = date.getTime();
                localStorage.auth_token = pin;
                window.location.replace("index.html");
            } else {
                var pin = document.getElementById("pin");
                pin.classList = "animated shake";
                setTimeout(function() {
                    pin.classList = "";
                }, 750);
            }
        });
    } else {
        alert("pin not valid");
    }
}