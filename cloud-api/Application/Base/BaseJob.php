<?php

/**
 * 基础Job
 */

namespace app\Base;

use Systems\Job;

class BaseJob extends Job
{
    protected static $instance = array(); //单例

    /**
     * 获取单例
     *
     * @return void
     */
    public static function getInstance()
    {
        $name =  get_called_class();
        if (!isset(self::$instance[$name])) {
            self::$instance[$name] = new $name();
        }
        return self::$instance[$name];
    }

    /**
     * 获取model类名(兼容php5.4写法)
     */
    public static function getClass()
    {
        return get_called_class();
    }
}
