<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Master\Controller;

use app\Constant\Input;
use app\Model\Log as ModelLog;
use app\Service\LogService;
use Systems\Request;

class Log extends Common
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
            array('user_id|用户ID', 'require|number|min:1'),
            array('type|类型', 'omitempty|number'),
            array('request_ip|操作IP', 'omitempty|ip'),
            array('request_id|请求ID', 'omitempty'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,create_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        LogService::getInstance()->add(ModelLog::TYPE_LOOK, '查看日志', '查看用户ID' . $data['user_id'] . '操作日志');
        return $this->success('获取成功', LogService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size));
    }
}
