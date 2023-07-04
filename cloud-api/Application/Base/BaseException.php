<?php

/**
 * 基础exception
 */

namespace app\Base;

use Systems\Exception;

class BaseException extends Exception
{
    protected $request_id; //请求ID

    /**
     * 构造参数
     *
     * @param string $message 错误信息
     * @param integer $code 错误码
     * @param string $request_id 请求ID
     */
    public function __construct($message,  $code = 0,  $request_id = '')
    {
        parent::__construct($message, $code);
        $this->request_id = $request_id;
    }

    /**
     * 默认回调
     *
     * @return void
     */
    public function handle()
    {
        return array(
            'code' => $this->code,
            'message' => $this->message,
            'data' => array(),
            'request_id' => $this->request_id
        );
    }
}
