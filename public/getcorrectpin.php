<?php
    if (isset($_GET["pin"])) {
        $upin = $_GET["pin"];
        $realpin = file_get_contents("../pin.txt");
        $upin = hash("sha512", $upin);
        $upin = strtoupper($upin);
        if ($realpin == $upin) {
            $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            $code = "";
            for ($i = 0; $i <= 10; $i++) {
                $r = mt_rand(0, 35);
                $code .= $chars[$r];
            }
            $expiry = time() + 86400;
            $newentry = [
                "code" => $code,
                "expires" => $expiry
            ];
            if (file_exists("../auth.json")) {
                $oldjson = file_get_contents("../auth.json");
                $oldjson = json_decode($oldjson);
                array_push($oldjson, $newentry);
                file_put_contents("../auth.json", json_encode($oldjson));
                echo $code;
            } else {
                $json = [];
                array_push($json, $newentry);
                file_put_contents("../auth.json", json_encode($json));
                echo $code;
            }
        } else {
            echo "0";
        }
    }
?>