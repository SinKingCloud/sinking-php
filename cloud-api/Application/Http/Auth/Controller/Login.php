<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Auth\Controller;

use app\Constant\Config;
use app\Constant\Input;
use app\Model\Log;
use app\Service\AuthService;
use app\Service\ConfigService;
use app\Service\LogService;
use app\Service\UserService;
use app\Service\VerifyService;
use Systems\Request;
use Systems\Util;

class Login extends Common
{
    /**
     * 密码登陆
     *
     * @return void
     */
    public function pwd()
    {
        $data = $this->validate(array(
            array('account|账户名', 'require|length_between:5,20'),
            array('password|密码', 'require|length_between:5,20'),
            array('device|登陆设备', 'require|in:mobile,pc|default:mobile'),
        ), Request::param());
        $user = UserService::getInstance()->get($data['account']);
        if (!$user) {
            $user = UserService::getInstance()->find(array('email' => $data['account']));
        }
        if (!$user) {
            $user = UserService::getInstance()->find(array('phone' => $data['account']));
        }
        if (!$user || !Util::checkPassword($data['password'], $user['password'])) {
            return $this->error('账号或密码错误');
        }
        //判断用户是否属于此站点
        AuthService::getInstance()->checkUserInWeb($user);
        //生成token
        $token = AuthService::getInstance()->genLoginToken($user['id'], $data['device']);
        if ($token) {
            LogService::getInstance()->add(Log::TYPE_LOGIN, '密码登陆', '密码验证登陆', $user['id']);
            return $this->success("登陆成功", array('token' => $token));
        }
        return $this->error('生成授权票据失败,请联系管理员');
    }

     /**
     * 短信登陆
     *
     * @return void
     */
    public function sms()
    {
        $data = $this->validate(array(
            array('phone|手机号', 'require|number|length:11'),
            array('sms_code|验证码', 'require|length:6|between:100000,999999'),
            array('device|登陆设备', 'require|in:mobile,pc|default:mobile'),
            array('captcha_id|验证码唯一标识', 'require|length:32'),
            array('captcha_code|验证码', 'require|length:4|between:1000,9999'),
        ), Request::param());
        if (ConfigService::getInstance()->get(Config::SYSTEM_REG_PHONE) != 1) {
            return $this->error("系统已关闭短信注册");
        }
        if (!VerifyService::getInstance()->checkCaptcha($data['captcha_id'], $data['captcha_code'])) {
            return $this->error("图形验证码错误");
        }
        if (!VerifyService::getInstance()->checkCaptcha($data['phone'], $data['sms_code'], false)) {
            return $this->error("短信验证失败");
        }
        $web = AuthService::getInstance()->getCurrentWeb();
        //判断是否含有此号码
        $user = UserService::getInstance()->find(array('phone' => $data['phone']));
        //不存在则注册
        if (!$user) {
            $data['web_id'] = $web['id'];
            if (!UserService::getInstance()->addUser($data)) {
                return $this->error("账号注册失败,请联系管理员");
            }
            //清理验证码
            VerifyService::getInstance()->checkCaptcha($data['phone'], $data['sms_code']);
            //重新获取用户信息
            $user = UserService::getInstance()->find(array('phone' => $data['phone']));
        } else {
            //判断用户是否属于此站点
            AuthService::getInstance()->checkUserInWeb($user);
        }
        //生成token
        $token = AuthService::getInstance()->genLoginToken($user['id'], $data['device']);
        if ($token) {
            LogService::getInstance()->add(Log::TYPE_LOGIN, '短信登陆', '短信验证登陆', $user['id']);
            return $this->success("登陆成功", array('token' => $token));
        }
        return $this->error('生成授权票据失败,请联系管理员');
    }

    /**
     * 邮箱登陆
     *
     * @return void
     */
    public function email()
    {
        $data = $this->validate(array(
            array('email|邮箱', 'require|email'),
            array('email_code|验证码', 'require|length:6|between:100000,999999'),
            array('device|登陆设备', 'require|in:mobile,pc|default:mobile'),
            array('captcha_id|验证码唯一标识', 'require|length:32'),
            array('captcha_code|验证码', 'require|length:4|between:1000,9999'),
        ), Request::param());
        if (ConfigService::getInstance()->get(Config::SYSTEM_REG_EMAIL) != 1) {
            return $this->error("系统已关闭邮箱注册");
        }
        if (!VerifyService::getInstance()->checkCaptcha($data['captcha_id'], $data['captcha_code'])) {
            return $this->error("图形验证码错误");
        }
        if (!VerifyService::getInstance()->checkCaptcha($data['email'], $data['email_code'], false)) {
            return $this->error("邮箱验证失败");
        }
        $web = AuthService::getInstance()->getCurrentWeb();
        //判断是否含有此email
        $user = UserService::getInstance()->find(array('email' => $data['email']));
        //不存在则注册
        if (!$user) {
            $data['web_id'] = $web['id'];
            if (!UserService::getInstance()->addUser($data)) {
                return $this->error("账号注册失败,请联系管理员");
            }
            //清理验证码
            VerifyService::getInstance()->checkCaptcha($data['email'], $data['email_code']);
            //重新获取用户信息
            $user = UserService::getInstance()->find(array('email' => $data['email']));
        } else {
            //判断用户是否属于此站点
            AuthService::getInstance()->checkUserInWeb($user);
        }
        //生成token
        $token = AuthService::getInstance()->genLoginToken($user['id'], $data['device']);
        if ($token) {
            LogService::getInstance()->add(Log::TYPE_LOGIN, '邮箱登陆', '邮箱验证登陆', $user['id']);
            return $this->success("登陆成功", array('token' => $token));
        }
        return $this->error('生成授权票据失败,请联系管理员');
    }

    /**
     * 二维码登录
     *
     * @return void
     */
    public function qrlogin()
    {
        $data = $this->validate(array(
            array('captcha_id|验证码唯一标识', 'require|length:32'),
            array('device|登陆设备', 'require|in:mobile,pc|default:mobile'),
        ), Request::param());
        if (ConfigService::getInstance()->get(Config::SYSTEM_REG_QRLOGIN) != 1) {
            return $this->error("系统已关闭邮箱注册");
        }
        $ret = VerifyService::getInstance()->checkQrCode($data['captcha_id'], false);
        if (!$ret || $ret['code'] != 1) {
            return $this->error("登陆失败", $ret);
        }
        $data['email'] = $ret['data']['uin'] . "@qq.com";
        $web = AuthService::getInstance()->getCurrentWeb();
        //判断是否含有此email
        $user = UserService::getInstance()->find(array('email' => $data['email']));
        //不存在则注册
        if (!$user) {
            $data['web_id'] = $web['id'];
            if (!UserService::getInstance()->addUser($data)) {
                return $this->error("账号注册失败,请联系管理员");
            }
            //重新获取用户信息
            $user = UserService::getInstance()->find(array('email' => $data['email']));
        } else {
            //判断用户是否属于此站点
            AuthService::getInstance()->checkUserInWeb($user);
        }
        //生成token
        $token = AuthService::getInstance()->genLoginToken($user['id'], $data['device']);
        if ($token) {
            LogService::getInstance()->add(Log::TYPE_LOGIN, '扫码登陆', '扫码验证登陆', $user['id']);
            return $this->success("登陆成功", array('token' => $token));
        }
        return $this->error('生成授权票据失败,请联系管理员');
    }

    /**
     * 退出登录
     *
     * @return void
     */
    public function out()
    {
        $header = Request::headers();
        $device = $header[Input::HEADER_DEVICE]; //登陆设备
        $user = AuthService::getInstance()->checkUser();
        if ($user) {
            UserService::getInstance()->deleteLoginToken($user['id'], $device);
            LogService::getInstance()->add(Log::TYPE_LOGIN, '注销登陆', '主动注销登陆');
        }
        return $this->success('注销登陆成功');
    }
}
