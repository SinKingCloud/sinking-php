<?php

namespace Plugins\Util;

class Domain
{
    /**
     * 获取域名备案信息
     *
     * @param String $domain 域名
     * @return void
     */
    public static function getIcp($domain)
    {
        $domain = self::getTop($domain);
        $urls = array(
            'http://beian.yudinet.com/Account/QueryRecordStatus',
            'http://beian.lnicp.com/Account/QueryRecordStatus',
        );
        $res = self::curl($urls[array_rand($urls)], 'queryType=0&queryContent=' . $domain);
        if (!$res) {
            return false;
        }
        if (strpos($res, '已备案') !== false) {
            preg_match_all("!<td>(.*?)</td>!is", $res, $arr);
            $replace = array(' ', "\n", "\t");
            return array(
                'domain' => $domain,
                'name' => trim(str_replace($replace, '', $arr[1][0])),
                'main_licence' => trim(str_replace($replace, '', $arr[1][1])),
                'service_licence' => trim(str_replace($replace, '', $arr[1][2])),
                'status' => 1,
            );
        } else {
            return array(
                'domain' => $domain,
                'name' => '',
                'main_licence' => '',
                'service_licence' => '',
                'status' => 0,
            );
        }
    }

    /**
     * 获取顶级域名
     *
     * @param [type] $host
     * @return void
     */
    public static function getTop($url)
    {
        $host = strtolower($url);
        if (strpos($host, '/') !== false) {
            $parse = @parse_url($host);
            $host = $parse['host'];
        }
        $topLevelDomainDB = array('com', 'edu', 'gov', 'int', 'mil', 'net', 'org', 'biz', 'info', 'pro', 'name', 'museum', 'coop', 'aero', 'xxx', 'idv', 'mobi', 'cc', 'me');
        $str = '';
        foreach ($topLevelDomainDB as $v) {
            $str .= ($str ? '|' : '') . $v;
        }

        $matchStr = "[^\.]+\.(?:(" . $str . ")|\w{2}|((" . $str . ")\.\w{2}))$";
        if (preg_match("/" . $matchStr . "/", $host, $match_arr)) {
            $domain = $match_arr['0'];
        } else {
            $domain = $host;
        }
        return $domain;
    }

    private static function curl($url, $post = 0)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $clwl[] = "Content-Type: application/x-www-form-urlencoded; charset=UTF-8";
        $clwl[] = "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.66 Safari/537.36 Edg/103.0.1264.44";
        $clwl[] = "X-Requested-With: XMLHttpRequest";
        curl_setopt($ch, CURLOPT_HTTPHEADER, $clwl);
        if ($post) {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        }
        curl_setopt($ch, CURLOPT_ENCODING, "gzip");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $ret = curl_exec($ch);
        curl_close($ch);
        return $ret;
    }
}
