<?php

namespace app\Model;

use app\Base\BaseModel;

class Cash extends BaseModel
{
    protected $name = 'cashs'; //表名

    #状态
    const STATUS_UNPAY = 0; //未处理
    const STATUS_PAYED = 1; //已处理
}
