<?php
    $uri = $_SERVER['REQUEST_URI'];
    if (strpos($uri, "getcorrectpin") !== false) {
        header("./pi-home/getcorrectpin.php");
    } else {
        echo("
            <html>
            <head>
            <title>Not found</title>
            </head>
            <body>
            <h1>404 Not found</h1>
            </body>
            </html>
        ");
    }
?>