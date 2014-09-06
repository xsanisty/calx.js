<?php

sleep(5);
$result = 0;
foreach ($_POST['params'] as $param) {
    $result += $param;
}

echo $result;