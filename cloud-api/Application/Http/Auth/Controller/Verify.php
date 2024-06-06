<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Auth\Controller;

use app\Service\VerifyService;
use Systems\Request;

class Verify extends Common
{
    /**
     * 发送邮件验证码
     *
     * @return void
     */
    public function email()
    {
        $data = $this->validate(array(
            array('captcha_id|验证码唯一标识', 'require'),
            array('captcha_code|验证码', 'require'),
            array('email|邮箱', 'require|email'),
        ), Request::param());
        if (!VerifyService::getInstance()->checkTencentCaptcha($data['captcha_id'], $data['captcha_code'])) {
            return $this->error("验证码验证失败");
        }
        if (VerifyService::getInstance()->sendEmailCaptcha($data['email'])) {
            return $this->success("邮件发送成功");
        }
        return $this->error("邮件发送失败,请联系管理员");
    }

    /**
     * 发送短信验证码
     *
     * @return void
     */
    public function sms()
    {
        $data = $this->validate(array(
            array('captcha_id|验证码唯一标识', 'require'),
            array('captcha_code|验证码', 'require'),
            array('phone|手机号', 'require|number|length:11'),
        ), Request::param());
        if (!VerifyService::getInstance()->checkTencentCaptcha($data['captcha_id'], $data['captcha_code'])) {
            return $this->error("验证码验证失败");
        }
        if (VerifyService::getInstance()->sendSmsCaptcha($data['phone'])) {
            return $this->success("短信发送成功");
        }
        return $this->error("短信发送失败,请联系管理员");
    }

    /**
     * 获取二维码
     *
     * @return void
     */
    public function qrcode()
    {
        $data = $this->validate(array(
            array('captcha_id|验证码唯一标识', 'require|length:32'),
        ), Request::param());
        $qrcode = VerifyService::getInstance()->genQrCode($data['captcha_id']);
        if (!$qrcode) {
            return $this->error('获取二维码失败');
        }
        return $this->success('获取二维码成功', $qrcode);
    }
}
