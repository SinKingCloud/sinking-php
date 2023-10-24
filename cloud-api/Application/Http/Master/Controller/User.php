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
use app\Model\Pay;
use app\Service\AuthService;
use app\Service\PayService;
use app\Service\UserService;
use Systems\Request;
use Systems\Util;
use app\Service\LogService;
use app\Service\WebService;

class User extends Common
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
            array('account|账号', 'omitempty'),
            array('email|邮箱', 'omitempty|email'),
            array('phone|手机号', 'omitempty|number'),
            array('web_id|站点ID', 'omitempty|number'),
            array('login_ip|登陆ip', 'omitempty|ip'),
            array('status|状态', 'omitempty|number|in:0,1'),
            array('login_time_start|登陆开始时间', 'omitempty|date'),
            array('login_time_end|登陆结束时间', 'omitempty|date'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,status,login_time,create_time,update_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        $data =  UserService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size);
        foreach ($data['list'] as &$key) {
            $user_web = WebService::getInstance()->get($key['web_id']);
            $key['is_admin'] = isset($user_web['user_id']) && ($user_web['user_id'] == $key['id']);
            $key['web'] = array(
                'name' => $user_web['name']
            );
        }
        LogService::getInstance()->add(Log::TYPE_LOOK, '查看用户', '查看用户列表');
        return $this->success('获取成功', $data);
    }

    /**
     * 更新用户信息
     *
     * @return void
     */
    public function update()
    {
        $data = $this->validate(array(
            array('ids|用户ID列表', 'require|array|number|length_between:1,1000'),
            array('account|账号', 'omitempty|account'),
            array('phone|手机号', 'omitempty|number|length:11'),
            array('email|账号', 'omitempty|email'),
            array('nick_name|昵称', 'omitempty'),
            array('password|密码', 'omitempty|length_between:5,20'),
            array('avatar|头像', 'omitempty|url'),
            array('status|状态', 'omitempty|number|in:0,1'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        if (in_array($user['id'], $data['ids'])) {
            unset($data['status']);
        }
        if ((isset($data['account']) || isset($data['email']) || isset($data['phone']))  && count($data['ids']) > 1) {
            return $this->error('不支持批量修改账户和邮箱');
        }
        if (isset($data['account']) && $data['account']) {
            $temp = UserService::getInstance()->find(array('account' => $data['account']));
            if ($temp && $temp['id'] != $data['ids'][0]) {
                return $this->error('账户名已被占用');
            }
        }
        if (isset($data['email']) && $data['email']) {
            $temp = UserService::getInstance()->find(array('email' => $data['email']));
            if ($temp && $temp['id'] != $data['ids'][0]) {
                return $this->error('邮箱已被占用');
            }
        }
        if (isset($data['phone']) && $data['phone']) {
            $temp = UserService::getInstance()->find(array('phone' => $data['phone']));
            if ($temp && $temp['id'] != $data['ids'][0]) {
                return $this->error('手机号已被占用');
            }
        }
        if (isset($data['password']) && $data['password']) {
            $data['password'] = Util::getPassword($data['password']);
        }
        $web = AuthService::getInstance()->getCurrentWeb();
        $where = array(
            array('id', $data['ids'], 'in'),
        );
        if (UserService::getInstance()->update($where, $data)) {
            foreach ($data['ids'] as $id) {
                UserService::getInstance()->clear($id);
            }
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改用户', '修改用户信息');
            return $this->success('修改成功');
        }
        return $this->error('修改失败');
    }

    /**
     * 余额操作
     *
     * @return void
     */
    public function money()
    {
        $data = $this->validate(array(
            array('user_id|用户ID', 'require|number|min:1'),
            array('type|操作类型', 'require|number|in:0,1|default:0'),
            array('money|金额', 'require|number|min:0.01'),
            array('remark|备注', 'omitempty'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        $temp_user = UserService::getInstance()->find(array(
            'id' => $data['user_id'],
        ));
        if (!$temp_user) {
            return $this->error('充值账户不存在');
        }
        if ($data['remark']) {
            $remark = '备注:' . $data['remark'];
        } else {
            $remark = '';
        }
        $user_id = intval($data['user_id']);
        $money = round($data['money'], 2);
        $type = $data['type'] == 0 ? '+' : '-';
        if (UserService::getInstance()->auto($user_id, array('money' => $type . $money))) {
            //写入日志
            PayService::getInstance()->create(
                array(
                    'user_id' => $temp_user['id'],
                    'type' => $data['type'],
                    'money' => $money,
                    'title' => Pay::TITLE_MONEY_UP,
                    'content' => '上级后台加款' . $money . '元。' . $remark
                )
            );
            UserService::getInstance()->clear($temp_user['id']);
            LogService::getInstance()->add(Log::TYPE_UPDATE, '余额操作', '调整用户余额');
            return $this->success('操作余额成功');
        }
        return $this->error('操作余额失败');
    }
}
