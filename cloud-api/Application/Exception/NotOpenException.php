<?php

namespace app\Exception;

use app\Base\BaseException;
use app\Constant\Config as Constant;
use Systems\Config;

/**
 * 站点未开通异常
 */
class NotOpenException extends BaseException
{
    /**
     * 构造参数
     */
    public function __construct()
    {
        parent::__construct('此站点未开通', 404, Config::get(Constant::REQUEST_ID));
    }
}
