<?php

namespace app\Exception;

use app\Base\BaseException;
use Systems\Config;
use app\Constant\Config as Constant;
use Systems\Util;

/**
 * 参数验证异常
 */
class ValidateException extends BaseException
{
    /**
     * 构造参数
     *
     * @param string $message 异常消息
     */
    public function __construct($message = '参数验证失败')
    {
        $request_id = Config::get(Constant::REQUEST_ID);
        parent::__construct($message, 500, $request_id ? $request_id : Util::getUuid());
    }
}
