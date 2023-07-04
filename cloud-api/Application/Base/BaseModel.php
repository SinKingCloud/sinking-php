<?php

/**
 * 基础model
 */

namespace app\Base;

use Systems\Model;

class BaseModel extends Model
{
    protected $id = "id"; //主键ID

    /**
     * 更新前
     */
    public function updateBefore($where, $data = array())
    {
        $data['update_time'] = date("Y-m-d H:i:s");
        return $data;
    }

    /**
     * 创建前
     */
    public function createBefore($data = array())
    {
        $data['create_time'] = date("Y-m-d H:i:s");
        return $data;
    }

    /**
     * 获取model类名(兼容php5.4写法)
     */
    public static function getClass()
    {
        return get_called_class();
    }
}
