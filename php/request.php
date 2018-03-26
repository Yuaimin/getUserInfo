<?php
  header("Content-type: text/html; charset=utf-8");

  $code = $_POST['code'];
  $appId = "wx2ad14ddf0b77b56c";
  $appSecret = "83d8311fb4beddcc5cd80c1c5d0e7207";
  $url = "https://api.weixin.qq.com/sns/jscode2session?appid=" . $appId . "&secret=" . $appSecret . "&js_code=" . $code . "&grant_type=authorization_code";
  function get($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //不验证证书
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    $content = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($status == 404) {
      return "404";
    }
    curl_close($ch);
    return $content;
  }
  $res = get($url);
  print($res);

?>