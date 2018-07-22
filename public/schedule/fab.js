window.onload = function() {
    document.getElementById("fab").addEventListener("click", function() {
        document.getElementsByClassName("fab_icon")[0].classList.toggle("rotate");
        let elements = document.getElementsByClassName("action");
        for (var i = elements.length - 1; i >= 0; i--) {
            setTimeout(function() {elements[this].classList.toggle("action_expanded")}.bind(i), 50*i);
        }
    });
}