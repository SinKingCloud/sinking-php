<?php

namespace app\Model;

use app\Base\BaseModel;

class Setting extends BaseModel
{
    protected $name = 'settings'; //表名

    /**
     * 获取配置名称
     *
     * @param string $type 配置类型
     * @param string $key 配置名称
     * @return void
     */
    public static function get($type, $key = '')
    {
        $where = array('type' => $type);
        if ($key) $where['key'] = $key;
        $settings = self::where($where)->select();
        $map = array();
        foreach ($settings as $conf) {
            $map[$conf['key']] = $conf['value'];
        }
        if (!$key) {
            return $map;
        }
        return isset($map[$key]) ? $map[$key] : array();
    }

    /**
     * Undocumented function
     *
     * @param string $type 配置类型
     * @param string $key 配置名称
     * @param string $value 配置内容
     * @return void
     */
    public static function set($type, $key, $value = '')
    {
        $where = array('type' => $type, 'key' => $key);
        if (self::where($where)->count() <= 0) {
            return self::create(array(
                'type' => $type,
                'key' => $key,
                'value' => $value
            ));
        } else {
            return self::where($where)->update(array('value' => $value));
        }
    }
}
