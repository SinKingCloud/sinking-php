<?php

/**
 * 基础controller
 */

namespace app\Base;

use Systems\Config;
use Systems\Controller;
use app\Constant\Config as Constant;
use app\Exception\NoneException;
use app\Service\ConfigService;
use app\Service\RequestLogService;
use Systems\Util;
use Systems\Validate;

class BaseController extends Controller
{
    private $request_id; //请求ID

    /**
     * 构造参数
     */
    public function __construct()
    {
        parent::__construct();
        $this->setConfig();
        $this->getRequestId();
    }

    /**
     * 销毁
     */
    public function __destruct()
    {
        $config = ConfigService::getInstance();
        if ($config->get(Constant::SYSTEM_REQUEST_LOG) == 1) {
            Config::set('response_time', time());
            RequestLogService::getInstance()->log();
        }
    }

    /**
     * 设置配置
     *
     * @return void
     */
    private function setConfig()
    {
        $config = ConfigService::getInstance();
        Config::set(Constant::IS_PROXY, $config->get(Constant::SYSTEM_IS_PROXY) == 1); //是否使用cdn
        Config::set(Constant::IS_DEBUG, $config->get(Constant::SYSTEM_DEBUG) == 1); //是否开启debug
        Config::set('request_time', time());
    }

    /*
	* 获取请求ID
	*/
    protected function getRequestId()
    {
        if (!$this->request_id) {
            $this->request_id = Util::getUuid();
            Config::set(Constant::REQUEST_ID, $this->request_id);
        }
        return $this->request_id;
    }

    /**
     * 控制器执行前
     *
     * @param string $action 执行方法名称
     * @param array $value 方法入参
     * @return void
     */
    public function beforeAction($action, $value)
    {

        header('Access-Control-Allow-Origin:*');
        header("Access-Control-Allow-Headers:*");
        header('Access-Control-Allow-Methods:*');
        header('Access-Control-Expose-Headers:*');
        if (strtoupper($_SERVER['REQUEST_METHOD']) == 'OPTIONS') {
            throw new NoneException();
        }
    }

    /**
     * 控制器执行后
     *
     * @param string $action 执行方法名称
     * @param array $value 方法入参
     * @return void
     */
    public function afterAction($action, $value)
    {
    }

    /**
     * 成功提示
     *
     * @param string $message 消息
     * @param array $data 内容
     * @return array 响应数据
     */
    public function success($message = 'success', $data = array())
    {
        return array(
            'code' => 200,
            'message' => $message,
            'data' => $data,
            'request_id' => $this->request_id,
        );
    }

    /**
     * 异常提示
     *
     * @param string $message 消息
     * @param array $data 内容
     * @return array 响应数据
     */
    public function error($message = 'error', $data = array())
    {
        return array(
            'code' => 500,
            'message' => $message,
            'data' => $data,
            'request_id' => $this->request_id,
        );
    }

    /**
     * 构造参数
     *
     * @param array $rules 规则验证
     * @param array $data 验证数据
     * @return array 响应数据
     */
    protected function validate($rules = array(), $data = array())
    {
        $vali = new Validate($rules);
        if (!$vali->validate($data)) {
            throw new \app\Exception\ValidateException($vali->getError());
        }
        return $vali->getData();
    }


    /**
     * 重定向网址
     *
     * @param string $url
     * @return void
     */
    protected function redirect($url = '')
    {
        header("Location: $url");
        throw new NoneException();
    }
}
