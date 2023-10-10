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
            array('user_id|用户ID', 'require|number|min:1'),
            array('type|类型', 'omitempty|number|in:0,1'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,create_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        LogService::getInstance()->add(Log::TYPE_LOOK, '查看消费', '查看用户ID' . $data['user_id'] . '消费明细');
        return $this->success('获取成功', PayService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size));
    }
}
