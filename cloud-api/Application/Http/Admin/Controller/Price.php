<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Admin\Controller;

use app\Constant\Config as Constant;
use app\Model\Log;
use app\Service\AuthService;
use app\Service\ConfigService;
use app\Service\LogService;
use app\Service\SettingService;
use Systems\Request;

class Price extends Common
{
    /**
     * 获取成本价格
     *
     * @return void
     */
    public function my()
    {
        $config = ConfigService::getInstance();
        return $this->success('获取成功', array(
            Constant::SYSTEM_SITE_COST_PRICE => $config->get(Constant::SYSTEM_SITE_COST_PRICE),
            Constant::SYSTEM_SITE_MIN_PRICE => $config->get(Constant::SYSTEM_SITE_MIN_PRICE),
            Constant::SYSTEM_SITE_MONTH => $config->get(Constant::SYSTEM_SITE_MONTH) > 0 ? $config->get(Constant::SYSTEM_SITE_MONTH) : 999,
        ));
    }

    /**
     * 获取分站价格
     *
     * @return void
     */
    public function getWeb()
    {
        $web = AuthService::getInstance()->getCurrentWeb();
        $set = SettingService::getInstance();
        return $this->success('获取成功', array(
            Constant::WEB_SITE_PRICE => $set->getWeb($web['id'], Constant::WEB_SITE_PRICE),
        ));
    }


    /**
     * 设置网站价格
     *
     * @return void
     */
    public function setWeb()
    {
        $config = ConfigService::getInstance();
        $data = $this->validate(array(
            array(Constant::WEB_SITE_PRICE . '|分站售价', 'require|number|min:' . $config->get(Constant::SYSTEM_SITE_MIN_PRICE)),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        if (SettingService::getInstance()->setWeb($web['id'], Constant::WEB_SITE_PRICE, round($data[Constant::WEB_SITE_PRICE], 2))) {
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改价格', '修改分站价格');
            return $this->success('修改成功');
        }
        return $this->error('修改失败');
    }
}
