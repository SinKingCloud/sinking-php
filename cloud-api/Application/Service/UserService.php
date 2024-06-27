<?php

namespace app\Service;

use app\Base\BaseService;
use app\Constant\Cache as Constant;
use app\Constant\Lock;
use app\Model\User;
use Systems\Cache;
use Systems\Util;

class UserService extends BaseService
{
    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = User::getClass(); //兼容php5.4
        $this->model = new $class();
    }

    /**
     * 获取用户
     *
     * @param mixed $user_id 用户标识
     * @param boolean $refresh 是否刷新缓存
     * @return void
     */
    public function get($user_id = 0, $refresh = false)
    {
        if (empty($user_id)) {
            return false;
        }
        if ($refresh) {
            $this->clear($user_id);
        }
        $key = 'id';
        if (!is_numeric($user_id)) {
            $key = 'account';
        }
        return Cache::remember(Constant::USER_INFO_NAME . $user_id, function () use ($user_id, $key) {
            return User::where(array($key => $user_id))->find();
        }, Constant::USER_INFO_TIME);
    }

    /**
     * 清理用户缓存
     *
     * @param integer $user_id 用户ID
     * @return void
     */
    public function clear($user_id = 0)
    {
        return Cache::delete(Constant::USER_INFO_NAME . $user_id);
    }

    /**
     * 设置登陆token
     *
     * @param integer $user_id 用户ID
     * @param string $token 登陆token
     * @param string $device 登陆设备
     * @return void
     */
    public function setLoginToken($user_id, $token, $device = 'web')
    {
        $user = $this->get($user_id, true);
        if (!$user) {
            return false;
        }
        if (!isset($user['login_token']) || !is_array($user['login_token'])) {
            $user['login_token'] = array();
        }
        $user['login_token'][$device] = $token;
        $login_token = Util::jsonEncode($user['login_token']);
        if (User::where(array('id' => $user_id))->update(array(
            'login_token' => $login_token,
            'login_time' => date("Y-m-d H:i:s"),
            'login_ip' => Util::getIP(),
        ))) {
            $this->clear($user_id);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 删除登陆token
     *
     * @param integer $user_id 用户ID
     * @param string $device 登陆设备
     * @return void
     */
    public function deleteLoginToken($user_id, $device = 'web')
    {
        return $this->setLoginToken($user_id, '', $device);
    }

    /**
     * 添加用户
     *
     * @param array $data 用户信息
     * @return void
     */
    public function addUser($data = array())
    {
        $obj = &$this;
        //并发锁
        Cache::lock(Lock::ADD_USER, function () use (&$obj, $data) {
            $obj->error();
            //邮箱 手机号 账号必填一个
            if ((!isset($data['email']) || empty($data['email'])) &&  (!isset($data['phone']) || empty($data['phone'])) && (!isset($data['account']) || empty($data['account']))) {
                return $obj->error("登录{账号,邮箱,手机号}不能同时为空");
            }
            //账号可自主设置
            if (isset($data['account']) && $obj->count(array('account' => $data['account']))) {
                return $obj->error("该用户名已被占用");
            }
            if (isset($data['phone']) && $obj->count(array('phone' => $data['phone']))) {
                return $obj->error("该手机号已被占用");
            }
            if (isset($data['email']) && $obj->count(array('email' => $data['email']))) {
                return $obj->error("该邮箱已被占用");
            }
            //未设置密码则随机生成一个密码
            if (!isset($data['password']) || empty($data['password'])) {
                $data['password'] = time() . rand(100000, 999999) . rand(100000, 999999) . rand(100000, 999999);
            }
            $u = array(
                'web_id' => isset($data['web_id']) && intval($data['web_id']) > 0 ? intval($data['web_id']) : 1,
                'password' => Util::getPassword($data['password']),
                'nick_name' => isset($data['nick_name']) && !empty($data['nick_name']) ? $data['nick_name'] : '默认昵称',
                'avatar' => 'https://q1.qlogo.cn/g?b=qq&nk=10000&s=100&t=20190225',
                'status' => 0,
            );
            if(isset($data['email']) && $data['email']){
                $u['email'] = $data['email'];
            }
            if(isset($data['account']) && $data['account']){
                $u['account'] = $data['account'];
            }
            if(isset($data['phone']) && $data['phone']){
                $u['phone'] = $data['phone'];
            }
            if ($obj->create($u)) {
                $user = $obj->find(array(
                    'account' => $u['account'],
                    'phone' => $u['phone'],
                    'email' => $u['email']
                ));
                if ($user) {
                    //写入用户统计
                    $inc_data = array('user_num' => '+1');
                    CountService::getInstance()->set(0, 0, $inc_data); //系统统计
                    CountService::getInstance()->set($user['web_id'], 0, $inc_data); //站点统计
                }
                return true;
            } else {
                return $obj->error("添加用户失败,请联系管理员");
            }
        }, true);
        return !$obj->error;
    }

    /**
     * 获取网站用户ID
     *
     * @param mixed $web_id 网站ID
     * @return void
     */
    public function getUserIds($web_id)
    {
        $ids = array();
        $where = array();
        if (is_array($web_id)) {
            $where[] = array('web_id', $web_id, 'in');
        } else if (is_numeric($web_id)) {
            $where['web_id'] = $web_id;
        }
        $users = $this->select($where,  'id',  'asc',   'id', -1);
        foreach ($users as $user) {
            $ids[] = $user['id'];
        }
        return $ids;
    }

    /**
     * 修改用户密码
     *
     * @param mixed $user_id 用户ID
     * @param string $pwd 新密码
     * @return void
     */
    public function changePassword($user_id, $pwd = '123456')
    {
        $key = 'id';
        if (!is_numeric($user_id)) {
            $key = 'account';
        }
        return $this->update(array($key => $user_id), array('password' => Util::getPassword($pwd)));
    }

    /**
     * 查询数据
     *
     * @param array $where 查询条件
     * @param string $order_field 排序字段
     * @param string $order_type 排序方式
     * @param integer $page 页码
     * @param integer $page_size 每页数量
     * @param string $field 查询字段
     * @return void 数据
     */
    public function page($where = array(),  $order_field = 'id',  $order_type = 'desc',  $page = 1, $page_size = 20, $field = '*')
    {
        $where_map = array();
        if (isset($where['web_id']) && $where['web_id'] > 0) {
            $where_map['web_id'] = $where['web_id'];
        }
        if (isset($where['account']) && $where['account']) {
            $where_map['account'] = $where['account'];
        }
        if (isset($where['email']) && $where['email']) {
            $where_map['email'] = $where['email'];
        }
        if (isset($where['phone']) && $where['phone']) {
            $where_map['phone'] = $where['phone'];
        }
        if (isset($where['status']) && $where['status'] >= 0) {
            $where_map['status'] = $where['status'];
        }
        if (isset($where['login_ip']) && $where['login_ip']) {
            $where_map['login_ip'] = $where['login_ip'];
        }
        if (isset($where['login_time_start']) && $where['login_time_start']) {
            $where_map[] = array('login_time', $where['login_time_start'], '>=', 'and');
        }
        if (isset($where['login_time_end']) && $where['login_time_end']) {
            $where_map[] = array('login_time', $where['login_time_end'], '<=', 'and');
        }
        if (isset($where['create_time_start']) && $where['create_time_start']) {
            $where_map[] = array('create_time', $where['create_time_start'], '>=', 'and');
        }
        if (isset($where['create_time_end']) && $where['create_time_end']) {
            $where_map[] = array('create_time', $where['create_time_end'], '<=', 'and');
        }
        if (isset($where['update_time_start']) && $where['update_time_start']) {
            $where_map[] = array('update_time', $where['update_time_start'], '>=', 'and');
        }
        if (isset($where['update_time_end']) && $where['update_time_end']) {
            $where_map[] = array('update_time', $where['update_time_end'], '<=', 'and');
        }
        $field = 'id,web_id,account,nick_name,avatar,phone,email,money,status,login_ip,login_time,create_time,update_time';
        return parent::page($where_map, $order_field, $order_type, $page, $page_size, $field);
    }
}
