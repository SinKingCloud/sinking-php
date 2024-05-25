<?php

namespace app\Service;

use app\Base\BaseService;
use app\Model\Cash;

class CashService extends BaseService
{
    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = Cash::getClass();//兼容php5.4
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
        if (isset($where['web_id']) && $where['web_id'] >= 0) {
            $where_map['web_id'] = $where['web_id'];
        }
        if (isset($where['user_id']) && $where['user_id'] >= 0) {
            $where_map['user_id'] = $where['user_id'];
        }
        if (isset($where['type']) && $where['type'] >= 0) {
            $where_map['type'] = $where['type'];
        }
        if (isset($where['name']) && $where['name']) {
            $where_map['name'] = $where['name'];
        }
        if (isset($where['account']) && $where['account']) {
            $where_map['account'] = $where['account'];
        }
        if (isset($where['status']) && $where['status'] >= 0) {
            $where_map['status'] = $where['status'];
        }
        if (isset($where['create_time_start']) && $where['create_time_start']) {
            $where_map[] = array('create_time', $where['create_time_start'], '>=', 'and');
        }
        if (isset($where['create_time_end']) && $where['create_time_end']) {
            $where_map[] = array('create_time', $where['create_time_end'], '<=', 'and');
        }
        if (isset($where['update_time_start']) && $where['update_time_start']) {
            $where_map[] = array('update_time', $where['update_time_start'], '>=', 'and');
        }
        if (isset($where['update_time_end']) && $where['update_time_end']) {
            $where_map[] = array('update_time', $where['update_time_end'], '<=', 'and');
        }
        $field = 'id,user_id,type,name,account,money,real_money,remark,status,create_time,update_time';
        return parent::page($where_map, $order_field, $order_type, $page, $page_size, $field);
    }
}
