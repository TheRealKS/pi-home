<?php
    header("Access-Control-Allow-Origin: https://kimas.dev");
    if (isset($_GET["pin"])) {
        $upin = $_GET["pin"];
        $upin = json_decode($upin);
        $realpin = file_get_contents("./pin.txt");
        $realpin = json_decode($realpin);
        if ($realpin->part1 == $upin->part1 && $realpin->part2 == $upin->part2) {
            $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            $code = "";
            for ($i = 0; $i <= 10; $i++) {
                $r = mt_rand(0, 35);
                $code .= $chars[$r];
            }
            $expiry = time() * 1000 + 3600000;
            $newentry = [
                "token" => $code,
                "expiry" => $expiry
            ];
            if (file_exists("./auth.json")) {
                $oldjson = file_get_contents("./auth.json");
                if ($oldjson == "") {
                    $oldjson = [];
                }
                $oldjson = json_decode($oldjson);
                array_push($oldjson, $newentry);
                file_put_contents("./auth.json", json_encode($oldjson));
                echo $code;
            } else {
                $json = [];
                array_push($json, $newentry);
                file_put_contents("./auth.json", json_encode($json));
                echo $code;
            }
        } else {
            echo "0";
        }
    }
?>