<?php
/*
* Title:沉沦云MVC开发框架
* Project:框架入口
* Author:流逝中沉沦
* QQ：1178710004
*/

use Systems\Route;
use Systems\Errors;
use Systems\Cache;
use Systems\Config;
use Systems\Util;

class App
{
    protected $config;
    protected $module;
    protected $controller;
    protected $action;
    protected $app_path;
    protected $value;

    /**
     * 运行
     * @return false|null
     */
    public static function start()
    {
        $app = new self();
        $app->init();
        if (Errors::isShow()) {
            return false;
        }
        if (PHP_SAPI == 'cli') {
            return $app->command();
        }
        return $app->http();
    }

    /**
     * 异常捕获
     */
    public static function errorHandle($th, $other = array())
    {
        if (!is_object($th)) {
            return;
        }
        if (method_exists($th, 'handle')) {
            $return = call_user_func_array(array($th, 'handle'), $other);
            if (!$return) {
                return;
            }
            if (is_array($return)) {
                header("Content-Type:text/json;charset=utf-8;");
                echo Util::jsonEncode($return);
            } else if (is_string($return)) {
                header('Content-Type:text/html;charset=utf-8;');
                echo $return;
            }
        } else {
            Errors::show($th);
        }
    }

    /**
     * 构造参数
     */
    private function init()
    {
        try {
            $this->autoload_register(); //自动加载
            $this->config = Config::get(); //获取配置
            $this->app_path = defined('APP_PATH') ? APP_PATH : $this->config['application_dir'];
            if (!defined('APP_PATH')) {
                define('APP_PATH', $this->app_path);
            }
            Cache::init($this->config); //初始化缓存配置
            Route::Init($this->config); //初始化路由配置
            $this->module = Route::GetModule();
            $this->controller = Route::GetController();
            $this->action = Route::GetAction();
            $this->value = Route::GetValue();
            $this->loadFile();
            return $this;
        } catch (Exception $th) {
            Errors::show($th);
        }
    }

    /**
     * 自动加载
     * @param String $class 类名
     */
    private function autoload($class)
    {
        $dir = str_replace('\\', '/', $class) . '.php';
        if (file_exists(__DIR__ . '/' . $dir)) {
            require_once $dir;
        } else {
            $dir = str_replace($this->config['default_namespace'] . '/', $this->app_path, $dir);
            if (file_exists($dir)) {
                require_once $dir;
            } else {
                Errors::show("控制器不存在</br>" . $dir);
            }
        }
        unset($dir);
    }

    /**
     * 方法注册
     */
    private function autoload_register()
    {
        if (function_exists('set_error_handler')) {
            set_error_handler(array("App", "errorHandle"));
        }
        if (function_exists('set_exception_handler')) {
            set_exception_handler(array("App", "errorHandle"));
        }
        spl_autoload_register('self::autoload');
    }

    /**
     * 框架运行(http)
     */
    private function http()
    {
        try {
            if ($this->config['multi_app']['open']) {
                $class = $this->config['default_namespace'] . '\\' . ucwords(strtolower($this->config['default_http_path'])) . '\\' . ucwords(strtolower($this->module)) . '\\' . $this->config['default_controller_name'] . '\\' . ucwords(strtolower($this->controller));
            } else {
                $class = $this->config['default_namespace'] . '\\' . ucwords(strtolower($this->config['default_http_path'])) . '\\' . $this->config['default_controller_name'] . '\\' . ucwords(strtolower($this->module));
                $this->action = $this->controller;
            }
            if (!class_exists($class)) {
                Errors::show("控制器不存在</br>" . $class);
                return;
            }
            $controller = new $class();
            if ($this->action != 'beforeAction' && $this->action != 'afterAction' && method_exists($controller, $this->action)) {
                //执行前
                $hook_data = array($this->action, $this->value);
                if (method_exists($controller, 'beforeAction')) call_user_func_array(array($controller, 'beforeAction'), $hook_data);
                //执行
                $return = call_user_func_array(array($controller, $this->action), $this->value);
                if (!$return) {
                    return;
                }
                if (is_array($return)) {
                    header("Content-Type:text/json;charset=utf-8;");
                    echo Util::jsonEncode($return);
                } else if (is_string($return) || is_numeric($return)) {
                    header('Content-Type:text/html;charset=utf-8');
                    echo $return;
                }
                //执行后
                if (method_exists($controller, 'afterAction')) call_user_func_array(array($controller, 'afterAction'), $hook_data);
            } else {
                Errors::show("方法不存在</br>" . $this->action);
            }
        } catch (Exception $th) {
            self::errorHandle($th, $this->value);
        }
    }

    /**
     * 框架运行(cli)
     */
    private function command()
    {
        try {
            $param = getopt('c:p:');
            $commands = $this->config['command'];
            if (!isset($commands[$param['c']])) {
                echo "the command is not found.\n";
                return;
            }
            $class = $commands[$param['c']];
            $p = isset($param['p']) ? $param['p'] : array();
            $obj = new $class($p);
            $obj->execute();
        } catch (Exception $th) {
            self::errorHandle($th, $this->value);
        }
    }

    /**
     * 加载文件
     */
    private function loadFile()
    {
        if (!empty($this->config['default_loadfile'])) {
            if (is_array($this->config['default_loadfile'])) {
                foreach ($this->config['default_loadfile'] as $key) {
                    if (file_exists($this->app_path . $key)) {
                        require_once($this->app_path . $key);
                    }
                }
            } else {
                if (file_exists($this->app_path . $this->config['default_loadfile'])) {
                    require_once($this->app_path . $this->config['default_loadfile']);
                }
            }
        }
    }
}
