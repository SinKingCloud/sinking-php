<?php

/**
 * 缓存键常量
 */

namespace app\Constant;

class Cache
{
    const SYSTEM_CONFIG_NAME = 'system_config'; //系统配置缓存标识名称
    const SYSTEM_CONFIG_TIME = 600; //系统配置缓存时间(秒)

    const SYSTEM_SETTING_NAME = 'system_setting'; //其他配置缓存标识名称
    const SYSTEM_SETTING_TIME = 600; //其他配置缓存时间(秒)

    const USER_INFO_NAME = 'user_info'; //用户信息缓存标识名称
    const USER_INFO_TIME = 600; //用户信息缓存时间(秒)

    const WEB_INFO_NAME = 'web_info'; //站点信息缓存标识名称
    const WEB_INFO_TIME = 600; //站点信息缓存时间(秒)

    const DOMAIN_INFO_NAME = 'domain_info'; //域名信息缓存标识名称
    const DOMAIN_INFO_TIME = 600; //域名信息缓存时间(秒)

    const DOMAIN_ICP_NAME = 'domain_icp'; //域名备案缓存标识名称
    const DOMAIN_ICP_TIME = 86400; //域名备案缓存时间(秒)

    const CAPTCHA_NAME = 'captcha'; //验证码缓存标识名称
    const CAPTCHA_TIME = 600; //验证码缓存时间(秒)
    
}
