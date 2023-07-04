<?php
/*
 * Title:沉沦云MVC开发框架
 * Project:基础功能类
 * Author:流逝中沉沦
 * QQ：1178710004
*/

namespace Systems;

class Util
{
	/**
	 * 加密密码
	 *
	 * @param string $pwd 密码
	 * @param string $salt 盐
	 * @return void
	 */
	public static function getPassword($pwd = '123456', $salt = '')
	{
		return bin2hex(sha1(urlencode(base64_encode(md5($pwd . $salt)))));
	}

	/**
	 * 判断密码
	 *
	 * @param string $pwd 密码
	 * @param string $hash 密文
	 * @param string $salt 盐
	 * @return void
	 */
	public static function checkPassword($pwd = '123456', $hash = '', $salt = '')
	{
		return self::getPassword($pwd, $salt) == $hash;
	}

	/**
	 * 获取UUID
	 *
	 * @return void
	 */
	public static function getUuid()
	{
		$chars = md5(uniqid(mt_rand(), true));
		$uuid = substr($chars, 0, 8) . '-';
		$uuid .= substr($chars, 8, 4) . '-';
		$uuid .= substr($chars, 12, 4) . '-';
		$uuid .= substr($chars, 16, 4) . '-';
		$uuid .= substr($chars, 20, 12);
		return $uuid;
	}

	/**
	 * 获取随机数
	 *
	 * @param integer $length 随机数长度
	 * @param integer $numeric 是否为数字
	 * @return void
	 */
	public static function getRandom($length = 32, $numeric = 0)
	{
		$seed = base_convert(md5(microtime() . $_SERVER['DOCUMENT_ROOT']), 16, $numeric ? 10 : 35);
		$seed = $numeric ? (str_replace('0', '', $seed) . '012340567890') : ($seed . 'zZ' . strtoupper($seed));
		$hash = '';
		$max = strlen($seed) - 1;
		for ($i = 0; $i < $length; $i++) {
			$hash .= $seed[mt_rand(0, $max)];
		}
		return $hash;
	}

	/**
	 * 加密算法
	 *
	 * @param string $string 加密字符串
	 * @param string $operation 类型
	 * @param string $key 密匙
	 * @param integer $expiry 过期时间
	 * @return void
	 */
	public static function authcode($string, $operation = 'DECODE', $key = '', $expiry = 0)
	{
		$ckey_length = 4;
		$key = md5($key ? $key : '');
		$keya = md5(substr($key, 0, 16));
		$keyb = md5(substr($key, 16, 16));
		$keyc = $ckey_length ? ($operation == 'DECODE' ? substr($string, 0, $ckey_length) : substr(md5(microtime()), -$ckey_length)) : '';
		$cryptkey = $keya . md5($keya . $keyc);
		$key_length = strlen($cryptkey);
		$string = $operation == 'DECODE' ? base64_decode(substr($string, $ckey_length)) : sprintf('%010d', $expiry ? $expiry + time() : 0) . substr(md5($string . $keyb), 0, 16) . $string;
		$string_length = strlen($string);
		$result = '';
		$box = range(0, 255);
		$rndkey = array();
		for ($i = 0; $i <= 255; $i++) {
			$rndkey[$i] = ord($cryptkey[$i % $key_length]);
		}
		for ($j = $i = 0; $i < 256; $i++) {
			$j = ($j + $box[$i] + $rndkey[$i]) % 256;
			$tmp = $box[$i];
			$box[$i] = $box[$j];
			$box[$j] = $tmp;
		}
		for ($a = $j = $i = 0; $i < $string_length; $i++) {
			$a = ($a + 1) % 256;
			$j = ($j + $box[$a]) % 256;
			$tmp = $box[$a];
			$box[$a] = $box[$j];
			$box[$j] = $tmp;
			$result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
		}
		if ($operation == 'DECODE') {
			if ((substr($result, 0, 10) == 0 || substr($result, 0, 10) - time() > 0) && substr($result, 10, 16) == substr(md5(substr($result, 26) . $keyb), 0, 16)) {
				return substr($result, 26);
			} else {
				return '';
			}
		} else {
			return $keyc . str_replace('=', '', base64_encode($result));
		}
	}

	/**
	 * 获取访问者ID
	 *
	 * @return void
	 */
	public static function getIP()
	{
		$ip = $_SERVER['REMOTE_ADDR'];
		if (!Config::get('is_proxy')) {
			return $ip;
		}
		if (isset($_SERVER['HTTP_CF_CONNECTING_IP']) && preg_match('/^([0-9]{1,3}\.){3}[0-9]{1,3}$/', $_SERVER['HTTP_CF_CONNECTING_IP'])) {
			$ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
		} elseif (isset($_SERVER['HTTP_CLIENT_IP']) && preg_match('/^([0-9]{1,3}\.){3}[0-9]{1,3}$/', $_SERVER['HTTP_CLIENT_IP'])) {
			$ip = $_SERVER['HTTP_CLIENT_IP'];
		} elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && preg_match_all('#\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}#s', $_SERVER['HTTP_X_FORWARDED_FOR'],     $matches)) {
			foreach ($matches[0] as $xip) {
				if (!preg_match('#^(10|172\.16|192\.168)\.#', $xip)) {
					$ip = $xip;
					break;
				}
			}
		}
		return $ip;
	}

	/**
	 * 判断是否https
	 *
	 * @return boolean
	 */
	public static function isHttps()
	{
		if (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off') {
			return true;
		} elseif (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
			return true;
		} elseif (!empty($_SERVER['HTTP_FRONT_END_HTTPS']) && strtolower($_SERVER['HTTP_FRONT_END_HTTPS']) !== 'off') {
			return true;
		}
		return false;
	}

	/**
	 * 获取域名
	 *
	 * @param boolean $proto 是否携带协议
	 * @return void
	 */
	public static function getHost($proto = false)
	{
		$host = $_SERVER['HTTP_HOST'];
		if ($proto) {
			$host = (self::isHttps() ? 'https' : 'http') . '://' . $host;
		}
		return $host;
	}

	/**
	 * json_encode中文转码 兼容php54
	 *
	 * @param mixed $data 转码数据
	 * @return void
	 */
	public static function jsonEncode($data)
	{
		if (version_compare(PHP_VERSION, '5.4.0', '<')) {
			return preg_replace_callback("#\\\u([0-9a-f]{4})#i", function ($matchs) {
				return iconv('UCS-2BE', 'UTF-8', pack('H4', $matchs[1]));
			}, json_encode($data));
		} else {
			return json_encode($data, JSON_UNESCAPED_UNICODE);
		}
	}

	/**
	 * 判断是否win
	 *
	 * @return boolean
	 */
	public static function isWin()
	{
		return strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';
	}

	/**
	 * 二维数组排序
	 *
	 * @param [type] $arr 数组
	 * @param [type] $keys 排序键
	 * @param string $type 类型
	 * @return void
	 */
	public static function arraySort($arr, $keys, $type = 'asc')
	{
		$keysvalue = array();
		$new_array = array();
		foreach ($arr as $k => $v) {
			$keysvalue[$k] = $v[$keys];
		}
		if ($type == 'asc') {
			asort($keysvalue);
		} else {
			arsort($keysvalue);
		}
		reset($keysvalue);
		foreach ($keysvalue as $k => $v) {
			$new_array[$k] = $arr[$k];
		}
		return $new_array;
	}
}
