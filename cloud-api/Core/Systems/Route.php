<?php
/*
* Title:沉沦云MVC开发框架
* Project:路由配置
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace Systems;

use Systems\Errors;

class Route
{
	private static  $Config;
	private static  $Routes = array();
	private static  $Module; //模块变量
	private static  $Controller; //控制器变量
	private static  $Action; //方法变量
	private static  $Value; //方法参数
	//初始化操作(获取完整url)
	public static function Init($config)
	{
		self::$Config = $config;
		self::LoadFile();
		if (self::$Config['default_route']['open']) {
			$url = self::GetRoutes(self::$Routes);
		} else {
			$url = self::GetUrls();
		}
		$url = self::ReSet($url);
		$temp_arr1 = explode(".", $url[0]);
		self::$Module = $temp_arr1[0];
		$temp_arr2 = explode(".", ucfirst($url[1]));
		self::$Controller = $temp_arr2[0];
		$temp_arr3 = explode(".", $url[2]);
		self::$Action = $temp_arr3[0];
		self::$Value = array();
		if (self::$Config['multi_app']['open']) {
			$host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
			if ($host && self::$Config['multi_app']['multi_site']['open']) {
				$sites = self::$Config['multi_app']['multi_site']['sites'];
				//存在kv直接返回,否则走正则
				if (isset($sites[$host])) {
					self::$Action = self::$Controller;
					self::$Controller = self::$Module;
					self::$Module = $sites[$host];
				} else {
					foreach ($sites as $key => $value) {
						if (preg_match($key, $host)) {
							self::$Action = self::$Controller;
							self::$Controller = self::$Module;
							self::$Module = $value;
							break;
						}
					}
				}
			}
		}
		foreach ($url as $key => $value) {
			if ($key >= 3) {
				self::$Value[] = $value;
			}
		}
	}
	public static function rewrite($name, $value)
	{
		try {
			self::$Routes[$name] = $value;
		} catch (\Throwable $th) {
			Errors::show($th);
		}
	}
	private static function ReSet($url)
	{
		array_shift($url);
		if (empty($url[0])) {
			$url[0] = self::$Config["controller"]["default_module"];
		}
		if (empty($url[1])) {
			$url[1] = self::$Config["controller"]["default_controller"];
		}
		if (empty($url[2])) {
			$url[2] = self::$Config["controller"]["default_action"];
		}
		return $url;
	}
	//应用/控制器/方法
	private static function GetRoutes($routes = array())
	{
		$temp = explode("?", self::GetPath());
		$url = $temp[0];
		if ($url == "/") {
			return explode('/', $url);
		}
		$temp = explode('.', $url);
		$url = $temp[0];
		if (array_key_exists($url, $routes)) {
			$urls = $routes[$url];
			return explode('/', $urls);
		} else {
			if (self::$Config['default_route']['force']) {
				Errors::show("路由未定义");
			} else {
				return self::GetUrls();
			}
		}
	}
	private static function LoadFile()
	{
		if (!empty(self::$Config['default_route']['file'])) {
			if (is_array(self::$Config['default_route']['file'])) {
				foreach (self::$Config['default_route']['file'] as $key) {
					if (file_exists(APP_PATH . $key)) {
						require_once(APP_PATH . $key);
					}
				}
			} else {
				if (file_exists(APP_PATH . self::$Config['default_route']['file'])) {
					require_once(APP_PATH . self::$Config['default_route']['file']);
				}
			}
		}
	}
	private static function GetPath()
	{
		$path = $_SERVER['REQUEST_URI'];
		if ($path != "/") {
			if (substr($path, 0, 10) == '/index.php') {
				return substr($path, 10);
			}
		}
		return $path;
	}
	private static function GetUrls()
	{
		$arr =  explode("?", self::GetPath());
		return explode("/", $arr[0]);
	}
	public static function GetModule()
	{
		return self::$Module;
	}
	public static function GetController()
	{
		return self::$Controller;
	}
	public static function GetAction()
	{
		return self::$Action;
	}
	public static function GetValue()
	{
		return self::$Value;
	}
}
