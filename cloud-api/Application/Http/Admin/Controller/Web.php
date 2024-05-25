<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Admin\Controller;

use app\Constant\Input;
use app\Model\Domain;
use app\Model\Log;
use app\Service\AuthService;
use app\Service\DomainService;
use app\Service\LogService;
use Systems\Request;
use app\Service\UserService;
use app\Service\WebService;

class Web extends Common
{
    /**
     * 用户列表
     *
     * @return void
     */
    public function lists()
    {
        $page = Request::input(Input::PAGE, 1);
        $page_size = Request::input(Input::PAGE_SIZE, 20);
        $data = $this->validate(array(
            array('user_id|用户ID', 'omitempty|number'),
            array('web_id|站点ID', 'omitempty|number'),
            array('name|网站名称', 'omitempty'),
            array('status|状态', 'omitempty|number|in:0,1'),
            array('expire_time_start|到期开始时间', 'omitempty|date'),
            array('expire_time_end|到期结束时间', 'omitempty|date'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,status,login_time,create_time,expire_time,update_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        $data['web_id'] = $web['id'];
        $data = WebService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size);
        foreach ($data['list'] as &$key) {
            $domain = DomainService::getInstance()->get($key['id'], false, Domain::STATUS_NORMAL);
            $key['domain'] = $domain['domain'];
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
        LogService::getInstance()->add(Log::TYPE_LOOK, '查看分站', '查看分站数据');
        return $this->success('获取成功', $data);
    }

    /**
     * 更新站点
     *
     * @return void
     */
    public function update()
    {
        $data = $this->validate(array(
            array('ids|站点ID列表', 'require|array|number|length_between:1,1000'),
            array('name|名称', 'omitempty'),
            array('title|标题', 'omitempty'),
            array('keywords|关键词', 'omitempty'),
            array('description|网站描述', 'omitempty'),
            array('status|状态', 'omitempty|number|in:0,1'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        $where = array(
            array('id', $data['ids'], 'in'),
            array('web_id', $web['id']),
        );
        if (WebService::getInstance()->update($where, $data)) {
            foreach ($data['ids'] as $id) {
                WebService::getInstance()->clear($id);
            }
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改分站', '修改分站信息');
            return $this->success('修改成功');
        }
        return $this->error('修改失败');
    }
}
