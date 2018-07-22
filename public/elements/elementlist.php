<?php
    $dir = scandir(getcwd());
    $dirclean = [];
    foreach ($dir as $key => $value) {
        if ($value == "." || $value == "..") {
            continue;
        }
        $parts = explode(".", $value);
        if ($parts[1] != "html") {
            continue;
        }
        array_push($dirclean, $value);
    }
    echo json_encode($dirclean);
?>