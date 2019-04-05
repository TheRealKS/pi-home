<?php
    $file_name = substr($_SERVER['PATH_INFO'], 1);
    if (file_exists($file_name) && !isset($_GET['overwrite'])) {
        echo "3";
        exit;
    }
    $nm = trim(file_get_contents('php://input'), '"');
    $time = time();
    $o = [
        "name" => $nm,
        "timecreated" => $time,
        "lastedited" => $time,
        "content" => array()
    ];
    if (file_put_contents($file_name, json_encode($o))) {
        echo "1";
    } else {
        echo "0";
    }
?>