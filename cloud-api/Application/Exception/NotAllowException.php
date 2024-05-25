<?php

namespace app\Exception;

use app\Base\BaseException;
use app\Constant\Config as Constant;
use Systems\Config;

/**
 * 无权限异常
 */
class NotAllowException extends BaseException
{
    /**
     * 构造参数
     */
    public function __construct()
    {
        parent::__construct('您的账户权限不足', 403, Config::get(Constant::REQUEST_ID));
    }
}
