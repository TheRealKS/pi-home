<?php
if (file_exists("./serverip.txt")) {
    $port = file_get_contents("./serverip.txt");
    echo $port;
} else {
    echo "";
}
?>