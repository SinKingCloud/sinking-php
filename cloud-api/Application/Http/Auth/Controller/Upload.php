<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Auth\Controller;

use Systems\Config;
use Systems\Upload as SystemsUpload;
use Systems\Util;

class Upload extends Common
{
    /**
     * 上传文件
     *
     * @return void
     */
    public function file()
    {
        $path = '/Public/Storage/' . date("Ymd") . '/';
        $dir = Config::get('cache_dir') . '..' . $path;
        $name = Util::getUuid();
        $res = SystemsUpload::init('file')->type('jpeg,jpg,png,gif,mp4,wav,mp3,svg')->size(5242880)->name($name)->path($dir);
        if ($res) {
            $url = Util::getHost(true) . $path . $res['name'];
            return $this->success('上传文件成功',  $url);
        } else {
            return $this->error('上传文件失败');
        }
    }
}
