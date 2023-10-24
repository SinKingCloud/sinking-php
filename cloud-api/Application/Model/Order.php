<?php

namespace app\Model;

use app\Base\BaseModel;

class Order extends BaseModel
{
    protected $name = 'orders'; //表名

    #支付方式
    const PAY_TYPE_ALI = 0; //支付宝支付
    const PAY_TYPE_WX = 1; //微信支付
    const PAY_TYPE_QQ = 2; //QQ支付
    const PAY_TYPE_MONEY = 3; //余额支付

    #订单类型
    const ORDER_TYPE_RECHARGE = 0; //余额充值
    const ORDER_TYPE_WEB = 1; //开通网站
    const ORDER_TYPE_BUY = 2; //在线下单
    const ORDER_TYPE_REWEB = 3; //网站续期

    #订单状态
    const STATUS_UNPAY = 0; //未支付
    const STATUS_PAYED = 1; //已支付
}
