<?php

/**
 * 并发锁常量
 */

namespace app\Constant;

class Lock
{
    const SYSTEM_CONFIG_SET = "system_config_set"; //系统配置修改并发锁

    const SYSTEM_SETTING_SET = "system_setting_set"; //其他配置修改并发锁

    const SYSTEM_DOMAIN_SET = "system_domain_set"; //域名修改并发锁

    const ADD_USER = "add_user"; //添加用户并发锁

    const ORDER_STATUS = 'order_status'; //订单状态并发锁

    const ORDER_PAY = 'order_pay'; //订单支付并发锁
}
