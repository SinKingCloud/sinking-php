<?php
/*
 * Title:沉沦云MVC开发框架
 * Project:Model功能类
 * Author:流逝中沉沦
 * QQ：1178710004
*/

namespace Systems;

use Systems\Db;

class Model
{
    protected $name; //表名

    protected $id = "id"; //主键ID

    private static $instance = array(); //实例

    /**
     * 实例化
     *
     * @param string $fun 方法名
     * @param array $arg 参数
     * @return void
     */
    public static function __callStatic($fun,  $arg)
    {
        return self::call($fun, $arg);
    }

    /**
     * 方法回调
     *
     * @param string $fun 方法名
     * @param array $arg 参数
     * @return void
     */
    public function __call($fun,  $arg)
    {
        return self::call($fun, $arg);
    }

    /**
     * 方法回调
     *
     * @param string $fun 方法名
     * @param array $arg 参数
     * @return void
     */
    private static function call($fun, $arg)
    {
        $class = get_called_class();
        if (!isset(self::$instance[$class])) {
            self::$instance[$class] = new $class();
        }
        if (method_exists(self::$instance[$class], "_" . $fun)) {
            return call_user_func_array(array(self::$instance[$class], "_" . $fun), $arg);
        } else {
            return call_user_func_array(array(self::$instance[$class]->DB(), $fun), $arg);
        }
    }

    /**
     * 获取表名
     */
    public function _getTableName()
    {
        return $this->name;
    }

    /**
     * 获取表名
     */
    public function _getPrimaryKey()
    {
        return $this->id;
    }

    /**
     * DB实例
     */
    public function DB($name = null)
    {
        return Db::getInstance()->name($name == null ? $this->name : $name, $this->getHandle());
    }
    /**
     * 获取回调函数
     */
    private function getHandle()
    {
        $obj = &$this;
        $updateBefore = function ($where, $data = array()) use (&$obj) {
            return $obj->updateBefore($where, $data);
        };
        $updateAfter = function ($where, $data = array()) use (&$obj) {
            return $obj->updateAfter($where, $data);
        };
        $createBefore = function ($data = array()) use (&$obj) {
            return $obj->createBefore($data);
        };
        $createAfter = function ($data = array()) use (&$obj) {
            return $obj->createAfter($data);
        };
        $deleteBefore = function ($where) use (&$obj) {
            return $obj->deleteBefore($where);
        };
        $deleteAfter = function ($where) use (&$obj) {
            return $obj->deleteAfter($where);
        };
        $selectDataFormat = function ($data = array()) use (&$obj) {
            return $obj->selectDataFormat($data);
        };
        $handle = array(
            'updateBefore' => $updateBefore,
            'updateAfter' => $updateAfter,
            'createBefore' => $createBefore,
            'createAfter' => $createAfter,
            'deleteBefore' => $deleteBefore,
            'deleteAfter' => $deleteAfter,
            'selectDataFormat' => $selectDataFormat,
        );
        return $handle;
    }
    /**
     * 格式化化数据
     */
    public function selectDataFormat($data = array())
    {
    }
    /**
     * 更新前
     */
    public function updateBefore($where, $data = array())
    {
    }
    /**
     * 更新后
     */
    public function updateAfter($where, $data = array())
    {
    }
    /**
     * 创建前
     */
    public function createBefore($data = array())
    {
    }
    /**
     * 创建后
     */
    public function createAfter($data = array())
    {
    }
    /**
     * 删除前
     */
    public function deleteBefore($where)
    {
    }
    /**
     * 删除后
     */
    public function deleteAfter($where)
    {
    }
    /**
     * 查询数据(多条记录)
     * @param Array $where 条件
     * @param String $field 字段
     * @return Mixed 数据集
     */
    public function _selectBy($where = array(), $field = "*")
    {
        try {
            if (empty($where)) {
                return $this->DB()->field($field)->select();
            } else {
                return $this->DB()->field($field)->where($where)->select();
            }
        } catch (\Exception $th) {
            return $th;
        }
    }
    /**
     * 查询数据(单条记录)
     * @param Mixed $where 条件
     */
    public function _findBy($where = null, $field = "*")
    {
        try {
            if (is_array($where)) {
                return $this->DB()->where($where)->field($field)->find();
            } elseif (is_numeric($where)) {
                return $this->DB()->where(array($this->id => $where))->field($field)->find();
            } else {
                return $this->DB()->field($field)->find();
            }
        } catch (\Exception $th) {
            return $th;
        }
    }
    /**
     * 插入数据(单条)
     * @param Array $data 数据
     * @return Boolean 结果
     */
    public function _create($data = array())
    {
        try {
            if (empty($data)) {
                return false;
            } else {
                return $this->DB()->insert($data);
            }
        } catch (\Exception $th) {
            return $th;
        }
    }
    /**
     * 插入数据(多条)
     * @param Array $data 数据
     * @return Array 结果
     */
    public function _creates($data = array())
    {
        try {
            if (empty($data)) {
                return false;
            } else {
                $res = array();
                foreach ($data as $key) {
                    $res[] = $this->insert($key);
                }
                return $res;
            }
        } catch (\Exception $th) {
            return $th;
        }
    }
    /**
     * 删除数据
     * @param Array $where 条件
     * @return Boolean 结果
     */
    public function _deleteBy($where = null)
    {
        try {
            if (empty($where)) {
                return false;
            } else {
                if (is_array($where)) {
                    return $this->DB()->where($where)->delete();
                } else {
                    return $this->DB()->where(array($this->id => intval($where)))->delete();
                }
            }
        } catch (\Exception $th) {
            return $th;
        }
    }
    /**
     * 修改数据
     * @param Array $where 条件
     * @param Array $data 数据
     * @return Boolean 结果
     */
    public function _updateBy($where = null, $data = array())
    {
        if (is_numeric($where)) {
            return $this->DB()->where(array($this->id => intval($where)))->update($data);
        } else if (is_array($where)) {
            return $this->DB()->where($where)->update($data);
        } else {
            return false;
        }
    }

    /**
     * 修改数据(自增自减)
     * @param Array $where 条件
     * @param Array $data 数据
     * @return Boolean 结果
     */
    public function _autoBy($where = null, $data = array())
    {
        if (is_numeric($where)) {
            return $this->DB()->where(array($this->id => intval($where)))->auto($data);
        } else if (is_array($where)) {
            return $this->DB()->where($where)->auto($data);
        } else {
            return false;
        }
    }
}
