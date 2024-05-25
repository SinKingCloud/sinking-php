<?php

namespace app\Model;

use app\Base\BaseModel;

class Web extends BaseModel
{
    protected $name = 'webs'; //表名

    #状态
    const STATUS_NORMAL = 0; //状态正常
    const STATUS_ERROR = 1; //状态异常

    #首页模板(使用,分割)
    const INDEX_TEMPLATE = '默认首页:index,直接跳转(屏蔽SEO):location';
}
