<?php

namespace app\Service;

use app\Base\BaseService;
use app\Constant\Config as ConstantConfig;
use app\Model\RequestLog;
use Systems\Config;
use Systems\Request;
use Systems\Util;

class RequestLogService extends BaseService
{
    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = RequestLog::getClass(); //兼容php5.4
        $this->model = new $class();
    }

    /**
     * 记录日志
     *
     * @param integer $type 类型
     * @param string $title 标题
     * @param string $content 内容
     * @return void
     */
    public function log($request_time = 0, $response_time = 0)
    {
        if ($request_time == 0) {
            $request_time = Config::get('request_time');
        }
        if ($response_time == 0) {
            $response_time = Config::get('response_time');
        }
        $request_id = Config::get(ConstantConfig::REQUEST_ID);
        $request_ip = Util::getIP();
        $data = array(
            'request_id' => $request_id,
            'request_ip' => $request_ip,
            'request_url' => Request::url(),
            'request_method' => Request::method(),
            'request_header' => Util::jsonEncode(Request::headers()),
            'request_body' => file_get_contents("php://input"),
            'request_time' => date("Y-m-d H:i:s", $request_time),
            'response_body' => ob_get_contents(),
            'response_time' => date("Y-m-d H:i:s", $response_time),
        );
        return $this->create($data);
    }
}
