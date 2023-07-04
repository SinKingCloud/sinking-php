<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\User\Controller;

use app\Constant\Config as Constant;
use app\Constant\Input;
use app\Model\Log;
use app\Model\Order;
use app\Service\AuthService;
use app\Service\ConfigService;
use app\Service\LogService;
use app\Service\OrderService;
use app\Service\PayService;
use Systems\Request;

class Pay extends Common
{
    /**
     * 消费明细
     *
     * @return void
     */
    public function lists()
    {
        $page = Request::input(Input::PAGE, 1);
        $page_size = Request::input(Input::PAGE_SIZE, 20);
        $data = $this->validate(array(
            array('type|类型', 'omitempty|number|in:0,1'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,create_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        $data['user_id'] = $user['id'];
        LogService::getInstance()->add(Log::TYPE_LOOK, '查看消费', '查看消费明细');
        return $this->success('获取成功', PayService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size));
    }

    /**
     * 余额充值
     *
     * @return void
     */
    public function recharge()
    {
        $config = ConfigService::getInstance();
        $data = $this->validate(array(
            array('money|充值金额', 'require|min:' . round($config->get(Constant::SYSTEM_PAY_MIN_MONEY),2)),
            array('type|支付方式', 'require|number|in:0,1,2|default:0'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        $order = OrderService::getInstance();
        $param = $order->buildParam(Order::ORDER_TYPE_RECHARGE, array(
            'user_id' => $user['id'],
            'money' => $data['money']
        ));
        $res = $order->add($user['web_id'], $user['id'], $data['type'], Order::ORDER_TYPE_RECHARGE, $data['money'], '在线充值', $param);
        if ($res === false) {
            return $this->error($order->getError());
        }
        $arr = $order->pay($res);
        if ($arr['code'] != 200) {
            return $this->error($arr['message']);
        }
        return $this->success('订单创建成功', $arr['url']);
    }
}
