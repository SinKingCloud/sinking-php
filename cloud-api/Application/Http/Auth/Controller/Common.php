<?php
/*
* Title:沉沦云MVC开发框架
* Project:Common控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Auth\Controller;

use app\Base\BaseController;
use app\Service\AuthService;

class Common extends BaseController
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
        parent::beforeAction($action, $value);
        AuthService::getInstance()->checkWeb();
    }
}
