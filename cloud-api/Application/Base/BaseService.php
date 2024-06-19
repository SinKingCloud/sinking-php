<?php

/**
 * 基础service
 */

namespace app\Base;

class BaseService
{
    protected static $instance = array(); //单例

    protected $model = null; //默认模型

    protected $error = null; //错误消息

    /**
     * 获取单例
     *
     * @return object
     */
    public static function getInstance()
    {
        $name = get_called_class();
        if (!isset(self::$instance[$name])) {
            self::$instance[$name] = new $name();
        }
        return self::$instance[$name];
    }

    /**
     * 设置错误消息
     * @param $message string 错误消息
     * @return bool 执行结果
     */
    public function error($message = '')
    {
        $this->error = $message;
        return false;
    }

    /**
     * 获取错误信息
     * @return mixed|null
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * 查询分页数据
     *
     * @param array $where 查询条件
     * @param string $order_field 排序字段
     * @param string $order_type 排序方式
     * @param integer $page 页码
     * @param integer $page_size 每页数量
     * @param string $field 查询字段
     * @return array|bool 数据
     */
    public function page($where = array(), $order_field = 'id', $order_type = 'desc', $page = 1, $page_size = 20, $field = '*')
    {
        if (!$this->model) return false;
        return $this->model->where($where)
            ->field($field)
            ->order($order_field . ' ' . $order_type)
            ->page($page, $page_size);
    }

    /**
     * 查询数据
     *
     * @param array $where 查询条件
     * @param string $order_field 排序字段
     * @param string $order_type 排序方式
     * @param string $field 查询字段
     * @param integer $limit 查询数量
     * @return array|bool 数据
     */
    public function select($where = array(), $order_field = 'id', $order_type = 'desc', $field = '*', $limit = -1)
    {
        if (!$this->model) return false;
        return $this->model->where($where)
            ->field($field)
            ->order($order_field . ' ' . $order_type)
            ->limit($limit)
            ->select();
    }

    /**
     * 统计数据
     *
     * @param array $where 查询条件
     * @return integer|bool
     */
    public function count($where = array())
    {
        if (!$this->model) return false;
        return $this->model->where($where)->count();
    }

    /**
     * 查询单条数据
     *
     * @param mixed $where 查询条件
     * @param string $field
     * @return array|bool
     */
    public function find($where, $field = '*')
    {
        if (!$this->model) return false;
        return $this->model->findBy($where, $field);
    }

    /**
     * 删除数据
     *
     * @param mixed $where 查询条件
     * @return bool
     */
    public function delete($where)
    {
        if (!$this->model) return false;
        return $this->model->deleteBy($where);
    }

    /**
     * 修改数据
     *
     * @param mixed $where 查询条件
     * @param array $data 数据
     * @return bool
     */
    public function update($where, $data = array())
    {
        if (!$this->model) return false;
        return $this->model->updateBy($where, $data);
    }

    /**
     * 创建数据(单条)
     *
     * @param array $data 数据
     * @return bool
     */
    public function create($data = array())
    {
        if (!$this->model) return false;
        return $this->model->create($data);
    }

    /**
     * 创建数据(多条)
     *
     * @param array $data 数据
     * @return bool
     */
    public function creates($data = array())
    {
        if (!$this->model) return false;
        return $this->model->creates($data);
    }

    /**
     * 修改数据(自增自减)
     *
     * @param mixed $where 查询条件
     * @param array $data 数据
     * @return bool
     */
    public function auto($where, $data = array())
    {
        if (!$this->model) return false;
        return $this->model->autoBy($where, $data);
    }
}
