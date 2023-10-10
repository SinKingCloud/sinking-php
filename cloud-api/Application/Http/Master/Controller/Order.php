<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Master\Controller;

use app\Constant\Input;
use app\Model\Log;
use app\Service\LogService;
use app\Service\OrderService;
use app\Service\UserService;
use app\Service\WebService;
use Systems\Request;

class Order extends Common
{
    /**
     * 订单列表
     *
     * @return void
     */
    public function lists()
    {
        $page = Request::input(Input::PAGE, 1);
        $page_size = Request::input(Input::PAGE_SIZE, 20);
        $data = $this->validate(array(
            array('web_id|站点ID', 'omitempty|number'),
            array('user_id|用户ID', 'omitempty|number'),
            array('pay_type|支付方式', 'omitempty|number'),
            array('order_type|订单类型', 'omitempty|number'),
            array('status|状态', 'omitempty|number|in:0,1'),
            array('trade_no|订单号', 'omitempty'),
            array('out_trade_no|外部订单号', 'omitempty'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,pay_type,order_type,status,create_time,update_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        $data = OrderService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size);
        foreach ($data['list'] as &$key) {
            $user_web = WebService::getInstance()->get($key['web_id']);
            $key['web'] = array(
                'name' => $user_web['name']
            );
            $user = UserService::getInstance()->get($key['user_id']);
            $key['user'] = array(
                'id' => $user['id'],
                'account' => $user['account'],
                'money' => $user['money'],
                'avatar' => $user['avatar'],
                'nick_name' => $user['nick_name'],
                'email' => $user['email'],
                'status' => $user['status'],
                'login_ip' => $user['login_ip'],
                'login_time' => $user['login_time'],
            );
        }
        LogService::getInstance()->add(Log::TYPE_LOOK, '查看订单', '查看订单记录');
        return $this->success('获取成功', $data);
    }

    /**
     * 删除记录
     *
     * @return void
     */
    public function delete()
    {
        $data = $this->validate(array(
            array('pay_type|支付方式', 'omitempty|number'),
            array('order_type|订单类型', 'omitempty|number'),
            array('status|状态', 'omitempty|number|in:0,1'),
            array('trade_no|订单号', 'omitempty'),
            array('out_trade_no|外部订单号', 'omitempty'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
        ), Request::param());
        if (empty($data)) {
            return $this->error('条件不能为空');
        }
        if (OrderService::getInstance()->delete($data)) {
            LogService::getInstance()->add(Log::TYPE_DELETE, '删除订单', '删除订单数据');
            return $this->success('删除记录成功');
        } else {
            return $this->error('删除记录失败');
        }
    }
}
