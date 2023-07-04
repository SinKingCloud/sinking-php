<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Admin\Controller;

use app\Constant\Config as Constant;
use app\Constant\Input;
use app\Model\Domain as ModelDomain;
use app\Model\Log;
use app\Service\AuthService;
use app\Service\ConfigService;
use app\Service\DomainService;
use app\Service\LogService;
use app\Service\WebService;
use Systems\Request;

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
        $web = AuthService::getInstance()->getCurrentWeb();
        $data = $this->validate(array(
            array('web_id|站点ID', 'require|number|default:' . $web['id']),
            array('status|状态', 'omitempty|number|in:0,1'),
            array('type|域名类型', 'omitempty|number|in:0,1'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,create_time,update_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        if ($data['web_id'] != $web['id']) {
            $temp_web = WebService::getInstance()->get($data['web_id']);
            if (!$temp_web || $temp_web['web_id'] != $web['id']) {
                return $this->error('该站点不存在');
            }
        }
        return $this->success('获取成功', DomainService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size));
    }

    /**
     * 修改
     *
     * @return void
     */
    public function update()
    {
        $web = AuthService::getInstance()->getCurrentWeb();
        $data = $this->validate(array(
            array('web_id|站点ID', 'require|number|default:' . $web['id']),
            array('ids|域名ID列表', 'require|array|number|length_between:1,1000'),
            array('status|域名状态', 'omitempty|number|in:0,1'),
        ), Request::param());
        if ($data['web_id'] != $web['id']) {
            $temp_web = WebService::getInstance()->get($data['web_id']);
            if (!$temp_web || $temp_web['web_id'] != $web['id']) {
                return $this->error('该站点不存在');
            }
        }
        $where = array(
            array('id', $data['ids'], 'in'),
            array('type', ModelDomain::TYPE_USER),
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
        $web = AuthService::getInstance()->getCurrentWeb();
        $data = $this->validate(array(
            array('web_id|站点ID', 'require|number|default:' . $web['id']),
            array('domain|域名', 'require'),
            array('status|状态', 'require|number|in:0,1|default:0'),
        ), Request::param());
        if ($data['web_id'] != $web['id']) {
            $temp_web = WebService::getInstance()->get($data['web_id']);
            if (!$temp_web || $temp_web['web_id'] != $web['id']) {
                return $this->error('该站点不存在');
            }
        }
        $data['type'] = ModelDomain::TYPE_USER;
        $num = intval(ConfigService::getInstance()->get(Constant::SYSTEM_DOMAIN_NUM));
        if ($num > 0 && DomainService::getInstance()->count(array('web_id' => $data['web_id'])) >= $num) {
            return $this->error('已达到最大域名绑定个数');
        }
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
        $web = AuthService::getInstance()->getCurrentWeb();
        $data = $this->validate(array(
            array('ids|域名ID列表', 'require|array|number|length_between:1,1000'),
            array('web_id|站点ID', 'require|number|default:' . $web['id']),
        ), Request::param());
        if ($data['web_id'] != $web['id']) {
            $temp_web = WebService::getInstance()->get($data['web_id']);
            if (!$temp_web || $temp_web['web_id'] != $web['id']) {
                return $this->error('该站点不存在');
            }
        }
        if (DomainService::getInstance()->delete(array(
            array('id', $data['ids'], 'in'),
            array('type', ModelDomain::TYPE_USER),
        ))) {
            LogService::getInstance()->add(Log::TYPE_DELETE, '删除域名', '删除绑定域名');
            return $this->success('删除成功');
        }
        return $this->error('删除失败');
    }
}
