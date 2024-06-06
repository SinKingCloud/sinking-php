<?php

namespace app\Service;

use app\Base\BaseService;
use app\Constant\Config as Constant;
use Plugins\Aliyun\Sms;


class SmsService extends BaseService
{

    /**
     * 发送短信验证码
     * @param string $phone
     * @param int $code
     * @return bool|null
     */
    public function sendCaptcha($phone, $code)
    {
        $config = ConfigService::getInstance();
        $key = $config->get(Constant::SYSTEM_SMS_ALIYUN_KEY);
        if (empty($key)) {
            return $this->error('未配置阿里云发信KEY');
        }
        $secret = $config->get(Constant::SYSTEM_SMS_ALIYUN_SECRET);
        if (empty($secret)) {
            return $this->error('未配置阿里云发信SECRET');
        }
        $template_sign = $config->get(Constant::SYSTEM_SMS_CAPTCHA_SIGN);
        if (empty($template_sign)) {
            return $this->error('未配置阿里云模版签名');
        }
        $template_code = $config->get(Constant::SYSTEM_SMS_CAPTCHA_CODE);
        if (empty($template_code)) {
            return $this->error('未配置阿里云模版CODE');
        }
        $template_var = $config->get(Constant::SYSTEM_SMS_CAPTCHA_VAR);
        if (empty($template_var)) {
            return $this->error('未配置阿里云模版变量');
        }
        $sms = new Sms($key, $secret, $template_sign, $template_code);
        $data = $sms->send($phone, array($template_var => $code));
        if ($data['code'] != 200) {
            return $this->error($data['msg']);
        }
        return true;
    }
}
