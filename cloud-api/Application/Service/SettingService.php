<?php

namespace app\Service;

use app\Base\BaseService;
use app\Constant\Cache as Constant;
use app\Constant\Lock;
use app\Model\Setting;
use Systems\Cache;

class SettingService extends BaseService
{
    private $config = array(); //配置内容

    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = Setting::getClass();//兼容php5.4
        $this->model = new $class();
    }

    /**
     * 获取配置(缓存)
     *
     * @param string $type 配置类型
     * @param string $key 配置名称
     * @return void
     */
    public function getConf($type, $key = '')
    {
        return Cache::remember(Constant::SYSTEM_SETTING_NAME . $type, function () use ($type, $key) {
            return Setting::get($type, $key);
        }, Constant::SYSTEM_SETTING_TIME);
    }

    /**
     * 获取配置
     *
     * @param string $type 配置类型
     * @param string $key 配置名称
     * @return void
     */
    public function get($type, $key = '')
    {
        if (!isset($this->config[$type]) || $this->config[$type] == null) {
            $this->config[$type] = $this->getConf($type);
        }
        if ($key) {
            return isset($this->config[$type][$key]) ? $this->config[$type][$key] : null;
        }
        return $this->config[$type];
    }

    /**
     * 设置配置
     *
     * @param string $type 配置类型
     * @param string $key 配置名称
     * @param string $key 配置内容
     * @return void
     */
    public function set($type, $key, $value)
    {
        $res = false;
        //设置并发锁,防止重复写入
        Cache::lock(Lock::SYSTEM_SETTING_SET . $key, function () use ($type, $key, $value, &$res) {
            //处理业务
            $res = Setting::set($type, $key, $value);
        }, true);
        if ($res) {
            $this->clear($type);
        }
        return $res;
    }

    /**
     * 清理缓存
     *
     * @return void
     */
    public function clear($type)
    {
        $res = Cache::delete(Constant::SYSTEM_SETTING_NAME . $type);
        if ($res) {
            $this->config[$type] = null;
        }
        return $res;
    }

    /**
     * 获取用户配置
     *
     * @param int $user_id 用户ID
     * @param string $key 配置名称
     * @return void
     */
    public function getUser($user_id, $key = '')
    {
        return $this->get('User-' . $user_id, $key);
    }

    /**
     * 修改用户配置
     *
     * @param int $user_id 用户ID
     * @param string $key 配置名称
     * @param string $value 配置内容
     * @return void
     */
    public function setUser($user_id,  $key, $value = '')
    {
        return $this->set('User-' . $user_id, $key, $value);
    }

    /**
     * 获取站点配置
     *
     * @param int $web_id 站点ID
     * @param string $key 配置名称
     * @return void
     */
    public function getWeb($web_id, $key = '')
    {
        return $this->get('Web-' . $web_id, $key);
    }

    /**
     * 修改站点配置
     *
     * @param int $web_id 站点ID
     * @param string $key 配置名称
     * @param string $value 配置内容
     * @return void
     */
    public function setWeb($web_id, $key, $value = '')
    {
        return $this->set('Web-' . $web_id, $key, $value);
    }
}
