var ws;
var wsport;
var wsstage = 0;
var wsid;
const daymilliseconds = 86400000;
var time = 0;
var kicked = false;

function load() {
    document.getElementById("bttn_edit_programme").addEventListener("click", () => {
        window.location.replace("schedule/schedule.html");
    });

    if (!sessionStorage.getItem("serverip")) {
        fetch("getwsport.php")
            .then(res => {
                if (res.ok)
                    return res.text();
            })
            .then(txt => {
                sessionStorage.setItem("serverip", txt);
                load();
            });
    } else {
        if ((localStorage.getItem("session_token") && localStorage.getItem("session_token_expiry")) || localStorage.getItem("auth_token")) {
            var time = Date.now();
            if (localStorage.getItem("session_token_expiry") - time > 0 || localStorage.getItem("auth_token")) {
                fetch("getwsport.php").then(function (res) {
                    if (res.ok) {
                        return res.text();
                    } else {
                        alert("error");
                    }
                }).then(function (txt) {
                    if (txt === "") {
                        alert("error");
                    } else {
                        wsport = txt;
                        websocket();
                    }
                });
            } else {
                localStorage.clear();
                showPinScreen();
            }
        } else {
            showPinScreen();
        }
    }
}

window.onload = load;

function go() {
    document.getElementById("spinner").style.opacity = "0";
    document.getElementById("connectingtextcontainer").style.opacity = "0";
    setTimeout(function () {
        document.getElementById("connectingdiv").style.marginTop = "-100vh";
        document.getElementById("controldiv").style.display = "block";
    }, 500);
}

function websocket() {
    var timer = setInterval(function () {
        time++;
    }, 1);
    if (window.WebSocket) {
        wsport = sessionStorage.getItem("serverip");
        var url = "wss://" + wsport;
        ws = new WebSocket(url);
        ws.onmessage = function (event) {
            if (wsstage == 0) {
                wsid = event.data;
                wsstage++;
                if (localStorage.getItem("auth_token")) {
                    sendSessionTokenRequest();
                } else {
                    sendSessionTokenReAuthRequest();
                }
                wsstage++;
            } else if (wsstage == 1) {
            } else if (wsstage == 2) {
                var json = JSON.parse(event.data);
                if (json.type === "AUTH") {
                    //Received already authorised
                    if (json.valid) {
                        wsid = localStorage.getItem("session_id");
                        clearInterval(timer);
                        console.log("Connected! Took " + time + "ms");
                        go();
                        localStorage.removeItem("auth_token");
                        wsstage++;
                    } else {
                        alert("Not connected!");
                    }
                } else if (json.type === "SESSION") {
                    if (json.id === wsid) {
                        localStorage.setItem("session_token", json.token);
                        localStorage.setItem("session_token_expiry", json.expiry);
                        localStorage.setItem("session_id", wsid);
                        sendSessionTokenAuthRequest();
                    } else {
                        alert("error");
                    }
                }
            } else {
                var json = JSON.parse(event.data);
                switch (json.type) {
                    case "WELCOME":
                        document.getElementById("obj-pos").innerHTML = json.pos === 0 ? "0% (Op)" : "100% (Neer)";
                        document.getElementById("obj-prog-name").innerHTML = json.schedule;
                        break;
                    case "ERROR":
                        alert(json.error);
                        break;
                    default:
                        break;
                }
            }
        };
        ws.onclose = function (event) {
            //alert("disconnected!");
            if (!kicked) { }
        };
        ws.onerror = function (event) {
            //alert("error!");
            connectionError("Websocket Server disconnected");
            console.error(event);
        };
    }
}

function sendSessionTokenAuthRequest() {
    let sestoken = localStorage.getItem("session_token");
    var ajson = {
        type: "SESSION",
        token: sestoken,
        id: wsid
    };
    ws.send(JSON.stringify(ajson));
}

function sendSessionTokenReAuthRequest() {
    let sestoken = localStorage.getItem("session_token");
    let sesid = localStorage.getItem("session_id");
    var ajson = {
        type: "SESSION",
        token: sestoken,
        id: wsid,
        oldid: sesid
    };
    ws.send(JSON.stringify(ajson));
}

function sendSessionTokenRequest() {
    let authtoken = localStorage.getItem("auth_token");
    var ajson = {
        type: "AUTH",
        token: authtoken,
        id: wsid
    };
    ws.send(JSON.stringify(ajson));
}

function checkAuthCode() {
    if (sessionStorage.authorized) {
        var acode = sessionStorage.authorized;
        var ajson = {
            type: "auth",
            code: acode
        };
        ws.send(JSON.stringify(ajson));
    }
}

function sendUp() {
    var upjson = {
        type: "UP",
        id: wsid
    };
    ws.send(JSON.stringify(upjson));
}

function sendDown() {
    var downjson = {
        type: "DOWN",
        id: wsid
    };
    ws.send(JSON.stringify(downjson));
}

function sendStop() {
    var stopjson = {
        type: "STOP",
        id: wsid
    };
    ws.send(JSON.stringify(stopjson));
}

function connectionError(err) {
    document.getElementById("error").style.height = "100vh";
    document.getElementById("errortext").innerHTML += err;
}

(function (window, $) {

    $(function () {


        $('.ripple').on('click', function (event) {
            event.preventDefault();

            var $div = $('<div/>'),
                btnOffset = $(this).offset(),
                xPos = event.pageX - btnOffset.left,
                yPos = event.pageY - btnOffset.top;



            $div.addClass('ripple-effect');
            var $ripple = $(".ripple-effect");

            $ripple.css("height", $(this).height());
            $ripple.css("width", $(this).height());
            $div
                .css({
                    top: yPos - ($ripple.height() / 2),
                    left: xPos - ($ripple.width() / 2),
                    background: $(this).data("ripple-color")
                })
                .appendTo($(this));

            window.setTimeout(function () {
                $div.remove();
            }, 2000);
        });

    });

})(window, jQuery);