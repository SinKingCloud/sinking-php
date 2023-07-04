<?php

namespace app\Service;

use app\Base\BaseService;
use app\Model\Config;
use app\Constant\Cache as Constant;
use app\Constant\Lock;
use Systems\Cache;

class ConfigService extends BaseService
{
    private $config = null; //配置内容

    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = Config::getClass();//兼容php5.4
        $this->model = new $class();
    }

    /**
     * 获取配置
     *
     * @return void
     */
    public function selectAll()
    {
        return Config::get();
    }

    /**
     * 查询所有配置
     *
     * @return void
     */
    public function getConf()
    {
        $obj = &$this;
        return Cache::remember(Constant::SYSTEM_CONFIG_NAME, function () use (&$obj) {
            return $obj->selectAll();
        }, Constant::SYSTEM_CONFIG_TIME);
    }

    /**
     * 清理缓存
     *
     * @return void
     */
    public function clear()
    {
        $res = Cache::delete(Constant::SYSTEM_CONFIG_NAME);
        if ($res) {
            $this->config = null;
        }
        return $res;
    }

    /**
     * 获取缓存内容
     *
     * @param string $key 缓存key
     * @return void
     */
    public function get($key = '')
    {
        if ($this->config == null) {
            $this->config = $this->getConf();
        }
        if ($key) {
            return isset($this->config[$key]) ? $this->config[$key] : null;
        }
        return $this->config;
    }

    /**
     * 设置配置
     *
     * @param string $key 配置名称
     * @param string $value 配置内容
     * @return void
     */
    public function set($key, $value = '')
    {
        $res = false;
        //设置并发锁,防止重复写入
        Cache::lock(Lock::SYSTEM_CONFIG_SET . $key, function () use ($key, $value, &$res) {
            //处理业务
            $res = Config::set($key, $value);
        }, true);
        if ($res) {
            $this->clear();
        }
        return $res;
    }

    /**
     * 查询数据
     *
     * @param array $where 查询条件
     * @param string $order_field 排序字段
     * @param string $order_type 排序方式
     * @param integer $page 页码
     * @param integer $page_size 每页数量 
     * @return void 数据
     */
    public function page($where = array(),  $order_field = 'id',  $order_type = 'desc',  $page = 1, $page_size = 20, $field = '*')
    {
        $where_map = array();
        if (isset($where['pid']) && $where['pid'] > 0) {
            $where_map['pid'] = $where['pid'];
        }
        if (isset($where['key']) && $where['key']) {
            $where_map['key'] = array($where['key'] . '%', 'like', 'and');
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
        $field = 'key,value,update_time,create_time';
        return parent::page($where_map, $order_field, $order_type, $page, $page_size, $field);
    }
}
