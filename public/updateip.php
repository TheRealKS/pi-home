<?php
    $ip = $_SERVER['REMOTE_ADDR'];
    file_put_contents("serverip.txt", $ip);
?>