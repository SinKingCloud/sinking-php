<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Install\Controller;

use PDO;
use Systems\Request;

class Check extends Common
{
    /**
     * 环境检测
     *
     * @return void
     */
    public function env()
    {
        return $this->success('获取成功', array(
            'pdo' => class_exists("PDO"),
            'file' => $this->checkChmod(),
            'php' => !version_compare(PHP_VERSION, '5.3.0', '<='),
            'curl' => function_exists('curl_init'),
            'sql_file' => file_exists(APP_PATH . "/sql_file.php"),
        ));
    }

    /**
     * 文件权限
     *
     * @return void
     */
    private function checkChmod()
    {
        $file = APP_PATH . '/test.php';
        if ($fp = @fopen($file, 'w')) {
            @fclose($fp);
            @unlink($file);
            return true;
        }
        return false;
    }

    /**
     * 数据库检测
     *
     * @return void
     */
    public function database()
    {
        $data = $this->validate(array(
            array('host|地址', 'require|length_between:1,50|default:localhost'),
            array('port|端口', 'require|number|between:1,65535|default:3306'),
            array('user|用户', 'require|length_between:1,500|default:root'),
            array('pwd|密码', 'require|length_between:1,500|default:123456'),
            array('name|数据库名称', 'require|length_between:1,500'),
        ), Request::param());
        if (!class_exists("PDO")) {
            return $this->error("未开启PDO扩展");
        }
        try {
            $db = new PDO("mysql:host=" . $data['host'] . ";dbname=" . $data['name'] . ";port=" . $data['port'], $data['user'], $data['pwd']);
            $info = $db->query('select VERSION() as ver')->fetch();
            return $this->success("数据库连接成功", array(
                'version' => $info['ver'],
            ));
        } catch (\PDOException $th) {
            return $this->error("数据库连接失败");
        }
    }

    /**
     * 云端检测
     *
     * @return void
     */
    public function cloud()
    {
        $data = $this->validate(array(
            array('id|APPID', 'require|number|default:0'),
            array('key|APPKEY', 'require|length:32'),
        ), Request::param());
        $info = \Plugins\SinKingCloud\App::getInstance()->setAppId($data['id'])->setAppKey($data['key'])->getAppInfo();
        if (!$info) {
            return $this->error("连接云端失败");
        }
        return $this->success("连接云端成功", $info);
    }
}
