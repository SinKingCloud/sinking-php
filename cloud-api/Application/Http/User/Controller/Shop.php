<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\User\Controller;

use app\Constant\Config as Constant;
use app\Model\Order;
use app\Service\AuthService;
use app\Service\ConfigService;
use app\Service\DomainService;
use app\Service\OrderService;
use app\Service\SettingService;
use app\Service\WebService;
use Systems\Request;

class Shop extends Common
{
    /**
     * 获取站点详情
     *
     * @return void
     */
    public function getSite()
    {
        $web = AuthService::getInstance()->getCurrentWeb();
        $config = ConfigService::getInstance();
        $set = SettingService::getInstance();
        $web_price = $set->getWeb($web['id'], Constant::WEB_SITE_PRICE);
        $min_price = round($config->get(Constant::SYSTEM_SITE_MIN_PRICE), 2);
        return $this->success('获取成功', array(
            Constant::WEB_SITE_PRICE => $web_price < $min_price ? $min_price : $web_price,
            Constant::WEB_CONTACT_ONE => $set->getWeb($web['id'], Constant::WEB_CONTACT_ONE),
            Constant::SYSTEM_DOMAINS => explode('|', $config->get(Constant::SYSTEM_DOMAINS)),
            Constant::SYSTEM_DOMAIN_NUM => intval($config->get(Constant::SYSTEM_DOMAIN_NUM)),
            Constant::SYSTEM_SITE_COST_PRICE => round($config->get(Constant::SYSTEM_SITE_COST_PRICE), 2),
            Constant::SYSTEM_SITE_MONTH => intval($config->get(Constant::SYSTEM_SITE_MONTH)) > 0 ? intval($config->get(Constant::SYSTEM_SITE_MONTH)) : 999,
            Constant::SYSTEM_SITE_MIN_PRICE => round($config->get(Constant::SYSTEM_SITE_MIN_PRICE), 2),
            Constant::SYSTEM_SITE_RECHARGE_DEDUCT => intval($config->get(Constant::SYSTEM_SITE_RECHARGE_DEDUCT)),
            Constant::SYSTEM_SITE_ORDER_DEDUCT => intval($config->get(Constant::SYSTEM_SITE_ORDER_DEDUCT)),
        ));
    }

    /**
     * 购买站点
     *
     * @return void
     */
    public function buySite()
    {
        //获取信息
        $config = ConfigService::getInstance();
        $data = $this->validate(array(
            array('type|支付方式', 'require|number|in:0,1,2,3|default:0'),
            array('name|标题', 'require|length_between:1,8'),
            array('prefix|域名前缀', 'require|regex:/^[A-Za-z0-9_]{1,20}$/|length_between:1,20'),
            array('domain|域名', 'require|in:' . implode(',', explode('|', $config->get(Constant::SYSTEM_DOMAINS)))),
        ), Request::param());
        $data['domain'] = $data['prefix'] . '.' . $data['domain'];
        if (DomainService::getInstance()->checkBlack($data['domain'])) {
            return $this->error('该域名不可使用');
        }

        $user = AuthService::getInstance()->getCurrentUser(); //用户信息
        $web = AuthService::getInstance()->getCurrentWeb(); //站点信息
        $price = abs(round(SettingService::getInstance()->getWeb($web['id'], Constant::WEB_SITE_PRICE), 2)); //售价

        //判断最低售价
        if ($price < round($config->get(Constant::SYSTEM_SITE_MIN_PRICE), 2)) {
            $price = round($config->get(Constant::SYSTEM_SITE_MIN_PRICE), 2);
        }
        //判断用户是否已开通过网站
        if (WebService::getInstance()->count(array('user_id' => $user['id'])) > 0) {
            return $this->error('您已开通过网站,无需重复开通');
        }
        //判断域名是否被使用
        if (DomainService::getInstance()->count(array('domain' => $data['domain'])) > 0) {
            return $this->error('此域名已被占用');
        }

        //1.订单service单例
        $order = OrderService::getInstance();
        //2.构建参数
        $param = $order->buildParam(Order::ORDER_TYPE_WEB, array(
            'user_id' => $user['id'],
            'name' => $data['name'],
            'domain' => $data['domain'],
        ));
        //3.生成订单
        $order_no = $order->add($user['web_id'], $user['id'], $data['type'], Order::ORDER_TYPE_WEB, $price, '在线开通主站', $param);
        if ($order_no === false) {
            return $this->error('生成订单失败,请联系管理员');
        }
        //4.获取支付链接(余额支付方式直接支付)。
        $arr = $order->pay($order_no);
        if ($arr['code'] != 200) {
            return $this->error($arr['message']);
        }
        return $this->success($arr['message'], $arr['url']);
    }
}
