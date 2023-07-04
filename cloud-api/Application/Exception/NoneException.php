<?php

namespace app\Exception;

use app\Base\BaseException;
use app\Constant\Config as Constant;
use Systems\Config;

/**
 * 异常截断空返回
 */
class NoneException extends BaseException
{
    /**
     * 错误回调
     *
     * @return void
     */
    public function handle()
    {
        return '';
    }
}
