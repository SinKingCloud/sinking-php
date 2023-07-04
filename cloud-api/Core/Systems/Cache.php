<?php
/*
 * Title:沉沦云MVC开发框架
 * Project:缓存功能类
 * Author:流逝中沉沦
 * QQ：1178710004
*/

namespace Systems;

use Systems\Errors;
use Systems\File;
use Systems\Dir;
use Systems\Session;
use Systems\Config;

class Cache
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
    /**
     * 获取缓存(不存在则设置)
     *
     * @param String $key 缓存key
     * @param Callable $fun 函数
     * @param Int $time 缓存时间
     * @return void
     */
    public static function remember($key, $fun, $time)
    {
        $value = self::get($key);
        if (!$value && is_callable($fun)) {
            $value = $fun();
            self::set($key, $value, $time);
        }
        return $value;
    }
    /**
     * 获取缓存
     * @param String $key 键名
     * @return Mixed 数据集
     */
    public static function get($key)
    {
        $key = md5($key) . ".php";
        if (is_null(self::$config)) {
            self::init(); //初始化参数
        }
        if (is_null(self::$config['cache']['type'])) {
            return false;
        }
        try {
            $res = false;
            switch (self::$config['cache']['type']) {
                case 'file':
                    $res = self::FileGet($key);
                    break;
                case 'session':
                    $res = Session::get($key);
                    break;
            }
            if ($res) {
                $res = unserialize($res);
                if ($res['expiretime'] >= time()) {
                    return $res['data'];
                }
                return false;
            }
            return false;
        } catch (\Throwable $th) {
            Errors::show($th);
        }
    }
    /**
     * 设置缓存内容
     * @param String $key 键名
     * @param Mixed $value 键值
     * @return Mixed 数据集
     */
    public static function set($key = null, $value = null, $expiretime = null)
    {
        $key = md5($key) . ".php";
        if (is_null(self::$config)) {
            self::init();
        }
        if (is_null($key) || is_null($value)) {
            return false;
        }
        if (is_null(self::$config['cache']['type'])) {
            return false;
        }
        $res = false;
        $value = serialize(
            array(
                'time' => time(),
                'expiretime' => empty($expiretime) ? time() + self::$config['cache']['time'] : time() + $expiretime,
                'data' => $value
            )
        );
        switch (self::$config['cache']['type']) {
            case 'file':
                $res = self::FilePut($key, $value);
                break;
            case 'session':
                $res = Session::set($key, $value, self::$config['cache']['time']);
                break;
        }
        if ($res) {
            return true;
        }
        return false;
    }
    /**
     * 清理缓存
     * @param String $key 键名
     * @return Mixed 数据集
     */
    public static function delete($key = null)
    {
        $key = md5($key) . ".php";
        if (is_null(self::$config)) {
            self::init();
        }
        if (is_null(self::$config['cache']['type'])) {
            return false;
        }
        switch (self::$config['cache']['type']) {
            case 'file':
                return self::FileDelete($key);
                break;
        }
        return false;
    }
    /**
     * 文件锁
     * @param String $key 键名
     * @return Mixed 数据集
     */
    public static function lock($key = "lock", $fun = null, $wait = false)
    {
        $key = md5($key);
        $file = self::$config['cache_dir'] . self::$config['cache']['path'] . substr($key, 0, 2) . '/' . $key . ".php";
        if (!file_exists($file)) {
            File::CreateFile($file);
        }
        $fp = fopen($file, "r");
        if ($fp) {
            if (!$wait) {
                $n = flock($fp, LOCK_EX | LOCK_NB);
            } else {
                $n = flock($fp, LOCK_EX);
            }
            if ($n) {
                if (is_callable($fun)) {
                    $fun();
                }
                flock($fp, LOCK_UN);
                fclose($fp);
                return true;
            } else {
                fclose($fp);
                return false;
            }
        } else {
            return false;
        }
    }
    /**
     * 获取缓存内容 file形式
     * @param String $key 键名
     * @return Mixed 数据集
     */
    private static function FileGet($key = null)
    {
        if (is_null($key)) {
            return false;
        }
        try {
            $path = self::$config['cache_dir'] . self::$config['cache']['path'] . '/' . substr($key, 0, 2) . '/';
            if (Dir::createFile($path)) {
                $file = $path . $key;
                if (File::exists($file)) {
                    return mb_substr(File::init($file)->read(), 13);
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (\Throwable $th) {
            Errors::show($th);
        }
    }
    /**
     * 设置缓存内容 file形式
     * @param String $key 键名
     * @param Mixed $value 键值
     * @return Mixed 数据集
     */
    private static function FilePut($key = null, $value = null)
    {
        if (is_null($key) || is_null($value)) {
            return false;
        }
        try {
            $path = self::$config['cache_dir'] . self::$config['cache']['path'] . '/' . substr($key, 0, 2) . '/';
            if (Dir::createFile($path)) {
                $file = $path . $key;
                if (File::CreateFile($file, '<?php exit;?>' . $value)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (\Throwable $th) {
            Errors::show($th);
        }
    }
    /**
     * 清理缓存 file形式
     * @param String $key 键名
     * @return Mixed 数据集
     */
    private static function FileDelete($key = null)
    {
        try {
            $path = self::$config['cache_dir'] . self::$config['cache']['path'] . '/' . substr($key, 0, 2) . '/';
            if (is_null($key)) {
                return Dir::init($path)->removeAll();
            } else {
                $file = $path . $key;
                return File::init($file)->delete();
            }
        } catch (\Throwable $th) {
            Errors::show($th);
        }
    }
}
