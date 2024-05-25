<?php
/*
* Title:沉沦云MVC开发框架
* Project:首页控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Index\Controller;

use app\Constant\Config;
use app\Service\AuthService;
use app\Service\DomainService;
use app\Service\SettingService;
use Plugins\Util\Domain;
use Systems\Request;
use Systems\Util;

class Index extends Common
{
	public function index()
	{
		$web = AuthService::getInstance()->getCurrentWeb();
		$this->assign('web', $web);
		$this->assign('domain', DomainService::getInstance()->getIcp(Util::getHost()));
		$param = Request::param();
		if (isset($param['s']) || isset($param['s/'])) {
			return $this->fetch('web');
		}
		$index = SettingService::getInstance()->getWeb($web['id'], Config::WEB_UI_INDEX);
		return $this->fetch($index ? $index : 'index');
	}
}
