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
use app\Service\ConfigService;
use app\Service\LogService;
use app\Service\MailService;
use app\Service\SmsService;
use Systems\Request;

class Config extends Common
{

    /**
     * 配置列表
     *
     * @return void
     */
    public function lists()
    {
        $page = Request::input(Input::PAGE, 1);
        $page_size = Request::input(Input::PAGE_SIZE, 20);
        $data = $this->validate(array(
            array('pid|父级ID', 'omitempty|number'),
            array('key|配置标识', 'omitempty'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,sort,create_time,update_time'),
            array('order_by_type|排序类型', 'omitempty|default:asc|in:desc,asc'),
        ), Request::param());
        return $this->success('获取成功', ConfigService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size));
    }

    /**
     * 批量更新配置
     *
     * @return void
     */
    public function updates()
    {
        $data = Request::param();
        if (empty($data)) {
            return $this->error('参数验证失败');
        }
        foreach ($data as $key => $value) {
            ConfigService::getInstance()->set($key, $value);
        }
        LogService::getInstance()->add(Log::TYPE_UPDATE, '修改设置', '修改系统设置');
        return $this->success('修改成功');
    }

    /**
     * 测试短信
     *
     * @return void
     */
    public function test_sms()
    {
        $data = $this->validate(array(
            array('phone|收信手机号', 'require|number|length:11'),
        ), Request::param());
        LogService::getInstance()->add(Log::TYPE_LOOK, '测试短信', '测试短信设置');
        $obj = SmsService::getInstance();
        if ($obj->sendCaptcha($data['phone'], rand(100000, 999999))) {
            return $this->success('短信发送成功');
        } else {
            return $this->error('短信发送失败,原因:' . $obj->getError());
        }
    }

    /**
     * 测试邮箱
     *
     * @return void
     */
    public function test_email()
    {
        $data = $this->validate(array(
            array('email|收信邮箱', 'require|email'),
        ), Request::param());
        LogService::getInstance()->add(Log::TYPE_LOOK, '测试邮箱', '测试邮箱设置');
        if (MailService::getInstance()->send($data['email'], '系统通知', '测试发信', '这是一条测试邮件,如果您看到此邮件,表明您的发信配置可用。')) {
            return $this->success('邮件发送成功');
        } else {
            return $this->error('邮件发送失败');
        }
    }

    /**
     * 测试云端
     *
     * @return void
     */
    public function test_cloud()
    {
        $data = $this->validate(array(
            array('id|APPID', 'require|number|default:0'),
            array('key|APPKEY', 'require|length:32'),
        ), Request::param());
        $info = \Plugins\SinKingCloud\App::getInstance()->setAppId($data['id'])->setAppKey($data['key'])->getAppInfo();
        if (!$info) {
            return $this->error("连接云端失败");
        }
        return $this->success("连接云端成功", $info);
    }
}
