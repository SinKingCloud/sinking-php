<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Master\Controller;

use app\Model\Log;
use app\Service\LogService;
use app\Service\MessageService;
use app\Service\UserService;
use app\Service\WebService;
use Systems\Request;

class Message extends Common
{
    /**
     * 发送站内信
     *
     * @return void
     */
    public function create()
    {
        $data = $this->validate(array(
            array('group|发送对象', 'require|in:all,admin,user'),
            array('title|标题', 'require'),
            array('content|内容', 'require'),
        ), Request::param());
        $ids = array();
        if ($data['group'] == 'user' || $data['group'] == 'all') {
            $ids = array_merge($ids, UserService::getInstance()->getUserIds());
        }
        if ($data['group'] == 'admin' || $data['group'] == 'all') {
            $webs = WebService::getInstance()->getSubSites();
            foreach ($webs as $key) {
                $ids[] = $key['user_id'];
            }
        }
        MessageService::getInstance()->send($ids, $data['title'], $data['content']);
        LogService::getInstance()->add(Log::TYPE_CREATE, '发送消息', '发送站内消息');
        return $this->success('消息发送成功');
    }
}
