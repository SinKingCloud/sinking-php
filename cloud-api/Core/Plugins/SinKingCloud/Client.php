<?php

namespace Plugins\SinKingCloud;

class Client
{
    public static $instance = array(); //单例

    public static function getInstance()
    {
        $name =  get_called_class();
        if (!isset(self::$instance[$name])) {
            self::$instance[$name] = new $name();
        }
        return self::$instance[$name];
    }

    protected $gateway = "http://gateway.clwl.online"; //网关地址2

    protected $app_id = 1; //应用ID

    protected $app_key = ''; //应用密匙

    private $response = array(); //响应信息

    public function setGateway($gateway)
    {
        $this->gateway = $gateway;
        return $this;
    }

    public function setAppId($app_id)
    {
        $this->app_id = $app_id;
        return $this;
    }

    public function setAppKey($app_key)
    {
        $this->app_key = $app_key;
        return $this;
    }

    protected function request($url, $data = array())
    {
        if (empty($data)) {
            $post = 0;
        } else {
            $post = json_encode($data);
        }
        $this->response = $this->curl($this->gateway . $url, $post);
        return $this;
    }

    public function getResponse()
    {
        return $this->response;
    }

    public function getResponseData()
    {
        if (isset($this->response['data'])) {
            return $this->response['data'];
        }
        return array();
    }

    public function getResponseCode()
    {
        if (isset($this->response['code'])) {
            return $this->response['code'];
        }
        return 500;
    }

    public function getResponseMessage()
    {
        if (isset($this->response['message'])) {
            return $this->response['message'];
        }
        return "请求失败";
    }

    public function getResponseId()
    {
        if (isset($this->response['request_id'])) {
            return $this->response['request_id'];
        }
        return "";
    }

    protected function curl($url, $post = 0)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 600);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $clwl = array();
        $clwl[] = "app-id:" . $this->app_id;
        $clwl[] = "app-key:" . $this->app_key;
        curl_setopt($ch, CURLOPT_HTTPHEADER, $clwl);
        if ($post) {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        }
        curl_setopt($ch, CURLOPT_ENCODING, "gzip");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $ret = curl_exec($ch);
        curl_close($ch);
        return json_decode($ret, true);
    }
}
