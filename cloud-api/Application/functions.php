<?php

use Systems\Route;
use app\Exception\InstallException;
use Systems\Config;
use app\Constant\Config as Constant;
use app\Service\ConfigService;
use Systems\Cache;
use Systems\File;

if (!function_exists('url')) {
	function url($url = null)
	{
		if (!empty($url)) {
			if (substr($url, 0, 1) == '/') {
				return '/index.php' . $url;
			} else {
				$res = array_values(array_filter(explode("/", $_SERVER['REQUEST_URI'])));
				if (!isset($res[2])) {
					$res[2] = "index";
				}
				if ($res[0] == 'index.php') {
					$uri = '/' . $res[0] . '/' . $url;
				} else {
					$uri = str_replace($res[2], $url, '/' . $res[1] . '/' . $res[2]);
				}
				if (substr($uri, 0, 10) != '/index.php') {
					$uri = '/index.php' . substr($uri, 1);
				}
				if (!empty($uri)) {
					return $uri;
				} else {
					return $url;
				}
			}
		} else {
			return null;
		}
	}
}

/**
 * 判断系统是否安装
 *
 * @return void
 */
if (!function_exists('checkInstall')) {
	function checkInstall($thorw = true)
	{
		if ($thorw && Route::GetModule() == 'install') {
			return;
		}
		$file = APP_PATH . "/config.php";
		if (!File::exists($file)) {
			if ($thorw) {
				throw new InstallException('<a href="/index.php/install">系统未安装,请点击此处安装</a>');
			} else {
				return false;
			}
		} else {
			$config = require_once $file;
			Config::set(Constant::DATABASE, array_merge(Config::get(Constant::DATABASE), array(
				'database_host' => $config['database_host'],
				'database_port' =>  $config['database_port'],
				'database_user' =>  $config['database_user'],
				'database_pwd' =>  $config['database_pwd'],
				'database_name' =>  $config['database_name'],
				'database_prefix' =>  $config['database_prefix'],
			)));
			return true;
		}
	}
}

/**
 * 判断系统是否授权
 *
 * @return void
 */
if (!function_exists('checkAuth')) {
	function checkAuth()
	{
		if (Route::GetModule() == 'install') {
			return;
		}
		$auth = Config::get(Constant::AUTH);
		$r = Cache::remember(md5("auth_" . $auth['code']), function () use ($auth) {
			$param = array('code' => $auth['code'], 'domain' => $auth['domain']);
			$config = ConfigService::getInstance();
			$ins = \Plugins\SinKingCloud\App::getInstance()->setAppId($config->get(Constant::SYSTEM_CLOUD_ID))->setAppKey($config->get(Constant::SYSTEM_CLOUD_KEY));
			$arr = $ins->getAuthInfo($param);
			if ($arr && isset($arr['code']) && $arr['code'] == 200) {
				return true;
			}
			return false;
		}, 3600 * 3);
		if (!$r) {
			throw new Systems\Exception('系统未授权,请前往官网获取');
		}
	}
}
