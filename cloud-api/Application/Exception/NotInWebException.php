<?php

namespace app\Exception;

use app\Base\BaseException;
use app\Constant\Config as Constant;
use Systems\Config;

/**
 * 用户不属于此站点异常
 */
class NotInWebException extends BaseException
{
    private $url;
    /**
     * 构造参数
     */
    public function __construct($url)
    {
        parent::__construct('您的帐户不属于此站点', 402, Config::get(Constant::REQUEST_ID));
        $this->url = $url;
    }

    /**
     * 错误回调
     *
     * @return void
     */
    public function handle()
    {
        return array(
            'code' => $this->code,
            'message' => $this->message,
            'data' => array(
                'url' => $this->url,
            ),
            'request_id' => $this->request_id
        );
    }
}
