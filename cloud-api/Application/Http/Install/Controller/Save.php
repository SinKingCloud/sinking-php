<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Install\Controller;

use Systems\Request;
use app\Constant\Config as Constant;
use PDO;
use Systems\Util;

class Save extends Common
{
    public function index()
    {
        set_time_limit(0);
        $data = $this->validate(array(
            array('host|地址', 'require|length_between:1,50|default:localhost'),
            array('port|端口', 'require|number|between:1,65535|default:3306'),
            array('user|用户', 'require|length_between:1,500|default:root'),
            array('pwd|密码', 'require|length_between:1,500|default:123456'),
            array('name|数据库名称', 'require|length_between:1,500'),
            array('prefix|数据表前缀', 'require|length_between:1,500'),
            array('id|APPID', 'require|number|default:0'),
            array('key|APPKEY', 'require|length:32'),
        ), Request::param());
        $sql_arr = $this->importSql($data);
        if ($sql_arr['code'] != 200) {
            return $this->error($sql_arr['message']);
        }
        $arr = array(
            'database_host' => $data['host'], //数据库地址
            'database_port' => $data['port'], //端口
            'database_user' => $data['user'], //数据库账号
            'database_pwd' => $data['pwd'], //数据库密码
            'database_name' => $data['name'], //数据库名称
            'database_prefix' => $data['prefix'], //数据库前缀
        );
        $str = var_export($arr, true);
        if ($fp = @fopen(APP_PATH . "/config.php", 'w')) {
            @fwrite($fp, "<?php return " . $str . ";");
            @fclose($fp);
            $db = new PDO("mysql:host=" . $data['host'] . ";dbname=" . $data['name'] . ";port=" . $data['port'], $data['user'], $data['pwd']);
            $db->exec("SET NAMES utf8mb4;");
            $sql = "DELETE FROM `cloud_configs` WHERE `key` IN ('" . Constant::SYSTEM_CLOUD_ID . "','" . Constant::SYSTEM_CLOUD_KEY . "');";
            $sql = str_ireplace("`cloud_", "`" . $data['prefix'], $sql);
            $db->exec($sql);
            $sql = "INSERT INTO `cloud_configs`(`key`,`value`,`create_time`,`update_time`) VALUES ('cloud.id', '" . $data['id'] . "', '2022-07-21 14:01:34', '2022-07-23 18:14:16');";
            $sql = str_ireplace("`cloud_", "`" . $data['prefix'], $sql);
            $db->exec($sql);
            $sql = "INSERT INTO `cloud_configs`(`key`,`value`,`create_time`,`update_time`) VALUES ('cloud.key', '" . $data['key'] . "', '2022-07-21 14:01:34', '2022-07-23 18:14:16');";
            $sql = str_ireplace("`cloud_", "`" . $data['prefix'], $sql);
            $db->exec($sql);
            $sql = "INSERT INTO `cloud_domains`(`web_id`,`domain`,`status`,`type`,`create_time`,`update_time`) VALUES (1, '" . Util::getHost(false) . "',0,0, '2022-07-21 14:01:34', '2022-07-23 18:14:16');";
            $sql = str_ireplace("`cloud_", "`" . $data['prefix'], $sql);
            $db->exec($sql);
            return $this->success("安装成功", $sql_arr['data']);
        } else {
            return $this->error('生成配置文件失败');
        }
    }

    private function importSql($data = array())
    {
        $file = APP_PATH . "/sql_file.php";
        if (!file_exists($file)) {
            return $this->error("数据表文件不存在");
        }
        try {
            $db = new PDO("mysql:host=" . $data['host'] . ";dbname=" . $data['name'] . ";port=" . $data['port'], $data['user'], $data['pwd']);
            $db->exec("SET NAMES utf8mb4;"); //设置编码
            $success = 0;
            $error = 0;
            $txts = file($file);
            $sql = '';
            $error_msg = array();
            foreach ($txts as $value) {
                if (substr($value, 0, 2) == '--' || $value == '' || substr($value, 0, 2) == '/*' || substr($value, 0, 2) == '<?') {
                    continue;
                }
                $sql .= $value;
                if (substr(trim($value), -1, 1) == ';' and $value != 'COMMIT;') {
                    $sql = str_ireplace("`cloud_", "`" . $data['prefix'], $sql);
                    $sql = str_ireplace('INSERT INTO ', 'INSERT IGNORE INTO ', $sql);
                    if ($db->exec($sql) === false) {
                        $err = $db->errorInfo();
                        $error_msg[] = $err[2];
                        $error++;
                    } else {
                        $success++;
                    }
                    $sql = '';
                }
            }
            if ($error > 0) {
                return $this->error("数据表导入失败",array(
                    'error' => $error,
                    'error_message' => $error_msg,
                ));
            }
            return $this->success("导入数据表成功", array(
                'success' => $success,
                'error' => $error,
                'error_message' => $error_msg,
            ));
        } catch (\PDOException $th) {
            return $this->error("数据库连接失败", $th->getMessage());
        }
    }
}
