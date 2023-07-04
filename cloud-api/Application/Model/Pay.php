<?php

namespace app\Model;

use app\Base\BaseModel;

class Pay extends BaseModel
{
    protected $name = 'pays'; //表名

    #类型
    const TYPE_ADD = 0; //增加
    const TYPE_COST = 1; //减少

    #名称
    const TITLE_RECHARGE = "在线充值";
    const TITLE_ORDER = "在线下单";
    const TITLE_CASH = "申请提现";
    const TITLE_COST = "销售提成";
    const TITLE_COST_USER = "下级提成";
    const TITLE_MONEY_UP = "上级加款";
    const TITLE_MONEY_LOW = "下级加款";
}
