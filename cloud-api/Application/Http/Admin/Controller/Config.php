<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Admin\Controller;

use app\Constant\Config as Constant;
use app\Model\Log;
use app\Model\Web;
use app\Service\AuthService;
use app\Service\ConfigService;
use app\Service\LogService;
use app\Service\SettingService;
use app\Service\WebService;
use Systems\Request;

class Config extends Common
{
    /**
     * 获取网站信息
     *
     * @return void
     */
    public function getWeb()
    {
        $web = AuthService::getInstance()->getCurrentWeb();
        return $this->success('获取成功', $web);
    }

    /**
     * 获取域名信息
     *
     * @return void
     */
    public function getDomain()
    {
        $config = ConfigService::getInstance();
        return $this->success('获取成功', array(
            Constant::SYSTEM_DOMAINS => explode('|', $config->get(Constant::SYSTEM_DOMAINS)),
            Constant::SYSTEM_DOMAIN_RESOLVE => $config->get(Constant::SYSTEM_DOMAIN_RESOLVE),
            Constant::SYSTEM_DOMAIN_NUM => $config->get(Constant::SYSTEM_DOMAIN_NUM),
        ));
    }

    /**
     * 获取客服信息
     *
     * @return array
     */
    public function getContact()
    {
        $web = AuthService::getInstance()->getCurrentWeb();
        $set = SettingService::getInstance();
        return $this->success('获取成功', array(
            Constant::WEB_CONTACT_ONE => $set->getWeb($web['id'], Constant::WEB_CONTACT_ONE),
            Constant::WEB_CONTACT_TWO => $set->getWeb($web['id'], Constant::WEB_CONTACT_TWO),
            Constant::WEB_CONTACT_THREE => $set->getWeb($web['id'], Constant::WEB_CONTACT_THREE),
            Constant::WEB_CONTACT_FOUR => $set->getWeb($web['id'], Constant::WEB_CONTACT_FOUR),
        ));
    }

    /**
     * 获取通知信息
     *
     * @return array
     */
    public function getNotice()
    {
        $web = AuthService::getInstance()->getCurrentWeb();
        $set = SettingService::getInstance();
        return $this->success('获取成功', array(
            Constant::WEB_NOTICE_INDEX => $set->getWeb($web['id'], Constant::WEB_NOTICE_INDEX),
            Constant::WEB_NOTICE_SHOP => $set->getWeb($web['id'], Constant::WEB_NOTICE_SHOP),
            Constant::WEB_NOTICE_ADMIN => $set->getWeb($web['id'], Constant::WEB_NOTICE_ADMIN),
        ));
    }

    /**
     * 获取UI设置
     *
     * @return array
     */
    public function getUi()
    {
        $web = AuthService::getInstance()->getCurrentWeb();
        $set = SettingService::getInstance();
        $index = $set->getWeb($web['id'], Constant::WEB_UI_INDEX);
        $mark = $set->getWeb($web['id'], Constant::WEB_UI_WATERMARK);
        $layout = $set->getWeb($web['id'], Constant::WEB_UI_LAYOUT);
        $theme = $set->getWeb($web['id'], Constant::WEB_UI_THEME);
        $compact = $set->getWeb($web['id'], Constant::WEB_UI_COMPACT);
        $arr = explode(",", Web::INDEX_TEMPLATE);
        $temps = array();
        foreach ($arr as $key) {
            $t = explode(":", $key);
            if (count($t) == 2) {
                $temps[$t[1]] = $t[0];
            }
        }
        return $this->success('获取成功', array(
            'index.templates' => $temps,
            Constant::WEB_UI_INDEX => $index ?: 'index',
            Constant::WEB_UI_LOGO => $set->getWeb($web['id'], Constant::WEB_UI_LOGO),
            Constant::WEB_UI_WATERMARK => $mark == 1 ? "1" : "0",
            Constant::WEB_UI_LAYOUT => $layout == "left" ? "left" : "top",
            Constant::WEB_UI_THEME => $theme == 'dark' ? 'dark' : 'light',
            Constant::WEB_UI_COMPACT => $compact == 1 ? "1" : "0",
        ));
    }

    /**
     * 设置UI
     *
     * @return void
     */
    public function setUi()
    {
        $arr = explode(",", Web::INDEX_TEMPLATE);
        $temps = array();
        foreach ($arr as $key) {
            $t = explode(":", $key);
            if (count($t) == 2) {
                $temps[] = $t[1];
            }
        }
        $data = $this->validate(array(
            array(Constant::WEB_UI_INDEX . '|首页模板', 'require|in:' . implode(",", $temps) . '|default:index'),
            array(Constant::WEB_UI_LOGO . '|系统LOGO', 'require|default:-1'),
            array(Constant::WEB_UI_WATERMARK . '|网站水印', 'require|in:0,1,-1|default:-1'),
            array(Constant::WEB_UI_COMPACT . '|紧凑模式', 'require|in:0,1,-1|default:-1'),
            array(Constant::WEB_UI_LAYOUT . '|网站布局', 'require|in:left,top|default:top'),
            array(Constant::WEB_UI_THEME . '|菜单主题', 'require|in:light,dark|default:light'),
        ), Request::param());
        if ($data) {
            $web = AuthService::getInstance()->getCurrentWeb();
            foreach ($data as $key => $value) {
                if ($value == '-1') $value = '';
                SettingService::getInstance()->setWeb($web['id'], $key, $value);
            }
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改界面', '修改界面设置');
            return $this->success('修改成功');
        }
        return $this->error('修改失败');
    }

    /**
     * 设置客服信息
     *
     * @return void
     */
    public function setContact()
    {
        $data = $this->validate(array(
            array(Constant::WEB_CONTACT_ONE . '|客服1号', 'require'),
            array(Constant::WEB_CONTACT_TWO . '|客服2号', 'require|default:-1'),
            array(Constant::WEB_CONTACT_THREE . '|客服3号', 'require|default:-1'),
            array(Constant::WEB_CONTACT_FOUR . '|客服4号', 'require|default:-1'),
        ), Request::param());
        if ($data) {
            $web = AuthService::getInstance()->getCurrentWeb();
            foreach ($data as $key => $value) {
                if ($value == '-1') $value = '';
                SettingService::getInstance()->setWeb($web['id'], $key, $value);
            }
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改客服', '修改客服信息');
            return $this->success('修改成功');
        }
        return $this->error('修改失败');
    }

    /**
     * 设置客服信息
     *
     * @return void
     */
    public function setNotice()
    {
        $data = $this->validate(array(
            array(Constant::WEB_NOTICE_INDEX . '|首页公告', 'require|default:-1'),
            array(Constant::WEB_NOTICE_SHOP . '|商城公告', 'require|default:-1'),
            array(Constant::WEB_NOTICE_ADMIN . '|分站公告', 'require|default:-1'),
        ), Request::param());
        if ($data) {
            $web = AuthService::getInstance()->getCurrentWeb();
            foreach ($data as $key => $value) {
                if ($value == '-1') $value = '';
                SettingService::getInstance()->setWeb($web['id'], $key, $value);
            }
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改通知', '修改通知信息');
            return $this->success('修改成功');
        }
        return $this->error('修改失败');
    }

    /**
     * 设置网站信息
     *
     * @return void
     */
    public function setWeb()
    {
        $data = $this->validate(array(
            array('name|名称', 'require'),
            array('title|标题', 'require'),
            array('keywords|关键词', 'require'),
            array('description|网站描述', 'require'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        if (WebService::getInstance()->update($web['id'], $data)) {
            WebService::getInstance()->clear($web['id']);
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改网站', '修改网站信息');
            return $this->success('修改成功');
        }
        return $this->error('修改失败');
    }
}
