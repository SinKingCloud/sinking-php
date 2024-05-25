<?php

namespace app\Model;

use app\Base\BaseModel;

class Domain extends BaseModel
{
    protected $name = 'domains'; //表名

    #状态
    const STATUS_NORMAL = 0; //状态正常
    const STATUS_ERROR = 1; //状态异常

    #域名
    const TYPE_SYS = 0; //系统域名
    const TYPE_USER = 1; //用户域名
}
