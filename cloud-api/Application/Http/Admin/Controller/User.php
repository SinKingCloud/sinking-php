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
use app\Model\Pay;
use app\Service\AuthService;
use app\Service\PayService;
use app\Service\UserService;
use Systems\Request;
use Systems\Util;
use app\Model\User as UserModel;
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
        $web = AuthService::getInstance()->getCurrentWeb();
        $data['web_id'] = $web['id'];
        LogService::getInstance()->add(Log::TYPE_LOOK, '查看用户', '查看用户数据');
        return $this->success('获取成功', UserService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size));
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
            array('user_type|用户类型', 'omitempty|number|default:0|in:0,1'),
            array('nick_name|昵称', 'omitempty'),
            array('avatar|头像', 'omitempty|url'),
            array('status|状态', 'omitempty|number|in:0,1'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        if (in_array($user['id'], $data['ids'])) {
            return $this->error('您不能操作自己的账户');
        }
        $web = AuthService::getInstance()->getCurrentWeb();
        if ($data['user_type'] == 0) {
            $where = array(
                array('id', $data['ids'], 'in'),
                array('web_id', $web['id']),
            );
        } else {
            $ids = array();
            foreach ($data['ids'] as $id) {
                $temp = WebService::getInstance()->find(array('user_id' => $id));
                if ($temp && $temp['web_id'] == $web['id']) {
                    $ids[] = $id;
                }
            }
            $where = array(
                array('id', $ids, 'in'),
            );
            $data['ids'] = $ids;
        }
        unset($data['user_type']);
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
            array('type|操作类型', 'require|number|in:0|default:0'),
            array('money|金额', 'require|number|min:0.01'),
            array('remark|备注', 'omitempty'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        $user = AuthService::getInstance()->getCurrentUser();
        if ($user['id'] == $data['user_id']) {
            return $this->error('您不能操作自己的账户');
        }
        if ($user['money'] < $data['money']) {
            return $this->error('您的账户余额不足');
        }
        $temp_user = UserService::getInstance()->find(array(
            'id' => $data['user_id'],
            'web_id' => $web['id'],
        ));
        if (!$temp_user) {
            $temp_web = WebService::getInstance()->find(array('user_id' => $data['user_id']));
            if (!$temp_web || $temp_web['web_id'] != $web['id']) {
                return $this->error('充值账户不存在');
            }
            $temp_user = UserService::getInstance()->find(array(
                'id' => $data['user_id'],
            ));
        }
        if ($data['remark']) {
            $remark = '备注:' . $data['remark'];
        } else {
            $remark = '';
        }
        $user_id = intval($data['user_id']);
        $money = sprintf("%.2f",$data['money']);
        $type = $data['type'] == 0 ? '+' : '-';
        UserModel::startTrans(); //开启事务
        if (UserService::getInstance()->auto($user['id'], array('money' => ($type == '-' ? '+' : '-') . $money))) {
            if (UserService::getInstance()->auto($user_id, array('money' => $type . $money))) {
                //写入日志
                PayService::getInstance()->creates(
                    array(
                        array(
                            'user_id' => $user['id'],
                            'type' => $data['type'] == 0 ? 1 : 0,
                            'money' => $money,
                            'title' => Pay::TITLE_MONEY_LOW,
                            'content' => '给下级用户账号' . $temp_user['account'] . '(' . $temp_user['email'] . ')加款' . $money . '元扣费。' . $remark
                        ),
                        array(
                            'user_id' => $temp_user['id'],
                            'type' => $data['type'],
                            'money' => $money,
                            'title' => Pay::TITLE_MONEY_UP,
                            'content' => '上级后台加款' . $money . '元。' . $remark
                        ),
                    )
                );
                UserModel::commit(); //提交事务
                UserService::getInstance()->clear($user['id']);
                UserService::getInstance()->clear($temp_user['id']);
                LogService::getInstance()->add(Log::TYPE_UPDATE, '操作余额', '给用户加款');
                return $this->success('操作余额成功');
            }
        }
        UserModel::rollback(); //回滚事务
        return $this->error('操作余额失败');
    }
}
