<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\User\Controller;

use app\Constant\Input;
use app\Service\AuthService;
use app\Service\MessageService;
use Systems\Request;

class Message extends Common
{
    /**
     * 消息列表
     *
     * @return void
     */
    public function lists()
    {
        $page = Request::input(Input::PAGE, 1);
        $page_size = Request::input(Input::PAGE_SIZE, 20);
        $data = $this->validate(array(
            array('status|状态', 'omitempty|number|in:0,1'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        $data['user_id'] = $user['id'];
        return $this->success('获取成功', MessageService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size));
    }

    /**
     * 消息详情
     *
     * @return void
     */
    public function info()
    {
        $data = $this->validate(array(
            array('id|消息ID', 'require|number'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        $data['user_id'] = $user['id'];
        $info = MessageService::getInstance()->find($data);
        if ($info) {
            //更新消息状态
            MessageService::getInstance()->update($info['id'], array(
                'status' => 1
            ));
            return $this->success('获取成功', $info);
        } else {
            return $this->error('该消息不存在');
        }
    }
}
