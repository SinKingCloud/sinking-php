<?php

namespace Plugins\Util;

class Uin
{
    /**
     * 获取QQ昵称
     *
     * @param integer $qq
     * @return void
     */
    public static function getNick($qq = 10001)
    {
        $urlPre = 'http://r.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?g_tk=1518561325&uins=';
        $data = file_get_contents($urlPre . $qq);
        $data = iconv("GB2312", "UTF-8", $data);
        $pattern = '/portraitCallBack\((.*)\)/is';
        preg_match($pattern, $data, $result);
        $result = $result[1];
        $arr = json_decode($result, true);
        $qqnickname = $arr["$qq"][6];
        return $qqnickname;
    }

    /**
     * 获取账号铭牌
     *
     * @param integer $uin 账号
     * @return void
     */
    public static function getNamePlate($uin = 10001)
    {
        $url = 'https://ti.qq.com/qqlevel/srf/getQQLevelAllInfo?bkn=683611393';
        $header = array('Cookie:uin=o' . $uin . '; skey=M7wuICMKpH; p_uin=o' . $uin . ';  p_skey=ivB5JdK2qz03OAvZvLSnUU-6wA9PkeVBN46*jypnR6A_');
        $arr = json_decode(self::curl($url, 1, $header));
        if (!$arr || !isset($arr['vipIcon'])) {
            return 'https://imgcache.gtimg.cn/vipstyle/component/img/nameplate/svip/lv/year-svip8-l2-on.png';
        }
        return $arr['vipIcon'];
    }

    /**
     * 获取账号信息
     *
     * @param integer $uin 账号
     * @return void
     */
    public static function getInfo($uin = 10001)
    {
        $url = 'https://ti.qq.com/qqlevel/srf/getQQLevelAllInfo?bkn=683611393';
        $header = array('Cookie:uin=o' . $uin . '; skey=M7wuICMKpH; p_uin=o' . $uin . ';  p_skey=ivB5JdK2qz03OAvZvLSnUU-6wA9PkeVBN46*jypnR6A_');
        $arr = json_decode(self::curl($url, 1, $header), true);
        if (!$arr || !isset($arr['data'])) {
            return false;
        }
        $data = $arr['data'];
        //会员图标
        $vip_icon = array();
        if ($data['iVip'] != 1 && $data['iSVip'] != 1 && $data['iBigClubVipFlag'] != 1) {
            $vip_icon[] = "https://imgcache.gtimg.cn/vipstyle/component/img/nameplate/vip/lv/vip1-l2-off.png";
        } else {
            if ($data['iVip'] == 1 || $data['iSVip'] == 1) {
                $name = 'vip';
                if ($data['iSVip'] == 1) {
                    $name = 'svip';
                }
                $year = '';
                if ($data['iYearVip'] == 1) {
                    $year = 'year-';
                }
                $level = $data['iVipLevel'];
                if ($level >= 10) {
                    $icon = 'https://qzonestyle.gtimg.cn/qzone/qzact/act/external/clubindex/qqvip/svip10/0-mp.png?nowebp&nosharpp&_bid=5065';
                } else {
                    $icon = 'https://imgcache.gtimg.cn/vipstyle/component/img/nameplate/' . $name . '/lv/' . $year . $name . $level . '-l2-on.png';
                }
                $vip_icon[] = $icon;
            }
            if ($data['iBigClubVipFlag'] == 1) {
                $vip_icon[] = 'https://qzonestyle.gtimg.cn/vipstyle/component/img/nameplate/bvip/lv/LV' . $data['iBigClubLevel'] . '.png';
            }
        }
        //等级图标
        $level_icon = array();
        $level = intval($data['iQQLevel']);
        $icon_arr = array(
            64 => 'https://imgcache.qq.com/xydata/qqVipLevel/item/3/crown.png',
            16 => 'https://imgcache.qq.com/xydata/qqVipLevel/item/3/sun.png',
            4 => 'https://imgcache.qq.com/xydata/qqVipLevel/item/3/moon.png',
            1 => 'https://imgcache.qq.com/xydata/qqVipLevel/item/3/star.png',
        );
        foreach ($icon_arr as $key => $value) {
            $num = intval(floor($level / $key));
            $level -= $num * $key;
            for ($i = 0; $i < $num; $i++) {
                $level_icon[] = $value;
            }
        }
        return array(
            'uin' => $uin, //账号
            'nick_name' => $data['sNickName'], //昵称
            'avatar' => $data['sFaceUrl'], //头像
            'level' => $data['iQQLevel'], //等级
            'total_active_day' => $data['iTotalActiveDay'], //总活跃天数
            'next_level_day' => $data['iNextLevelDay'], //距离下次升级所需活跃天数
            'is_vip' => $data['iVip'] == 1, //是否是会员
            'is_svip' => $data['iSVip'] == 1, //是否是超级会员
            'is_year_vip' => $data['iYearVip'] == 1, //是否是年费会员
            'is_big_vip' => $data['iBigClubVipFlag'] == 1, //是否是大会员
            'is_big_year_vip' => $data['iYearBigClubFlag'] == 1, //是否是年费大会员
            'vip_level' => $data['iVipLevel'], //会员等级
            'big_vip_level' => $data['iBigClubLevel'], //大会员等级
            'vip_icon' => $vip_icon,
            'level_icon' => $level_icon,
        );
    }

    /**
     * @description: 判断验证码
     * @param {*} $ticket
     * @param {*} $randstr
     * @return {*}
     */
    public static function checkTicket($ticket = "", $randstr = "")
    {
        $url = 'https://cgi.urlsec.qq.com/index.php?m=check&a=gw_check&callback=url_query&url=https%3A%2F%2Fwww.qq.com%2F' . rand(111111, 999999) . '&ticket=' . urlencode($ticket) . '&randstr=' . urlencode($randstr);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $httpheader = array();
        $httpheader[] = "Accept: application/json";
        $httpheader[] = "Accept-Language: zh-CN,zh;q=0.8";
        $httpheader[] = "Connection: close";
        curl_setopt($ch, CURLOPT_HTTPHEADER, $httpheader);
        curl_setopt($ch, CURLOPT_REFERER, 'https://urlsec.qq.com/check.html');
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $ret = curl_exec($ch);
        curl_close($ch);
        $arr = self::jsonpDecode($ret, true);
        if (isset($arr['reCode']) && $arr['reCode'] == -109) { //验证通过
            return false;
        }
        return true;
    }

    private static function jsonpDecode($jsonp, $assoc = false)
    {
        $jsonp = trim($jsonp);
        if (isset($jsonp[0]) && $jsonp[0] !== '[' && $jsonp[0] !== '{') {
            $begin = strpos($jsonp, '(');
            if (false !== $begin) {
                $end = strrpos($jsonp, ')');
                if (false !== $end) {
                    $jsonp = substr($jsonp, $begin + 1, $end - $begin - 1);
                }
            }
        }
        return json_decode($jsonp, $assoc);
    }

    private static function curl($url, $post = 0, $header = array())
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $clwl[] = "Content-Type: application/x-www-form-urlencoded; charset=UTF-8";
        $clwl[] = "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.66 Safari/537.36 Edg/103.0.1264.44";
        $clwl = array_merge($clwl, $header);
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
