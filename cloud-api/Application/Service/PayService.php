<?php

namespace app\Service;

use app\Base\BaseService;
use app\Model\Pay;

class PayService extends BaseService
{
    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = Pay::getClass();//兼容php5.4
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
     * @param string $field 查询字段
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
        if (isset($where['create_time_start']) && $where['create_time_start']) {
            $where_map[] = array('create_time', $where['create_time_start'], '>=', 'and');
        }
        if (isset($where['create_time_end']) && $where['create_time_end']) {
            $where_map[] = array('create_time', $where['create_time_end'], '<=', 'and');
        }
        return parent::page($where_map, $order_field, $order_type, $page, $page_size, $field);
    }
}
