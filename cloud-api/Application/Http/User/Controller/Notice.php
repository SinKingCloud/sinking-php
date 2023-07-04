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
use app\Service\NoticeService;
use Systems\Request;

class Notice extends Common
{
    /**
     * 公告列表
     *
     * @return void
     */
    public function lists()
    {
        $page = Request::input(Input::PAGE, 1);
        $page_size = Request::input(Input::PAGE_SIZE, 20);
        $data = $this->validate(array(
            array('place|位置', 'omitempty'),
            array('web_id|站点ID', 'omitempty|in:my,parent,system|default:my'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:sort|in:id,sort,create_time,update_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        if ($data['web_id'] == 'my') {
            $data['web_id'] = $web['id'];
        } else if ($data['web_id'] == 'parent') {
            $data['web_id'] = $web['web_id'];
        } else if ($data['web_id'] == 'system') {
            $data['web_id'] = 0;
        }
        $data['status'] = 0;
        return $this->success('获取成功', NoticeService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size));
    }

    /**
     * 公告详情
     *
     * @return void
     */
    public function info()
    {
        $data = $this->validate(array(
            array('id|公告ID', 'require|number'),
        ), Request::param());
        $info = NoticeService::getInstance()->find($data['id']);
        if ($info) {
            //查看次数自增
            NoticeService::getInstance()->auto($data['id'], array(
                'look_num' => '+1',
            ));
            return $this->success('获取成功', $info);
        } else {
            return $this->error('该公告不存在');
        }
    }
}
