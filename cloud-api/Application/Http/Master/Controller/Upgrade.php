<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Master\Controller;

use app\Constant\Config as ConstantConfig;
use app\Service\ConfigService;
use Systems\Config;
use Systems\Curl;
use Systems\Db;
use Systems\File;
use Systems\Util;
use Systems\Zip;

class Upgrade extends Common
{
    /**
     * 检测更新
     *
     * @return void
     */
    public function check()
    {
        $version = Config::get(ConstantConfig::VERSION); //本地版本
        $auth = Config::get(ConstantConfig::AUTH);
        $cloud = $this->getCloudObj();
        $data = $cloud->checkUpgrade($auth['code'], $version['number']);
        if (!$data) {
            return $this->error("获取云端数据失败");
        }
        if (!isset($data['code']) || $data['code'] != 200) {
            return $this->error($data['message']);
        }
        return $this->success("获取云端数据成功", array(
            'local' => $version,
            'cloud' => $data['data'],
            'is_upgrade' => is_array($data['data']) && count($data['data']) > 0,
        ));
    }

    /**
     * 在线升级
     *
     * @return void
     */
    public function update()
    {
        set_time_limit(0);
        $cloud = $this->getCloudObj();
        $auth = Config::get(ConstantConfig::AUTH);
        $version = Config::get(ConstantConfig::VERSION);
        $data = $cloud->checkUpgrade($auth['code'], $version['number']);
        if (!$data) {
            return $this->error("获取云端数据失败");
        }
        if (!isset($data['code']) || $data['code'] != 200) {
            return $this->error($data['message']);
        }
        if (is_array($data['data']) && count($data['data']) > 0) {
            //更新系统
            $datas = Util::arraySort($data['data'], 'version_number', 'asc');
            foreach ($datas as $verinfo) {
                $temp = $cloud->getPkg($auth['code'], $verinfo['version_number']);
                if ($temp) {
                    if (!$this->install($temp)) {
                        return $this->error("安装更新失败");
                    }
                } else {
                    return $this->error("获取更新文件失败");
                }
            }
            return $this->success("更新成功");
        } else {
            return $this->error("暂无更新内容");
        }
    }

    /**
     * 安装更新包
     *
     * @param String $url 更新包地址
     * @return void
     */
    private function install($url)
    {
        $path = APP_PATH . '/../';
        //下载更新包
        $zip_file = $path . 'update.zip';
        $url = str_replace("https://", "http://", $url); //防止ssl屏蔽
        if (!file_put_contents($zip_file, Curl::get($url))) {
            return false;
        }
        //解压
        $zip = new Zip();
        if (!$zip->unzip($zip_file, $path)) {
            return false;
        }
        File::init($zip_file)->delete();
        //执行sql
        $sql_file = $path . 'update.sql';
        if (file_exists($sql_file)) {
            $database = Config::get('database');
            $txts = file($sql_file);
            File::init($sql_file)->delete();
            $sql = '';
            foreach ($txts as $value) {
                if (substr($value, 0, 2) == '--' || $value == '' || substr($value, 0, 2) == '/*' || substr($value, 0, 2) == '<?') {
                    continue;
                }
                $sql .= $value;
                if (substr(trim($value), -1, 1) == ';' and $value != 'COMMIT;') {
                    $sql = str_ireplace("`cloud_", "`" . $database['database_prefix'], $sql);
                    $sql = str_ireplace('INSERT INTO ', 'INSERT IGNORE INTO ', $sql);
                    //执行sql
                    Db::getInstance()->query($sql);
                    $sql = '';
                }
            }
        }
        return true;
    }

    /**
     * 获取cloud对象
     *
     * @return void
     */
    private function getCloudObj()
    {
        $id = ConfigService::getInstance()->get(ConstantConfig::SYSTEM_CLOUD_ID);
        $key = ConfigService::getInstance()->get(ConstantConfig::SYSTEM_CLOUD_KEY);
        return \Plugins\SinKingCloud\App::getInstance()->setAppId($id)->setAppKey($key);
    }
}
