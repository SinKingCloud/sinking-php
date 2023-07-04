<?php

namespace app\Service;

use app\Base\BaseService;
use app\Constant\Config as ConstantConfig;
use app\Model\Log;
use Systems\Config;
use Systems\Util;

class LogService extends BaseService
{
    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = Log::getClass();//兼容php5.4
        $this->model = new $class();
    }

    /**
     * 查询数据
     *
     * @param array $where 查询条件
     * @param string $order_field 排序字段
     * @param string $order_type 排序方式
     * @param integer $page 页码
     * @param integer $page_size 每页数量 
     * @return void 数据
     */
    public function page($where = array(),  $order_field = 'id',  $order_type = 'desc',  $page = 1, $page_size = 20, $field = '*')
    {
        $where_map = array();
        if (isset($where['user_id']) && $where['user_id'] > 0) {
            $where_map['user_id'] = $where['user_id'];
        }
        if (isset($where['type']) && $where['type'] >= 0) {
            $where_map['type'] = $where['type'];
        }
        if (isset($where['request_ip']) && $where['request_ip']) {
            $where_map['request_ip'] = $where['request_ip'];
        }
        if (isset($where['request_id']) && $where['request_id']) {
            $where_map['request_id'] = $where['request_id'];
        }
        $field = 'id,user_id,request_id,request_ip,type,title,content,update_time,create_time';
        return parent::page($where_map, $order_field, $order_type, $page, $page_size, $field);
    }

    /**
     * 添加日志
     *
     * @param integer $type 类型
     * @param string $title 标题
     * @param string $content 内容
     * @param integer $user_id 用户ID
     * @return void
     */
    public function add($type = 0, $title = '', $content = '', $user_id = 0)
    {
        $user = AuthService::getInstance()->getCurrentUser();
        if ($user) {
            $user_id = $user['id'];
        }
        if (!$user_id) {
            return false;
        }
        $request_id = Config::get(ConstantConfig::REQUEST_ID);
        $request_ip = Util::getIP();
        return $this->create(array(
            'request_id' => $request_id,
            'request_ip' => $request_ip,
            'user_id' => $user_id,
            'type' => intval($type),
            'title' => $title,
            'content' => $content,
        ));
    }
}
