<?php
/*
 * Title:沉沦云MVC开发框架
 * Project:基础功能类
 * Author:流逝中沉沦
 * QQ：1178710004
*/

namespace Systems;

use Systems\View;
use Systems\Route;

class Controller extends View
{
	protected $config;

	protected $module;

	protected $controller;

	protected $action;

	protected $app_path;

	public function __construct()
	{
		$this->config = require(__DIR__ . "//../Config/Config.php");
		$this->module = Route::GetModule();
		$this->controller = Route::GetController();
		$this->action = Route::GetAction();
		$this->app_path = defined('APP_PATH') ? APP_PATH : $this->config['application_dir'];
	}

	/**
	 * 构造参数
	 *
	 * @param array $rules 规则验证
	 * @param array $data 验证数据
	 * @return void
	 */
	protected function validate($rules = array(), $data = array())
	{
		$vali = new Validate($rules);
		if (!$vali->validate($data)) {
			throw new Exception($vali->getError(), 500);
		}
		return $data;
	}
}
