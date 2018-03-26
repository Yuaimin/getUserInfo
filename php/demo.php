<?php

header("Content-type: text/html; charset=utf-8");
// 指定允许其他域名访问  
header('Access-Control-Allow-Origin:*');
// 响应类型  
header('Access-Control-Allow-Methods:POST');
// 响应头设置  
header('Access-Control-Allow-Headers:x-requested-with,content-type');

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