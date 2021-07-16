<?php
    $schedules = scandir('./schedules');
    $or = [];
    foreach ($schedules as $key => $value) {
        if ($value != "." && $value != "..") {
            $schedule = json_decode(file_get_contents("./schedules/" . $value));
            array_push($or, ["name" => $schedule->name, "lastedited" => $schedule->lastedited]);
        }
    }
    echo(json_encode($or));
?>