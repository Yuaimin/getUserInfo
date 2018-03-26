<?php

header("Content-type: text/html; charset=utf-8");

include_once "wxBizDataCrypt.php";

$appid = $_GET['appid'];
$sessionKey = $_GET['session_key'];

$encryptedData = $_GET['encryptedData'];

$iv = $_GET['iv'];

$pc = new WXBizDataCrypt($appid, $sessionKey);
$errCode = $pc->decryptData($encryptedData, $iv, $data );

if ($errCode == 0) {
    print($data . "\n");
} else {
    print($errCode . "\n");
}

?>
