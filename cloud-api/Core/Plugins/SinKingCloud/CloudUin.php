<?php

namespace SinKingCloud;

class CloudUin extends Client
{

    public function getServers()
    {
        $data = $this->request("/open/api/uin/servers")->getResponseData();
        return $data;
    }

    public function buy($uin, $type, $month, $pwd = "", $server_key = "")
    {
        $param = array(
            'uin' => (string)$uin,
            "type" => (int)$type,
            "month" => (int)$month,
            "pwd" => (string)$pwd,
            'server_key' => (string)$server_key,
        );
        $data = $this->request("/open/api/uin/buy", $param)->getResponse();
        if ($data['code'] == 200) {
            return true;
        }
        return false;
    }

    public function changeSetting($uin, $type, $status)
    {
        $param = array(
            'uin' => (string)$uin,
            "setting" => array($type => (string)($status ? "1" : "0")),
        );
        $data = $this->request("/open/api/uin/operate/setting", $param)->getResponse();
        if ($data['code'] == 200) {
            return true;
        }
        return false;
    }

    public function changeServer($uin, $server_key)
    {
        $param = array(
            'uin' => (string)$uin,
            "server_key" => $server_key,
        );
        $data = $this->request("/open/api/uin/operate/server", $param)->getResponse();
        if ($data['code'] == 200) {
            return true;
        }
        return false;
    }

    public function changeTiming($uin, $timing)
    {
        $param = array(
            'uin' => (string)$uin,
            "timing" => (int)$timing,
        );
        $data = $this->request("/open/api/uin/operate/timing", $param)->getResponse();
        if ($data['code'] == 200) {
            return true;
        }
        return false;
    }

    public function changePassword($uin, $pwd)
    {
        $param = array(
            'uin' => (string)$uin,
            "pwd" => (string)$pwd,
        );
        $data = $this->request("/open/api/uin/operate/password", $param)->getResponse();
        if ($data['code'] == 200) {
            return true;
        }
        return false;
    }

    public function changePhone($uin, $phone)
    {
        $param = array(
            'uin' => (string)$uin,
            "phone" => (string)$phone,
        );
        $data = $this->request("/open/api/uin/operate/phone", $param)->getResponse();
        if ($data['code'] == 200) {
            return true;
        }
        return false;
    }

    public function run($uin)
    {
        $param = array(
            'uin' => (string)$uin,
        );
        $data = $this->request("/open/api/uin/operate/run", $param)->getResponse();
        if ($data['code'] == 200) {
            return true;
        }
        return false;
    }

    public function login($uin, $login_type = 'pwd', $step = 'normal', $ticket = '', $rand = '')
    {
        $param = array(
            'uin' => (string)$uin,
            "login_type" => (string)$login_type,
            "step" => (string)$step,
            "ticket" => (string)$ticket,
            "rand" => (string)$rand,
        );
        return $this->request("/open/api/uin/operate/login", $param)->getResponse();
    }
}
