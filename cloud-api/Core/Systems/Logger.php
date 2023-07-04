<?php
/*
 * Title:沉沦云MVC开发框架
 * Project:缓存功能类
 * Author:流逝中沉沦
 * QQ：1178710004
*/

namespace Systems;

use Systems\File;
use Systems\Config;

class Logger
{
    protected static $config = null;
    /**
     * 构造参数
     * @param array $conf 系统配置
     */
    public static function init($conf = null)
    {
        if ($conf == null) {
            self::$config = Config::get();
        } else {
            self::$config = $conf;
        }
    }

    public static function info()
    {
        $arg_list = func_get_args();
        self::write("INFO", $arg_list);
    }

    public static function warning()
    {
        $arg_list = func_get_args();
        self::write("WARNING", $arg_list);
    }

    public static function error()
    {
        $arg_list = func_get_args();
        self::write("ERROR", $arg_list);
    }

    private static function write($level, $arg_list)
    {
        self::init();
        $conf = self::$config['logger']['app'];
        if (!$conf['open']) {
            return false;
        }
        $txt = array();
        foreach ($arg_list as $key) {
            if (is_string($key) || is_numeric($key)) {
                $t = $key;
            } else {
                $t = Util::jsonEncode($key);
            }
            $txt[] = $t;
        }
        $backtrace = debug_backtrace();
        if (isset($backtrace[1]['file'])) {
            $trace = $backtrace[1];
        } else {
            $trace = $backtrace[0];
        }
        $file_name = self::$config['cache_dir'] . $conf['path'] . $conf['file_name'] . date($conf['format']) . ".php";
        File::CreateFile($file_name, "<?php exit;?>\n", false);
        File::init($file_name)->write(date("Y-m-d H:i:s") . " " . $level . " " . $trace['file'] . ":" . $trace['line'] . " " . implode(' ', $txt) . "\n");
    }
}
