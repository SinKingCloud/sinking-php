<?php

namespace app\Exception;

use app\Base\BaseException;
use app\Constant\Config as Constant;
use Systems\Config;

/**
 * 安装异常返回
 */
class InstallException extends BaseException
{
    /**
     * 错误回调
     *
     * @return void
     */
    public function handle()
    {
        return $this->message;
    }
}
