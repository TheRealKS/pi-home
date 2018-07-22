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

function checkPin() {
    if (code.length == 4) {
    var upin = md5(code);
    fetch("getcorrectpin.php?pin=" + upin).then(function(res) {
            if (res.ok) {
                return res.text();
            } else {
                alert("error");
            }
        })
        .then(function(pin) {
            if (pin !== "0") {
                var date = new Date();
                sessionStorage.timeauthorized = date.getTime();
                sessionStorage.authorized = pin;
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