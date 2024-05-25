<?php

namespace app\Service;

use app\Base\BaseService;
use app\Constant\Config as Constant;
use Systems\Mailer;

class MailService extends BaseService
{
    /**
     * 发送邮件
     *
     * @param string $to 接收邮箱
     * @param string $name 姓名
     * @param string $title 标题
     * @param string $content 内容
     * @return void
     */
    public function send($to, $name = '系统通知', $title = '系统通知', $content = '')
    {
        $config = ConfigService::getInstance();
        $options = array(
            'smtp_host' => $config->get(Constant::SYSTEM_EMAIL_HOST),
            'smtp_port' => $config->get(Constant::SYSTEM_EMAIL_PORT),
            'user_name' => $config->get(Constant::SYSTEM_EMAIL_USER),
            'password'  => $config->get(Constant::SYSTEM_EMAIL_PWD),
            'isHtml'    => true,
        );
        $m = new Mailer($options);
        $m->enableSSL(true);
        $m->setTo($to);
        $m->setFrom(array('label' => $name, 'address' => $config->get(Constant::SYSTEM_EMAIL_USER)));
        $m->setSubject($title);
        $m->setBody($content);
        return $m->send();
    }
}
