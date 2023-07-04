<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Master\Controller;

use app\Constant\Input;
use app\Model\Domain as ModelDomain;
use app\Model\Log;
use app\Service\AuthService;
use app\Service\DomainService;
use app\Service\LogService;
use Systems\Request;
use Systems\Util;

class Domain extends Common
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
            array('web_id|站点ID', 'omitempty|number'),
            array('status|状态', 'omitempty|number|in:0,1'),
            array('type|域名类型', 'omitempty|number|in:0,1'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,create_time,update_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        return $this->success('获取成功', DomainService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size));
    }

    /**
     * 修改
     *
     * @return void
     */
    public function update()
    {
        $data = $this->validate(array(
            array('ids|域名ID列表', 'require|array|number|length_between:1,1000'),
            array('status|域名状态', 'omitempty|number|in:0,1'),
        ), Request::param());
        $where = array(
            array('id', $data['ids'], 'in'),
            array('domain', Util::getHost(false), '!=', 'and'),
        );
        if (DomainService::getInstance()->update($where, $data)) {
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改域名', '修改域名状态');
            return $this->success('修改成功');
        } else {
            return $this->error('修改失败');
        }
    }

    /**
     * 新增
     *
     * @return void
     */
    public function create()
    {
        $data = $this->validate(array(
            array('domain|域名', 'require'),
            array('status|状态', 'require|number|in:0,1|default:0'),
            array('type|域名类型', 'require|number|in:0,1|default:0'),
            array('web_id|站点ID', 'require|number'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        if (DomainService::getInstance()->count(array('domain' => $data['domain'])) > 0) {
            return $this->error('此域名已被占用');
        }
        if (DomainService::getInstance()->set($data['domain'], $data['web_id'], $data['status'], $data['type'])) {
            LogService::getInstance()->add(Log::TYPE_CREATE, '添加域名', '添加网站域名');
            return $this->success('添加成功');
        }
        return $this->error('添加失败');
    }

    /**
     * 删除
     *
     * @return void
     */
    public function delete()
    {
        $data = $this->validate(array(
            array('ids|域名ID列表', 'require|array|number|length_between:1,1000'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        $where = array(
            array('id', $data['ids'], 'in'),
            array('domain', Util::getHost(false), '!=', 'and'),
        );
        if (DomainService::getInstance()->delete($where)) {
            LogService::getInstance()->add(Log::TYPE_DELETE, '删除域名', '删除绑定域名');
            return $this->success('删除成功');
        }
        return $this->error('删除失败');
    }
}
