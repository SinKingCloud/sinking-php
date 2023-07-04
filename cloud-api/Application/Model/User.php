<?php

namespace app\Model;

use app\Base\BaseModel;

class User extends BaseModel
{
    protected $name = 'users'; //表名

    #状态
    const STATUS_NORMAL = 0; //状态正常
    const STATUS_ERROR = 1; //状态异常

    /**
     * 查询数据格式化
     */
    public function selectDataFormat($data = array())
    {
        foreach ($data as $key => $value) {
            if (isset($value['login_token'])) {
                $data[$key]['login_token'] = json_decode($value['login_token'], true);
            }
        }
        return $data;
    }
}
