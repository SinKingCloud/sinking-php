<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Auth\Controller;

use app\Constant\Config;
use app\Service\AuthService;
use app\Service\ConfigService;
use app\Service\DomainService;
use app\Service\SettingService;
use Systems\Util;

class Web extends Common
{
    /**
     * 站点信息
     *
     * @retu rn void
     */
    public function info()
    {
        $web = AuthService::getInstance()->getCurrentWeb();
        $domain = DomainService::getInstance()->getIcp(Util::getHost());
        $set = SettingService::getInstance();
        $config = ConfigService::getInstance();
        $layout = $set->getWeb($web['id'], Config::WEB_UI_LAYOUT);
        $theme = $set->getWeb($web['id'], Config::WEB_UI_THEME);
        $compact = $set->getWeb($web['id'], Config::WEB_UI_COMPACT);
        return $this->success('获取成功', array(
            'id' => $web['id'],
            'name' => $web['name'],
            'title' => $web['title'],
            'keywords' => $web['keywords'],
            'description' => $web['description'],
            'expire_time' => $web['expire_time'],
            'domain' => Util::getHost(),
            'service_licence' => $domain['service_licence'],
            'logo' => $set->getWeb($web['id'], Config::WEB_UI_LOGO),
            'water_mark' => $set->getWeb($web['id'], Config::WEB_UI_WATERMARK) == 1,
            'layout' => $layout == 'left' ? 'left' : 'top',
            'theme' => $theme == 'dark' ? 'dark' : 'light',
            'compact' => $compact == 1,
            'reg_email' => $config->get(Config::SYSTEM_REG_EMAIL) == 1,
            'reg_qrlogin' => $config->get(Config::SYSTEM_REG_QRLOGIN) == 1,
            'reg_phone' => $config->get(Config::SYSTEM_REG_PHONE) == 1
        ));
    }
}
