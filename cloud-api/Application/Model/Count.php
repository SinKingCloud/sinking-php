<?php

namespace app\Model;

use app\Base\BaseModel;

class Count extends BaseModel
{
    protected $name = 'counts'; //表名

    #类型
    const TYPE_ALL = 0; //总统计
    const TYPE_DAY = 1; //日统计
    const TYPE_WEEK = 2; //周统计
    const TYPE_MONTH = 3; //月统计
    const TYPE_YEAR = 4; //年统计
    
    #字段
    const FIELD_DATE = 'date'; //日期
    const FIELD_ORDER_NUM = 'order_num'; //订单数量
    const FIELD_ORDER_SUCC_NUM = 'order_succ_num'; //成功订单
    const FIELD_CONS_MONEY = 'consume_money'; //消费金额
    const FIELD_RECH_MONEY = 'recharge_money'; //充值金额
    const FIELD_DEDU_MONEY = 'deduct_money'; //提成金额
    const FIELD_USER_NUM = 'user_num'; //用户数量
    const FIELD_SITE_NUM = 'site_num'; //站点数量
}
