<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\User\Controller;

use app\Constant\Config;
use app\Model\Log;
use app\Service\AuthService;
use app\Service\LogService;
use app\Service\SettingService;
use app\Service\UserService;
use app\Service\VerifyService;
use Systems\Request;
use Systems\Util;

class Person extends Common
{
    /**
     * 获取用户信息
     *
     * @return void
     */
    public function info()
    {
        $user = AuthService::getInstance()->getCurrentUser(); //用户信息
        $is_admin = AuthService::getInstance()->checkIsMasterUser(false); //是否为站长
        $is_master = $is_admin && AuthService::getInstance()->checkIsMasterWeb(false); //是否为总站长
        $data = array(
            'id' => $user['id'],
            'web_id' => $user['web_id'],
            'account' => $user['account'],
            'nick_name' => empty($user['nick_name']) ? $user['email'] : $user['nick_name'],
            'avatar' => $user['avatar'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'money' => $user['money'],
            'contact' => SettingService::getInstance()->getUser($user['id'], Config::USER_CONTACT),
            'login_ip' => $user['login_ip'],
            'login_time' => $user['login_time'],
            'status' => $user['status'],
            'is_admin' => $is_admin,
            'is_master' => $is_master
        );
        return $this->success('获取成功', $data);
    }

    /**
     * 修改账户资料
     *
     * @return void
     */
    public function update()
    {
        $data = $this->validate(array(
            array('account|账户名', 'omitempty|account|length_between:5,20'),
            array('avatar|头像', 'omitempty|url'),
            array('nick_name|昵称', 'omitempty|length_between:1,20'),
            array('contact|联系方式', 'omitempty|number'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        /** 初次修改账号部分 **/
        if (isset($data['account']) && empty($user['account']) && $temp_user = UserService::getInstance()->find(array('account' => $data['account']))) {
            if ($temp_user && $temp_user['id'] != $user['id']) {
                return $this->error("该账号已被他人占用");
            }
        } else {
            unset($user['account']);
        }
        /** 修改联系方式部分 **/
        if (isset($data['contact'])) {
            SettingService::getInstance()->setUser($user['id'], Config::USER_CONTACT, $data['contact']);
            unset($data['contact']);
        }
        if (UserService::getInstance()->update($user['id'], $data)) {
            //清理缓存
            UserService::getInstance()->clear($user['id']);
            //写入日志
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改资料', '修改账户资料');
            return $this->success("资料修改成功");
        }
        return $this->error("资料修改失败");
    }

    /**
     * 修改密码
     *
     * @return void
     */
    public function change_password()
    {
        $data = $this->validate(array(
            array('type|验证方式', 'omitempty|default:phone|in:phone,email'),
            array('code|验证码', 'require|length:6|between:100000,999999'),
            array('password|密码', 'require|length_between:5,20'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        $key = 'email';
        if ($data['type'] == 'phone') {
            $key = 'phone';
        }
        if (!VerifyService::getInstance()->checkCaptcha($user[$key], $data['code'], false)) {
            return $this->error("安全验证失败");
        }
        if (UserService::getInstance()->update($user['id'], array('password' => Util::getPassword($data['password'])))) {
            VerifyService::getInstance()->checkCaptcha($user[$key], $data['code']);
            UserService::getInstance()->clear($user['id']);
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改密码', '修改账户密码');
            return $this->success("密码修改成功");
        }
        return $this->error("密码修改失败");
    }

    /**
     * 修改邮箱
     *
     * @return void
     */
    public function change_email()
    {
        $data = $this->validate(array(
            array('email|邮箱', 'require|email'),
            array('email_code|验证码', 'require|length:6|between:100000,999999'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        if ($temp_user = UserService::getInstance()->find(array('email' => $data['email']))) {
            if ($temp_user && $temp_user['id'] != $user['id']) {
                return $this->error("该邮箱已被他人占用");
            }
        }
        if (!VerifyService::getInstance()->checkCaptcha($data['email'], $data['email_code'], false)) {
            return $this->error("邮箱验证失败");
        }
        if (UserService::getInstance()->update($user['id'], array('email' => $data['email']))) {
            VerifyService::getInstance()->checkCaptcha($data['email'], $data['email_code'], true);
            UserService::getInstance()->clear($user['id']);
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改邮箱', '修改账户邮箱');
            return $this->success("邮箱修改成功");
        }
        return $this->error("邮箱修改失败");
    }

    /**
     * 修改手机
     *
     * @return void
     */
    public function change_phone()
    {
        $data = $this->validate(array(
            array('phone|手机号', 'require|number|length:11'),
            array('sms_code|验证码', 'require|length:6|between:100000,999999'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        if ($temp_user = UserService::getInstance()->find(array('phone' => $data['phone']))) {
            if ($temp_user && $temp_user['id'] != $user['id']) {
                return $this->error("该手机号已被他人占用");
            }
        }
        if (!VerifyService::getInstance()->checkCaptcha($data['phone'], $data['sms_code'], false)) {
            return $this->error("短信验证失败");
        }
        if (UserService::getInstance()->update($user['id'], array('phone' => $data['phone']))) {
            VerifyService::getInstance()->checkCaptcha($data['phone'], $data['sms_code'], true);
            UserService::getInstance()->clear($user['id']);
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改手机', '修改账户手机');
            return $this->success("手机修改成功");
        }
        return $this->error("手机修改失败");
    }
}
