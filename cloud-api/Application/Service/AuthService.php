<?php

namespace app\Service;

use app\Base\BaseService;
use app\Constant\Input;
use app\Model\Domain;
use app\Model\User;
use app\Model\Web;
use Systems\Jwt;
use Systems\Request;
use Systems\Util;

class AuthService extends BaseService
{
    private $current_user = array(); //登录用户信息

    private $current_web = array(); //当前站点信息

    /**
     * 加载用户信息
     *
     * @return void
     */
    private function loadUser()
    {
        $header = Request::headers();
        $token = $header[Input::HEADER_TOKEN]; //登陆token
        $device = $header[Input::HEADER_DEVICE]; //登陆设备
        if (!$token || !$device) return false;
        $user = Jwt::verifyToken($token);
        if (!$user || $user['device'] != $device) return false;
        $u = UserService::getInstance()->get($user['id']);
        if (!$u || !isset($u['login_token'])) return false;
        if (!$u['login_token'][$device] || $user['token'] != $u['login_token'][$device]) return false;
        $this->current_user = $u;
    }

    /**
     * 加载站点信息
     *
     * @return void
     */
    private function loadWeb()
    {
        $domain = Util::getHost(false);
        if (!$domain) return false;
        $domain_info = DomainService::getInstance()->get($domain);
        if (!$domain_info || $domain_info['status'] != Domain::STATUS_NORMAL) return false;
        $web_info = WebService::getInstance()->get($domain_info['web_id']);
        if (!$web_info) return false;
        $this->current_web = $web_info;
    }

    /**
     * 生成登陆token
     *
     * @param integer $user_id 用户ID
     * @param string $device 登陆设备
     * @return void
     */
    public function genLoginToken($user_id = 0, $device = 'web')
    {
        $token = md5(time() . rand(100000, 999999));
        if (!UserService::getInstance()->setLoginToken($user_id, $token, $device)) {
            return false;
        }
        $payload = array(
            'id' => $user_id,
            'device' => $device,
            'token' => $token,
            'login_time' => date("Y-m-d H:i:s"),
            'login_ip' => Util::getIP(),
        );
        return Jwt::genToken($payload);
    }

    /**
     * 判断是否登录
     *
     * @return void
     */
    public function checkUser()
    {
        $user = $this->getCurrentUser();
        if (!$user || $user['status'] != User::STATUS_NORMAL) {
            throw new \app\Exception\LoginException();
        }
        return $user;
    }

    /**
     * 判断站点是否开通
     *
     * @return void
     */
    public function checkWeb()
    {
        $web = $this->getCurrentWeb();
        $datetime = new \DateTime($web['expire_time']);
        if (!$web || ($web['web_id'] != 0 && ($web['status'] != Web::STATUS_NORMAL || $datetime->format('U') < time()))) {
            throw new \app\Exception\NotOpenException();
        }
        return $web;
    }

    /**
     * 判断用户是否属于此站点
     *
     * @return void
     */
    public function checkUserInWeb($user = array())
    {
        $web = $this->checkWeb();
        if (empty($user)) {
            $user = $this->checkUser();
        }
        if ($user['web_id'] != $web['id']) {
            //不属于此站点，抛出异常
            $domain = DomainService::getInstance()->get($user['web_id'], false, Domain::STATUS_NORMAL);
            throw new \app\Exception\NotInWebException($domain['domain']);
        }
    }

    /**
     * 判断此站点是否为总站
     *
     * @param boolean $exception 是否抛出异常
     * @return void
     */
    public function checkIsMasterWeb($exception = true)
    {
        $web = $this->getCurrentWeb();
        if ($web && $web['web_id'] == 0) {
            return true;
        }
        if ($exception) {
            throw new \app\Exception\NotAllowException();
        }
        return false;
    }

    /**
     * 判断当前登陆用户是否为当前站点站长
     *
     * @param boolean $exception 是否抛出异常
     * @return void
     */
    public function checkIsMasterUser($exception = true)
    {
        $user = $this->getCurrentUser();
        $web = $this->getCurrentWeb();
        if ($user && $web && $user['web_id'] == $web['id'] && $user['id'] == $web['user_id']) {
            return true;
        }
        if ($exception) {
            throw new \app\Exception\NotAllowException();
        }
        return false;
    }

    /**
     * 判断用户是否为站长
     *
     * @param integer $user_id 用户ID
     * @return void
     */
    public function checkUserIsAdmin($user_id = 0)
    {
        return WebService::getInstance()->count(array('user_id' => $user_id)) > 0;
    }

    /**
     * 判断用户是否为总站长
     *
     * @param integer $user_id 用户ID
     * @return void
     */
    public function checkUserIsMaster($user_id = 0)
    {
        $web = WebService::getInstance()->find(array('user_id' => $user_id));
        if (!$web || $web['web_id'] != 0) {
            return false;
        }
        return true;
    }

    /**
     * 判断用户是否为站点下级
     *
     * @param integer $user_id 用户ID
     * @param integer $web_id 站点ID
     * @return void
     */
    public function checkUserIsWebChild($user_id = 0, $web_id = 0)
    {
        if ($web_id != 0) {
            $web = WebService::getInstance()->find($web_id);
        } else {
            $web = $this->getCurrentWeb();
        }
        if (!$web) {
            return false;
        }
        $where1 = array('web_id' => $web['id'], 'id' => $user_id);
        $where2 = array('web_id' => $web['id'], 'user_id' => $user_id);
        return UserService::getInstance()->count($where1) > 0 || WebService::getInstance()->count($where2) > 0;
    }

    /**
     * 获取登录用户信息
     *
     * @return void
     */
    public function getCurrentUser()
    {
        if (!$this->current_user) {
            //获取用户信息
            $this->loadUser();
        }
        return $this->current_user;
    }

    /**
     * 获取当前访问站点信息
     *
     * @return void
     */
    public function getCurrentWeb()
    {
        if (!$this->current_web) {
            //获取用户信息
            $this->loadWeb();
        }
        return $this->current_web;
    }
}
