<?php

namespace app\Service;

use app\Base\BaseService;
use Systems\Cache;
use Systems\Captcha;
use app\Constant\Cache as Constant;
use Plugins\Util\UinLogin;

class VerifyService extends BaseService
{
    /**
     * 生成验证码
     *
     * @param string $captcha_id 验证码ID
     * @return void
     */
    public function genCaptcha($captcha_id)
    {
        $captcha = new Captcha(4);
        Cache::set(Constant::CAPTCHA_NAME . $captcha_id, $captcha->getCode(), Constant::CAPTCHA_TIME);
        return $captcha->gen();
    }

    /**
     * 判断验证码
     *
     * @param string $captcha_id 验证码ID
     * @param string $code 验证码
     * @param bool $clear 是否清理
     * @return void
     */
    public function checkCaptcha($captcha_id, $code, $clear = true)
    {
        $key = Constant::CAPTCHA_NAME . $captcha_id;
        $d = Cache::get($key);
        if ($clear) {
            Cache::delete($key);
        }
        return $d && $d == $code;
    }

    /**
     * 发送邮件验证码
     *
     * @param string $email 收件人
     * @return void
     */
    public function sendEmailCaptcha($email)
    {
        $send_time = Cache::get(Constant::CAPTCHA_NAME . '_time_' . $email);
        if ($send_time && $send_time + 60 > time()) {
            return false;
        }
        $code = rand(100000, 999999);
        $web = AuthService::getInstance()->getCurrentWeb();
        $name = isset($web['name']) && !empty($web['name']) ? $web['name'] : '系统通知';
        $res = MailService::getInstance()->send($email, $name, '验证码通知', "尊敬的用户,您的验证码为{$code},此验证码十分钟内有效,请勿泄露!");
        if ($res) {
            Cache::set(Constant::CAPTCHA_NAME . $email, $code, Constant::CAPTCHA_TIME);
            Cache::set(Constant::CAPTCHA_NAME . '_time_' . $email, time(), Constant::CAPTCHA_TIME);
            return true;
        }
        return false;
    }

    /**
     * 发送短信验证码
     *
     * @param string $phone 手机号
     * @return void
     */
    public function sendSmsCaptcha($phone)
    {
        $send_time = Cache::get(Constant::CAPTCHA_NAME . '_time_' . $phone);
        if ($send_time && $send_time + 60 > time()) {
            return false;
        }
        $code = rand(100000, 999999);
        $web = AuthService::getInstance()->getCurrentWeb();
        $res = SmsService::getInstance()->sendCaptcha($phone, $code);
        if ($res) {
            Cache::set(Constant::CAPTCHA_NAME . $phone, $code, Constant::CAPTCHA_TIME);
            Cache::set(Constant::CAPTCHA_NAME . '_time_' . $phone, time(), Constant::CAPTCHA_TIME);
            return true;
        }
        return false;
    }

    /**
     * 生成二维码
     *
     * @param string $qrcode_id 二维码ID
     * @return void
     */
    public function genQrCode($qrcode_id = '')
    {
        $key = Constant::CAPTCHA_NAME . $qrcode_id;
        $data = Cache::get($key);
        $gen = false;
        if (!$data || !isset($data['code']) || !isset($data['sig'])) {
            $gen = true;
        }
        $login = new UinLogin();
        if (!$gen) {
            $d = $login->qrlogin3rd(377, 716027613, $data['sig']);
            //二维码失效,重新生成
            if ($d['saveOK'] == 1) {
                $gen = true;
            }
        }
        if ($gen) {
            $data = $login->getqrpic3rd(377, 716027613);
            if ($data['saveOK'] != 0) {
                return $this->error("生成二维码失败");
            }
            Cache::set($key, array('code' => $data['qrcode'], 'sig' => $data['qrsig']), Constant::CAPTCHA_TIME);
            return $data['qrcode'];
        }
        return $data['code'];
    }

    /**
     * 验证二维码
     *
     * @param string $qrcode_id 二维码ID
     * @param bool $clear 是否清理
     * @return void
     */
    public function checkQrCode($qrcode_id = '', $clear = false)
    {
        $key = Constant::CAPTCHA_NAME . $qrcode_id;
        $data = Cache::get($key);
        if (!$data || !isset($data['sig'])) {
            return $this->error('获取二维码信息失败');
        }
        if ($clear) {
            Cache::delete($key);
        }
        $login = new UinLogin();
        $data = $login->qrlogin3rd(377, 716027613, $data['sig']);
        if ($data['saveOK'] == 1 || $data['saveOK'] == 6) {
            return array('code' => -1, 'message' => $data['msg']); //二维码失效
        }
        if ($data['saveOK'] == 2 || $data['saveOK'] == 3) {
            return array('code' => 0, 'message' => $data['msg']); //二维码正常
        }
        return array('code' => 1, 'message' => $data['msg'], 'data' => array(
            'uin' => $data['uin'],
            'nick_name' => $data['nickname'],
        )); //扫码成功
    }
}
