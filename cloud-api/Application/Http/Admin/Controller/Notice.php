<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Admin\Controller;

use app\Constant\Input;
use app\Model\Log;
use app\Service\AuthService;
use app\Service\LogService;
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
            array('status|状态', 'omitempty|number|in:0,1'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:sort|in:id,sort,create_time,update_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        $data['web_id'] = $web['id'];
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

    /**
     * 创建公告
     *
     * @return void
     */
    public function create()
    {
        $data = $this->validate(array(
            array('place|显示位置', 'require'),
            array('title|标题', 'require'),
            array('content|内容', 'require'),
            array('status|状态', 'require|number|in:0,1|default:0'),
            array('sort|状态', 'require|number|default:0'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        $data['web_id'] = $web['id'];
        if (NoticeService::getInstance()->create($data)) {
            LogService::getInstance()->add(Log::TYPE_CREATE, '新建公告', '新建页面公告');
            return $this->success('添加成功');
        }
        return $this->error('添加失败');
    }

    /**
     * 更新公告
     *
     * @return void
     */
    public function update()
    {
        $data = $this->validate(array(
            array('ids|公告ID列表', 'require|array|number|length_between:1,1000'),
            array('place|显示位置', 'omitempty'),
            array('title|标题', 'omitempty'),
            array('content|内容', 'omitempty'),
            array('status|状态', 'omitempty|number|in:0,1'),
            array('sort|排序', 'omitempty|number'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        $where = array(
            array('id', $data['ids'], 'in'),
            array('web_id', $web['id']),
        );
        if (NoticeService::getInstance()->update($where,$data)) {
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改公告', '修改页面公告');
            return $this->success('修改成功');
        }
        return $this->error('修改失败');
    }

    /**
     * 删除公告
     *
     * @return void
     */
    public function delete()
    {
        $data = $this->validate(array(
            array('ids|公告ID列表', 'require|array|number|length_between:1,1000'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        if (NoticeService::getInstance()->delete(array(
            array('id', $data['ids'], 'in'),
            array('web_id', $web['id']),
        ))) {
            LogService::getInstance()->add(Log::TYPE_DELETE, '删除公告', '删除页面公告');
            return $this->success('删除成功');
        }
        return $this->error('删除失败');
    }
}
