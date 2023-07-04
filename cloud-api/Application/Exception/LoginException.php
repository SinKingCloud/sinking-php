<?php

namespace app\Exception;

use app\Base\BaseException;
use app\Constant\Config as Constant;
use Systems\Config;

/**
 * 未登陆异常
 */
class LoginException extends BaseException
{
    /**
     * 构造参数
     */
    public function __construct()
    {
        parent::__construct('请先登陆账户', 401, Config::get(Constant::REQUEST_ID));
    }
}
