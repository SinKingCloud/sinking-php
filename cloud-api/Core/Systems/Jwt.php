<?php
/*
 * Title:沉沦云MVC开发框架
 * Project:Jwt功能类
 * Author:流逝中沉沦
 * QQ：1178710004
*/

namespace Systems;

class Jwt
{
    //头部
    private static $header = array(
        'alg' => 'md5', //生成signature的算法
    );

    /**
     * 获取加密key
     *
     * @return void
     */
    private static function getKey()
    {
        $conf = Config::get('jwt');
        return $conf['key'];
    }

    /**
     * 获取过期时间
     *
     * @return void
     */
    private static function getExpireTime()
    {
        $conf = Config::get('jwt');
        return time() + $conf['expire_time'];
    }

    /**
     * 获取jwt token
     * @param array $payload jwt载荷   格式如下非必须
     * [
     *  'iss'=>'jwt_admin',  //该JWT的签发者
     *  'iat'=>time(),  //签发时间
     *  'expire'=>time()+7200,  //过期时间
     *  'nbf'=>time()+60,  //该时间之前不接收处理该Token
     * ]
     * @return bool|string
     */
    public static function genToken($payload, $key = '')
    {
        if (!$key) {
            $key = self::getKey();
        }
        if (is_array($payload)) {
            if (!isset($payload['expire'])) {
                $payload['expire'] = self::getExpireTime();
            }
            $base64header = self::base64UrlEncode(json_encode(self::$header));
            $base64payload = self::base64UrlEncode(json_encode($payload));
            $token = $base64header . '.' . $base64payload . '.' . self::signature($base64header . '.' . $base64payload, $key, self::$header['alg']);
            return $token;
        } else {
            return false;
        }
    }

    /**
     * 验证token是否有效,默认验证exp,nbf,iat时间
     * @param string $Token 需要验证的token
     * @return bool|string
     */
    public static function verifyToken($Token, $key = '')
    {
        if (!$key) {
            $key = self::getKey();
        }
        $tokens = explode('.', $Token);
        if (count($tokens) != 3) return false;
        list($base64header, $base64payload, $sign) = $tokens;
        //获取jwt算法
        $base64decodeheader = json_decode(self::base64UrlDecode($base64header), true);
        if (empty($base64decodeheader['alg'])) return false;
        //签名验证
        if (self::signature($base64header . '.' . $base64payload, $key, $base64decodeheader['alg']) !== $sign) return false;
        $payload = json_decode(self::base64UrlDecode($base64payload), true);
        //签发时间大于当前服务器时间验证失败
        if (isset($payload['iat']) && $payload['iat'] > time()) return false;
        //过期时间小于当前服务器时间验证失败
        if (isset($payload['expire']) && $payload['expire'] < time()) return false;
        //该nbf时间之前不接收处理该Token
        if (isset($payload['nbf']) && $payload['nbf'] > time()) return false;
        return $payload;
    }

    /**
     * base64UrlEncode   https://jwt.io/  中base64UrlEncode编码实现
     * @param string $input 需要编码的字符串
     * @return string
     */
    private static function base64UrlEncode($input)
    {
        return str_replace('=', '', strtr(base64_encode($input), '+/', '-_'));
    }

    /**
     * base64UrlEncode  https://jwt.io/  中base64UrlEncode解码实现
     * @param string $input 需要解码的字符串
     * @return bool|string
     */
    private static function base64UrlDecode($input)
    {
        $remainder = strlen($input) % 4;
        if ($remainder) {
            $addlen = 4 - $remainder;
            $input .= str_repeat('=', $addlen);
        }
        return base64_decode(strtr($input, '-_', '+/'));
    }

    /**
     * HMACSHA256签名   https://jwt.io/  中HMACSHA256签名实现
     * @param string $input 为base64UrlEncode(header).".".base64UrlEncode(payload)
     * @param string $key
     * @param string $alg 算法方式
     * @return mixed
     */
    private static function signature($input, $key, $alg = 'SHA256')
    {
        return self::base64UrlEncode(hash_hmac($alg, $input, $key, true));
    }
}
