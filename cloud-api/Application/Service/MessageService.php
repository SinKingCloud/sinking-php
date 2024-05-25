<?php

namespace app\Service;

use app\Base\BaseService;
use app\Model\Message;

class MessageService extends BaseService
{
    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = Message::getClass();//兼容php5.4
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
        if (isset($where['status']) && $where['status'] >= 0) {
            $where_map['status'] = $where['status'];
        }
        $field = 'id,user_id,title,status,update_time,create_time';
        return parent::page($where_map, $order_field, $order_type, $page, $page_size, $field);
    }


    /**
     * 发送站内信
     *
     * @param mixed $user_id 用户ID
     * @param string $title 标题
     * @param string $content 内容
     * @return void
     */
    public function send($user_id, $title = '系统消息', $content = '测试消息内容')
    {
        //单发
        if (!is_array($user_id)) {
            return $this->create(array(
                'user_id' => $user_id,
                'title' => $title,
                'content' => $content,
                'status' => 0
            ));
        }
        //群发
        $data = array();
        foreach ($user_id as $key) {
            $data[] = array(
                'user_id' => $key,
                'title' => $title,
                'content' => $content,
                'status' => 0
            );
        }
        return $this->creates($data);
    }
}
