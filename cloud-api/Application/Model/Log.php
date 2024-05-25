<?php

namespace app\Model;

use app\Base\BaseModel;

class Log extends BaseModel
{
    protected $name = 'logs'; //表名

    const TYPE_LOGIN = 0; //登陆
    const TYPE_LOOK = 1; //查看
    const TYPE_DELETE = 2; //删除
    const TYPE_UPDATE = 3; //修改
    const TYPE_CREATE = 4; //创建
}
