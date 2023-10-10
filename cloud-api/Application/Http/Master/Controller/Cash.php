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
use app\Service\CashService;
use app\Service\UserService;
use Systems\Request;

class Cash extends Common
{

    /**
     * 列表
     *
     * @return void
     */
    public function lists()
    {
        $page = Request::input(Input::PAGE, 1);
        $page_size = Request::input(Input::PAGE_SIZE, 20);
        $data = $this->validate(array(
            array('user_id|用户ID', 'omitempty|number'),
            array('type|提现方式', 'omitempty|number|in:0,1,2|default:0'),
            array('name|提现姓名', 'omitempty'),
            array('account|提现账号', 'omitempty'),
            array('status|状态', 'omitempty|number|in:0,1'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,status,create_time,update_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        LogService::getInstance()->add(Log::TYPE_LOOK, '查看提现', '查看提现记录');
        $data =  CashService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size);
        foreach ($data['list'] as &$key) {
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
        return $this->success('获取成功', $data);
    }

    /**
     * 修改
     *
     * @return void
     */
    public function update()
    {
        $data = $this->validate(array(
            array('ids|提现ID列表', 'require|array|number|length_between:1,1000'),
            array('type|提现方式', 'omitempty|number|in:0,1,2|default:0'),
            array('name|提现姓名', 'omitempty'),
            array('account|提现账号', 'omitempty'),
            array('status|状态', 'omitempty|number|in:0,1'),
            array('remark|备注', 'omitempty'),
        ), Request::param());
        $where = array(
            array('id', $data['ids'], 'in'),
        );
        if (CashService::getInstance()->update($where, $data)) {
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改提现', '修改提现信息');
            return $this->success('修改成功');
        } else {
            return $this->error('修改失败');
        }
    }
}
