<?php
/*
 * Title:沉沦云快捷开发框架
 * Project:请求功能类
 * Author:流逝中沉沦
 * QQ：1178710004
*/

namespace Systems;

class Request
{
	/**
	 * 判断是否POST请求
	 */
	public static function isPost()
	{
		return $_SERVER['REQUEST_METHOD'] == 'POST' ? true : false;
	}
	/**
	 * 判断是否GET请求
	 */
	public static function isGet()
	{
		return $_SERVER['REQUEST_METHOD'] == 'GET' ? true : false;
	}
	/**
	 * 判断是否AJAX请求
	 */
	public static function isAjax()
	{
		if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * 获取GET POST表单数据
	 */
	public static function input($key = "", $default = "")
	{
		if (empty($key)) {
			return $_REQUEST;
		}
		if (isset($_REQUEST[$key])) {
			return $_REQUEST[$key];
		} else {
			if ($default) {
				return $default;
			}
			return null;
		}
	}
	/**
	 * 获取JSON表单数据
	 */
	public static function param($key = "")
	{
		$v = file_get_contents("php://input");
		$param = json_decode($v, true);
		if (!$param) {
			$param = array();
		}
		$param = array_merge(self::input(), $param);
		if (empty($key)) {
			return $param;
		}
		if (isset($param[$key])) {
			return $param[$key];
		} else {
			return null;
		}
	}
	/**
	 * 获取POST数据
	 */
	public static function post($key = "", $default = "")
	{
		if (empty($key)) {
			return $_POST;
		}
		if (isset($_POST[$key])) {
			return $_POST[$key];
		} else {
			if ($default) {
				return $default;
			}
			return null;
		}
	}
	/**
	 * 获取GET数据
	 */
	public static function get($key = "", $default = "")
	{
		if (empty($key)) {
			return $_GET;
		}
		if (isset($_GET[$key])) {
			return $_GET[$key];
		} else {
			if ($default) {
				return $default;
			}
			return null;
		}
	}
	/**
	 * 获取请求头
	 */
	public static function headers($k = null)
	{
		$headers = array();
		foreach ($_SERVER as $key => $value) {
			if ('HTTP_' == substr($key, 0, 5)) {
				$headers[str_replace('_', '-', substr($key, 5))] = $value;
			}
		}
		if (isset($_SERVER['PHP_AUTH_DIGEST'])) {
			$headers['Authorization'] = $_SERVER['PHP_AUTH_DIGEST'];
		} elseif (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
			$headers['Authorization'] = base64_encode($_SERVER['PHP_AUTH_USER'] . ':' . $_SERVER['PHP_AUTH_PW']);
		}
		if (isset($_SERVER['CONTENT_LENGTH'])) {
			$headers['CONTENT_LENGTH'] = $_SERVER['CONTENT_LENGTH'];
		}
		if (isset($_SERVER['CONTENT_TYPE'])) {
			$headers['CONTENT_TYPE'] = $_SERVER['CONTENT_TYPE'];
		}
		$k = strtoupper($k);
		if (isset($k) && isset($headers[$k])) {
			return $headers[$k];
		} else {
			return $headers;
		}
	}

	/**
	 * 获取请求地址
	 *
	 * @return void
	 */
	public static function url()
	{
		return (isset($_SERVER['HTTPS']) ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
	}

	/**
	 * 获取请求类型
	 *
	 * @return void
	 */
	public static function method()
	{
		return $_SERVER['REQUEST_METHOD'];
	}
}
