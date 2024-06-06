<?php

namespace Plugins\Aliyun;

class Sms
{
    private $AccessKeyId; //阿里云AccessKeyId
    private $AccessKeySecret; //阿里云AccessKeySecret
    private $TemplateName; //模板签名
    private $TemplateNameCode; //模版code

    /**
     * 构造参数
     * @param string $AccessKeyId 阿里云AccessKeyId
     * @param string $AccessKeySecret 阿里云AccessKeySecret
     * @param string $TemplateName 模板签名
     * @param string $TemplateNameCode 模版code
     * @return object
     */
    public function __construct($AccessKeyId, $AccessKeySecret, $TemplateName, $TemplateNameCode)
    {
        $this->AccessKeyId = $AccessKeyId;
        $this->AccessKeySecret = $AccessKeySecret;
        $this->TemplateName = $TemplateName;
        $this->TemplateNameCode = $TemplateNameCode;
    }

    /**
     * 发送短信(单条)
     * 
     * @param string $phone 手机号
     * @param array $code 模板参数
     * @param array $other 其他参数
     * @return array
     */
    public function send($phone, $code = array(), $other = array('OutId' => null, 'SmsUpExtendCode' => null))
    {
        if (!preg_match("/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}\$/", $phone)) {
            return array('code' => 500, 'msg' => '手机格式不正确');
        }
        $params = array();
        $params["PhoneNumbers"] = $phone;
        $params["SignName"] = $this->TemplateName;
        $params["TemplateCode"] = $this->TemplateNameCode;
        $params['TemplateParam'] = $code;
        $params['OutId'] = $other['OutId'];
        $params['SmsUpExtendCode'] = $other['SmsUpExtendCode'];
        if (!empty($params["TemplateParam"]) && is_array($params["TemplateParam"])) {
            $params["TemplateParam"] = json_encode($params["TemplateParam"]);
        }
        $res = $this->request($this->AccessKeyId, $this->AccessKeySecret, "dysmsapi.aliyuncs.com", array_merge($params, array("RegionId" => "cn-hangzhou", "Action" => "SendSms", "Version" => "2017-05-25")));
        if ($res['Message'] == 'OK') {
            return array('code' => 200, 'msg' => '短信发送成功');
        } else {
            return array('code' => 500, 'msg' => $res['Message']);
        }
    }

    private function request($accessKeyId, $accessKeySecret, $domain, $params, $security = false)
    {
        $apiParams = array_merge(array("SignatureMethod" => "HMAC-SHA1", "SignatureNonce" => uniqid(mt_rand(0, 0xffff), true), "SignatureVersion" => "1.0", "AccessKeyId" => $accessKeyId, "Timestamp" => gmdate("Y-m-d\\TH:i:s\\Z"), "Format" => "JSON"), $params);
        ksort($apiParams);
        $sortedQueryStringTmp = "";
        foreach ($apiParams as $key => $value) {
            $sortedQueryStringTmp .= "&" . $this->encode($key) . "=" . $this->encode($value);
        }
        $stringToSign = "GET&%2F&" . $this->encode(substr($sortedQueryStringTmp, 1));
        $sign = base64_encode(hash_hmac("sha1", $stringToSign, $accessKeySecret . "&", true));
        $signature = $this->encode($sign);
        $url = ($security ? 'https' : 'http') . "://{$domain}/?Signature={$signature}{$sortedQueryStringTmp}";
        try {
            $content = $this->fetchContent($url);
            return $this->object_array(json_decode($content));
        } catch (\Exception $e) {
            return false;
        }
    }

    private function object_array($array)
    {
        if (is_object($array)) {
            $array = (array) $array;
        }
        if (is_array($array)) {
            foreach ($array as $key => $value) {
                $array[$key] = $this->object_array($value);
            }
        }
        return $array;
    }

    private function encode($str)
    {
        $res = urlencode($str);
        $res = preg_replace("/\\+/", "%20", $res);
        $res = preg_replace("/\\*/", "%2A", $res);
        $res = preg_replace("/%7E/", "~", $res);
        return $res;
    }

    private function fetchContent($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("x-sdk-client" => "php/2.0.0"));
        if (substr($url, 0, 5) == 'https') {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        }
        $rtn = curl_exec($ch);
        curl_close($ch);
        return $rtn;
    }
}
