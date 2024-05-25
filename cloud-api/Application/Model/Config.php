<?php

namespace app\Model;

use app\Base\BaseModel;

class Config extends BaseModel
{
    protected $name = 'configs'; //表名

    /**
     * 获取配置
     *
     * @param string $key 配置名称
     * @return void
     */
    public static function get($key = '')
    {
        $confs = self::select();
        $map = array();
        foreach ($confs as $conf) {
            $map[$conf['key']] = $conf['value'];
        }
        if (!$key) {
            return $map;
        }
        return isset($map[$key]) ? $map[$key] : array();
    }

    /**
     * 设置配置
     *
     * @param string $key 配置名称
     * @param string $value 配置内容
     * @return void
     */
    public static function set($key, $value = '')
    {
        if (self::where(array('key' => $key))->count() <= 0) {
            return self::create(array(
                'key' => $key,
                'value' => $value
            ));
        } else {
            return self::where(array('key' => $key))->update(array('value' => $value));
        }
    }
}
