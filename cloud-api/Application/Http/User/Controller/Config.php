<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\User\Controller;

use app\Constant\Config as Constant;
use app\Service\AuthService;
use app\Service\ConfigService;
use app\Service\SettingService;
use Systems\Request;

class Config extends Common
{
    /**
     * 获取支付配置
     *
     * @return void
     */
    public function getPay()
    {
        $config = ConfigService::getInstance();
        return $this->success('获取成功', array(
            Constant::SYSTEM_PAY_ALIPAY_TYPE => $config->get(Constant::SYSTEM_PAY_ALIPAY_TYPE) != '0', //支付宝通道是否打开
            Constant::SYSTEM_PAY_WXPAY_TYPE => $config->get(Constant::SYSTEM_PAY_WXPAY_TYPE) != '0', //微信通道是否打开
            Constant::SYSTEM_PAY_QQPAY_TYPE => $config->get(Constant::SYSTEM_PAY_QQPAY_TYPE) != '0', //QQ通道是否打开
            Constant::SYSTEM_PAY_MIN_MONEY => $config->get(Constant::SYSTEM_PAY_MIN_MONEY), //最低充值金额
        ));
    }

    /**
     * 获取提现配置
     *
     * @return void
     */
    public function getCash()
    {
        $config = ConfigService::getInstance();
        return $this->success('获取成功', array(
            Constant::SYSTEM_CASH_IS_OPEN => $config->get(Constant::SYSTEM_CASH_IS_OPEN) == 1, //是否开启提现
            Constant::SYSTEM_CASH_MIN_MONEY => $config->get(Constant::SYSTEM_CASH_MIN_MONEY), //最低提现金额
            Constant::SYSTEM_CASH_DEDUCT => $config->get(Constant::SYSTEM_CASH_DEDUCT), //提现费率
        ));
    }

    /**
     * 获取通知信息
     *
     * @return void
     */
    public function getNotice()
    {
        $data = $this->validate(array(
            array('type|类型', 'omitempty|in:m,p|default:m'),
        ), Request::param());
        $type = $data['type'] == 'p' ? 'web_id' : 'id';
        $web = AuthService::getInstance()->getCurrentWeb();
        $set = SettingService::getInstance();
        return $this->success('获取成功', array(
            Constant::WEB_NOTICE_INDEX => $set->getWeb($web[$type], Constant::WEB_NOTICE_INDEX),
            Constant::WEB_NOTICE_SHOP => $set->getWeb($web[$type], Constant::WEB_NOTICE_SHOP),
            Constant::WEB_NOTICE_ADMIN => $set->getWeb($web[$type], Constant::WEB_NOTICE_ADMIN),
        ));
    }

    /**
     * 获取客服信息
     *
     * @return void
     */
    public function getContact()
    {
        $web = AuthService::getInstance()->getCurrentWeb();
        $set = SettingService::getInstance();
        return $this->success('获取成功', array(
            Constant::WEB_CONTACT_ONE => $set->getWeb($web['id'], Constant::WEB_CONTACT_ONE),
            Constant::WEB_CONTACT_TWO => $set->getWeb($web['id'], Constant::WEB_CONTACT_TWO),
            Constant::WEB_CONTACT_THREE => $set->getWeb($web['id'], Constant::WEB_CONTACT_THREE),
            Constant::WEB_CONTACT_FOUR => $set->getWeb($web['id'], Constant::WEB_CONTACT_FOUR),
        ));
    }
}
