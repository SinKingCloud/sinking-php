<?php
/*
* Title:沉沦云MVC开发框架
* Project:Common控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Install\Controller;

use app\Exception\InstallException;
use app\Exception\NoneException;
use Systems\Controller;
use Systems\Validate;

class Common extends Controller
{
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
        }else{
            if (checkInstall(false)) {
                throw new InstallException("当前系统已安装过,如需重新安装,请前往官网重新下载程序安装");
            }
        }
    }

    /**
     * 成功提示
     *
     * @param string $message 消息
     * @param array $data 内容
     * @return void
     */
    public function success($message = 'success', $data = array())
    {
        return array(
            'code' => 200,
            'message' => $message,
            'data' => $data,
        );
    }

    /**
     * 异常提示
     *
     * @param string $message 消息
     * @param array $data 内容
     * @return void
     */
    public function error($message = 'error', $data = array())
    {
        return array(
            'code' => 500,
            'message' => $message,
            'data' => $data,
        );
    }

    /**
     * 构造参数
     *
     * @param array $rules 规则验证
     * @param array $data 验证数据
     * @return void
     */
    protected function validate($rules = array(), $data = array())
    {
        $vali = new Validate($rules);
        if (!$vali->validate($data)) {
            throw new \app\Exception\ValidateException($vali->getError());
        }
        return $vali->getData();
    }
}
