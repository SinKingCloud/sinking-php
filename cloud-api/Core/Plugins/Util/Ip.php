<?php

namespace Plugins\Util;

class Ip
{
    /**
     * 获取IP省份
     *
     * @param String $ip
     * @return void
     */
    public static function getProvince($ip)
    {
        $url = "https://ip.taobao.com/outGetIpInfo?ip=" . $ip . "&accessKey=alibaba-inc";
        $res = file_get_contents($url);
        $data = json_decode($res, true);
        if (isset($data['code']) && $data['code'] == 0) {
            return $data['data']['region'];
        }
        return "获取失败";
    }
}
