<?php
if (file_exists("../wsport.txt")) {
    $port = file_get_contents("../wsport.txt");
    echo $port;
} else {
    echo "";
}
?>