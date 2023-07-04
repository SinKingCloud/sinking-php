<?php
/*
* Title:沉沦云MVC开发框架
* Project:框架配置(此文件配置项可修改但不可删除)
* Author:流逝中沉沦
* QQ：1178710004
*/
return array(
	/*------多应用配置------*/
	'multi_app' => array(
		'open' => true, //是否开启多应用
		'multi_site' => array(
			'open' => false, //是否开启多站点(多应用模式下有效)
			'sites' => array( //多站点域名对应 域名匹配正则表达式=>应用

			),
		),
	),

	/*------控制器配置------*/
	'controller' => array(
		'default_module' => 'index', //默认应用名称
		'default_controller' => 'Index', //默认控制器
		'default_action' => 'index' //默认方法名
	),
	'application_dir' => __DIR__ . '/../../Application/', //默认应用目录
	'cache_dir' => __DIR__ . '/../../Cache/', //默认缓存目录
	'default_namespace' => 'app', //默认命名空间
	'default_http_path' => 'Http', //默认http目录名称
	'default_controller_name' => 'Controller', //默认c层目录名称
	'default_view_name' => 'View', //默认v层目录名称

	/*------DEBUG配置------*/
	'default_debug' => true, //开启DEBUG模式

	/*------logger配置------*/
	'logger' => array(
		'app' => array(
			'open' => false, //开启应用日志监听
			'file_name' => 'app-', //日志名
			'format' => 'Y-m-d', //日志分组
			'path' =>  '/Log/', //保存目录
		),
		'sql' => array(
			'open' => false, //开启sql日志监听
			'file_name' => 'sql-', //日志名
			'format' => 'Y-m-d', //日志分组
			'path' =>  '/Log/', //保存目录
		),
	),

	/*------加载文件配置------*/
	'default_loadfile' => array(
		'common.php'
	), //自动加载文件,以应用目录为基准(不需要则不填写)

	/*------数据库配置------*/
	'database' => array(
		'database_host' => '', //数据库地址
		'database_port' => '', //端口
		'database_user' => '', //数据库账号
		'database_pwd' => '', //数据库密码
		'database_name' => '', //数据库名称
		'database_prefix' => '', //数据库前缀
		'database_charset' => 'utf8mb4', //数据库编码
		'database_heart' => 600, //心跳时间
	),

	/*------路由配置------*/
	'default_route' => array(
		'open' => true, // 路由功能：开启/关闭
		'force' => false, //强制路由： 开启/关闭(开启后未定义路由的url不可访问)
		'file' => 'route.php' //路由文件地址 以应用目录为基准(不需要则不填写)
	),

	/*------缓存配置------*/
	'cache' => array(
		'type' => 'file', //缓存方式 file/session
		'path' =>  '/Runtime/', //缓存路径 缓存方式为file时请填写
		'time' => 600 //默认有效时间(秒)
	),

	/*------jwt配置------*/
	'jwt' => array(
		'key' => 'sinking', //默认签名密钥
		'expire_time' => 86400 * 30, //默认过期时间
	),

	/*------是否使用cdn或网关等代理------*/
	'is_proxy' => false,

	/*------命令行------*/
	'command' => array( //指令=>类名
		'test' => 'app\\Command\\Test', //自定义命令
		'test1' => 'app\\Job\\Test', //队列任务
	),

	/*------框架版本------*/
	'version' => array(
		'name' => '{$version}', //版本名称
		'number' => '{$version_number}', //版本号
	),

	/*------授权信息------*/
	'auth' => array(
		'id' => '{$id}',
		'code' => '{$code}',
		'domain' => '{$domain}',
	),
);
