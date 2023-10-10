<?php

namespace app\Exception;

use app\Base\BaseException;

/**
 * 异常截断空返回
 */
class NoneException extends BaseException
{
    /**
     * 构造参数
     */
    public function __construct()
    {
    }
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
