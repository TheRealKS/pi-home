var ws;
var wsport;
const daymilliseconds = 86400000;
var time = 0;
var kicked = false;

function load() {
    document.getElementById("bttn_edit_programme").addEventListener("click", () => {
        window.location.replace("schedule/schedule.html"); 
    });
    go();
    return;
    if (sessionStorage.authorized && sessionStorage.timeauthorized) {
        var date = new Date();
        if (date.getTime() - sessionStorage.timeauthorized < daymilliseconds) {
            fetch("getwsport.php").then(function(res) {
                if (res.ok) {
                    return res.text();
                } else {
                    alert("error");
                }
            }).then(function(txt) {
                if (!isNaN(txt)) {
                    wsport = parseInt(txt);
                    setTimeout(websocket, 1000);
                } else if (txt === "") {
                    alert("error");
                } else {
                    alert("error");
                }
            });
        } else {
            sessionStorage.clear();
            showPinScreen();
        }
    } else {
        showPinScreen();
    }
}

window.onload = load;

function go() {
    document.getElementById("spinner").style.opacity = "0";
    document.getElementById("connectingtextcontainer").style.opacity = "0";
    setTimeout(function() {
        document.getElementById("connectingdiv").style.marginTop = "-100vh";
        document.getElementById("controldiv").style.display = "block";
    }, 500);
}

function websocket() {
    var timer = setInterval(function() {
        time++;
    }, 1);
    if (window.WebSocket) {
        var url = "ws://" + document.URL.substr(7).split('/')[0] + ":" + wsport;
        ws = new WebSocket(url);
        ws.onopen = function(event) {
            checkAuthCode();
        };
        ws.onmessage = function(event) {
            var json = JSON.parse(event.data);
            if (json.valid !== undefined) {
                if (json.valid) {
                    clearInterval(timer);
                    console.log("Connected! Took " + time + "ms");
                    go();
                } else {
                    alert("authorization code unknown");
                    kicked = true;
                    ws.close();
                }
            }
            if (json.type === "lastcommand") {
                //Lastcommand logic
                if (json.lastcommand !== "stop") {
                    if (json.lastcommand = "up") {
                        document.getElementById("position").innerHTML = "Positie: 0% (op)";
                    } else {
                        document.getElementById("position").innerHTML = "Positie: 100% (neer)";
                    }
                    var fab = document.getElementById("fab");
                    fab.classList += " spin";
                    setTimeout(function() {
                        fab.classList = "material-button-floating-text material-icons";
                    }, 500);
                }
            }
        };
        ws.onclose = function(event) {
            //alert("disconnected!");
            if (!kicked) {}
        };
        ws.onerror = function(event) {
            //alert("error!");
            connectionError("Websocket Server disconnected");
            console.error(event);
        };
    }
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
        type: "command",
        command: "up"
    };
    ws.send(JSON.stringify(upjson));
}

function sendDown() {
    var downjson = {
        type: "command",
        command: "down"
    };
    ws.send(JSON.stringify(downjson));
}

function sendStop() {
    var stopjson = {
        type: "command",
        command: "stop"
    };
    ws.send(JSON.stringify(stopjson));
}

function connectionError(err) {
    document.getElementById("error").style.height = "100vh";
    document.getElementById("errortext").innerHTML += err;
}

(function(window, $) {

    $(function() {


        $('.ripple').on('click', function(event) {
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

            window.setTimeout(function() {
                $div.remove();
            }, 2000);
        });

    });

})(window, jQuery);