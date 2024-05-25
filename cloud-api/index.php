<?php
/*
* Title:sinking-php开发框架
* Project:入口文件
* Author:流逝中沉沦
* QQ：1178710004
*/
//设置时区
date_default_timezone_set('Asia/Shanghai');
//定义应用目录
define('APP_PATH', __DIR__ . '/Application/');
//定义框架目录
define('SYSTEM_PATH', __DIR__ . '/Core/');
//加载框架引导文件
require SYSTEM_PATH . '/App.php';
//启动框架
App::start();
