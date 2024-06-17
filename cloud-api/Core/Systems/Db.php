<?php
/*
 * Title:Mysql操作类
 * Author:流逝中沉沦
 * QQ：1178710004
*/

namespace Systems;

use PDO;
use Systems\Errors;
use Systems\Config;
use Systems\File;

class Db
{
    protected static $_dbh = null;
    protected static $_last_connect_time = 0;
    protected static $instance = null;
    protected static $handle = array(); //事件回调
    public static $configs;
    //静态属性,所有数据库实例共用,避免重复连接数据库
    protected $_dbType = 'mysql';
    protected $_pconnect = true;
    //是否使用长连接
    protected $_host = 'localhost';
    protected $_port = 3306;
    protected $_user = 'root';
    protected $_pass = 'root';
    protected $_dbName = null;
    protected $_prefix = '';
    protected $_charset = 'utf8';
    //数据库名
    protected $_sql = false;
    //最后一条sql语句
    protected $_table_name = '';
    protected $_join = '';
    protected $_where = '';
    protected $_order = '';
    protected $_limit = '';
    protected $_field = '*';
    protected $_clear = 0;
    //预处理
    protected $_prepare_var = array();
    protected $_prepare_sql = '';
    protected $_perpare_where = '';
    //条件杂项
    protected $_where_options;
    //执行时间记录
    protected $_start_time = 0;
    protected $_end_time = 0;
    //状态，0表示查询条件干净，1表示查询条件污染
    protected static $_trans = 0;
    //事务指令数

    /**
     * 初始化类
     * @param array $conf 数据库配置
     */
    public function __construct(array $conf = null)
    {
        if ($conf != null) {
            $this->config = $conf;
        } else {
            if (!isset(self::$configs['database']) || empty(self::$configs['database'])) {
                self::$configs = Config::get();
            }
            $this->config = self::$configs;
        }
        class_exists('PDO') or Errors::show("PDO: class not exists");
        $this->_host = $this->config['database']['database_host'];
        $this->_port = $this->config['database']['database_port'];
        $this->_user = $this->config['database']['database_user'];
        $this->_pass = $this->config['database']['database_pwd'];
        $this->_dbName = $this->config['database']['database_name'];
        $this->_prefix = $this->config['database']['database_prefix'];
        $this->_charset = isset($this->config['database']['database_charset']) ? $this->config['database']['database_charset'] : 'utf8mb4';
        //连接数据库
        if (is_null(self::$_dbh)) {
            $this->_connect();
        }
    }

    /**
     * 静态化Db
     * @param $config array 配置文件
     * @return self|null
     */
    public static function getInstance($config = null)
    {
        if (self::$instance != null && time() - self::$_last_connect_time > self::$configs['database']['database_heart']) {
            self::$_dbh = null;
            self::$instance = null;
        }
        if (self::$instance == null) {
            if ($config != null) {
                $obj = new self($config);
            } else {
                $obj = new self();
            }
            self::$instance = $obj;
        }
        return self::$instance;
    }

    /**
     * 静态方法反射
     * @param $fun string 函数名
     * @param $arg array 参数
     * @return false|mixed
     */
    public static function __callStatic($fun, $arg)
    {
        $fun = '_' . $fun;
        if (self::$instance == null) {
            self::getInstance();
        }
        if (method_exists(self::$instance, $fun)) {
            return call_user_func_array(array(self::$instance, $fun), $arg);
        }
        return false;
    }

    /**
     *  执行sql语句
     * @param $sql string sql语句
     * @param $prepare_var array 预处理变量
     * @return int|mixed
     */
    public static function query($sql = '', $prepare_var = array())
    {
        if (self::$instance == null) {
            self::getInstance();
        }
        return self::getInstance()->_query($sql, $prepare_var);
    }

    /**
     * 获取表名（无前缀,反射）
     * @param string $tbName 操作的数据表名
     * @return array 结果集
     */
    public static function setTable($tbName = '', $callback = array())
    {
        if (self::$instance == null) {
            self::getInstance();
        }
        return self::getInstance()->table($tbName, $callback);
    }

    /**
     * 获取表名（有前缀,反射）
     * @param string $tbName 操作的数据表名
     * @return array 结果集
     */
    public static function setName($tbName = '', $callback = array())
    {
        if (self::$instance == null) {
            self::getInstance();
        }
        return self::getInstance()->table(self::getInstance()->_prefix . $tbName, $callback);
    }


    /**
     * 连接数据库的方法
     */
    protected function _connect()
    {
        $dsn = $this->_dbType . ':host=' . $this->_host . ';port=' . $this->_port . ';dbname=' . $this->_dbName;
        $options = $this->_pconnect ? array(PDO::ATTR_PERSISTENT => true) : array();
        try {
            $dbh = new PDO($dsn, $this->_user, $this->_pass, $options);
            $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            //设置如果sql语句执行错误则抛出异常，事务会自动回滚
            $dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            //$dbh->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
            $dbh->exec('SET NAMES ' . $this->_charset);
            self::$_dbh = $dbh;
            self::$_last_connect_time = time();
        } catch (PDOException $e) {
            Errors::show($e);
        }
    }

    /**
     * 字段和表名添加 `符号
     * 保证指令中使用关键字不出错 针对mysql
     * @param string $value
     * @return string
     */
    protected function _addChar($value)
    {
        if ('*' == $value || false !== strpos($value, '(') || false !== strpos($value, ')') || false !== strpos($value, '.') || false !== strpos($value, '`') || is_numeric($value)) {
            //如果包含* 或者 使用了sql方法 则不作处理
        } elseif (false === strpos($value, '`')) {
            $value = '`' . trim($value) . '`';
        } elseif (true === strpos($value, ' ')) {
            $temp = explode(' ', $value);
            $value = '`' . trim($temp[0]) . '`';
        }
        return $value;
    }

    /**
     * 取得数据表的字段信息
     * @param string $tbName 表名
     * @return array
     */
    protected function _tbFields($tbName)
    {
        $sql = 'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME="' . $tbName . '" AND TABLE_SCHEMA="' . $this->_dbName . '"';
        $stmt = self::$_dbh->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $ret = array();
        foreach ($result as $key => $value) {
            $ret[$value['COLUMN_NAME']] = 1;
        }
        return $ret;
    }

    /**
     * 触发事件
     */
    private function trigger_handle($handle_name = '', $where = array(), $data = array())
    {
        if (isset(self::$handle[$this->_table_name][$handle_name]) && is_callable(self::$handle[$this->_table_name][$handle_name])) {
            $fun = self::$handle[$this->_table_name][$handle_name];
            if ($handle_name == 'createBefore' || $handle_name == 'createAfter' || $handle_name == 'selectDataFormat') {
                return $fun($data);
            }
            return $fun($where, $data);
        }
    }

    /**
     * 过滤并格式化数据表字段
     * @param string $tbName 数据表名
     * @param array $data POST提交数据
     * @return array $newdata
     */
    protected function _dataFormat($tbName, $data)
    {
        if (!is_array($data)) {
            return array();
        }
        $table_column = $this->_tbFields($tbName);

        $ret = array();
        foreach ($data as $key => $val) {

            if (!is_scalar($val)) {
                continue;
            }
            //值不是标量则跳过
            if (array_key_exists($key, $table_column)) {
                //判断字符串是否含有字符
                $key = $this->_addChar($key);
                if (is_int($val)) {
                    $val = intval($val);
                } elseif (is_float($val)) {
                    $val = floatval($val);
                } elseif (preg_match('/^\\(\\w*(\\+|\\-|\\*|\\/)?\\w*\\)$/i', $val)) {
                    // 支持在字段的值里面直接使用其它字段 ,例如 (score+1) (name) 必须包含括号
                    $val = $val;
                }
                $ret[$key] = $val;
            }
        }
        return $ret;
    }

    /**
     * 记录日志
     */
    protected function log($result)
    {
        $conf = $this->config['logger']['sql'];
        if (!$conf['open']) {
            return false;
        }
        $time = abs(($this->_end_time - $this->_start_time)) * 1000; //毫秒数
        $sql = $this->_sql; //执行的SQL
        $file_name = $this->config['cache_dir'] . $conf['path'] . $conf['file_name'] . date($conf['format']) . ".php";
        File::CreateFile($file_name, "<?php exit;?>\n", false);
        File::init($file_name)->write("时间:" . date("Y-m-d H:i:s") . " 执行耗时:" . number_format($time, 3) . "ms 执行sql:" . $sql . " 执行结果:" . Util::jsonEncode($result) . "\n");
    }

    /**
     * 执行查询 主要针对 SELECT, SHOW 等指令
     * @param string $sql sql指令
     * @return mixed
     */
    protected function _doQuery($sql = '', $prepare = false)
    {
        $this->_sql = $sql;
        $this->_start_time = microtime();
        if ($prepare) {
            $pdostmt = self::$_dbh->prepare($this->_prepare_sql);
            $pdostmt->execute($this->_prepare_var);
        } else {
            $pdostmt = self::$_dbh->prepare($this->_sql);
            $pdostmt->execute();
        }
        $result = $pdostmt->fetchAll(PDO::FETCH_ASSOC);
        $this->_end_time = microtime();
        $this->log($result);
        return $result;
    }

    /**
     * 执行语句 针对 INSERT, UPDATE 以及DELETE,exec结果返回受影响的行数
     * @param string $sql sql指令
     * @return integer
     */
    protected function _doExec($sql = '', $prepare = false)
    {
        $this->_sql = $sql;
        $this->_start_time = microtime();
        if ($prepare) {
            $pdostmt = self::$_dbh->prepare($this->_prepare_sql);
            $pdostmt->execute($this->_prepare_var);
        } else {
            $pdostmt = self::$_dbh->prepare($this->_sql);
            $pdostmt->execute();
        }
        $result = $pdostmt->rowCount();
        $this->_end_time = microtime();
        $this->log($result);
        return $result;
    }

    /**
     * 执行sql语句，自动判断进行查询或者执行操作
     * @param string $sql SQL指令
     * @return mixed
     */
    protected function _query($sql = '', $prepare_var = array())
    {
        $sql = str_replace('${prefix}', $this->_prefix, $sql);
        var_dump($sql);
        $prepare = false;
        if ($prepare_var && count($prepare_var) > 0) {
            $this->_prepare_var = $prepare_var;
            $prepare = true;
            $this->_prepare_sql = $sql;
        }

        $queryIps = 'INSERT|UPDATE|DELETE|REPLACE|CREATE|DROP|LOAD DATA|SELECT .* INTO|COPY|ALTER|GRANT|REVOKE|LOCK|UNLOCK';
        if (preg_match('/^\\s*"?(' . $queryIps . ')\\s+/i', $sql)) {
            return $this->_doExec($sql, $prepare);
        } else {
            return $this->_doQuery($sql, $prepare);
        }
    }

    /**
     * 获取最近一次查询的sql语句
     * @return String 执行的SQL
     */
    public function getLastSql()
    {
        return $this->_sql;
    }

    /**
     * 插入方法
     * @param array $data 字段-值的一维数组
     * @return int 受影响的行数
     */
    public function insert($data)
    {
        $this->_clear = 1;
        $temp = $this->trigger_handle('createBefore', $this->_where_options, $data);
        if ($temp) {
            $data = $temp;
        }
        $data = $this->_dataFormat($this->_table_name, $data);
        $temp_data = $data;
        if (!$data) {
            return;
        }
        $temp = array();
        foreach ($temp_data as $key => $value) {
            $tmp_key = str_replace('`', '', $key);
            $tem_value = $value;
            $temp[] = ':' . $tmp_key;
            $this->_prepare_var[':' . $tmp_key] = $tem_value;
        }
        $this->_prepare_sql = "insert into " . $this->_table_name . "(" . implode(',', array_keys($data)) . ") values(" . implode(',', $temp) . ")";
        $sql = "insert into " . $this->_table_name . "(" . implode(',', array_keys($data)) . ") values(" . implode(',', array_values($data)) . ")";
        $res = $this->_doExec($sql, true);
        $this->_clear = 1;
        $this->_clear();
        $this->trigger_handle('createAfter', $this->_where_options, $data);
        return $res;
    }

    /**
     * 删除方法
     * @return int 受影响的行数
     */
    public function delete()
    {
        //安全考虑,阻止全表删除
        if (!trim($this->_where)) {
            return false;
        }
        $this->trigger_handle('deleteBefore', $this->_where_options);
        $this->_prepare_sql = "delete from " . $this->_table_name . " " . $this->_perpare_where;
        $sql = "delete from " . $this->_table_name . " " . $this->_where;
        $res = $this->_doExec($sql, true);
        $this->_clear = 1;
        $this->_clear();
        $this->trigger_handle('deleteAfter', $this->_where_options);
        return $res;
    }

    /**
     * 更新函数
     * @param array $data 参数数组
     * @return int 受影响的行数
     */
    public function update($data)
    {
        //安全考虑,阻止全表更新
        if (!trim($this->_where)) {
            return false;
        }
        $temp = $this->trigger_handle('updateBefore', $this->_where_options, $data);
        if ($temp) {
            $data = $temp;
        }
        $data = $this->_dataFormat($this->_table_name, $data);
        $temp_data = $data;
        if (!$data) {
            return;
        }
        $temp = array();
        $index = '';
        $index_i = 0;
        foreach ($temp_data as $key => $value) {
            $tmp_key = str_replace('`', '', $key);
            $tem_value = $value;
            if (isset($this->_prepare_var[':' . $tmp_key])) {
                $index = '_' . $index_i;
                $tmp_key = $tmp_key . $index;
                $index_i++;
            }
            $temp[] = $key . '=:' . $tmp_key;
            $this->_prepare_var[':' . $tmp_key] = $tem_value;
        }
        $valArr = array();
        foreach ($data as $k => $v) {
            $valArr[] = $k . '=' . $v;
        }
        $this->_prepare_sql = "update " . trim($this->_table_name) . " set " . trim(implode(',', $temp)) . " " . trim($this->_perpare_where);
        $sql = "update " . trim($this->_table_name) . " set " . trim(implode(',', $valArr)) . " " . trim($this->_where);
        $res = $this->_doExec($sql, true);
        $this->_clear = 1;
        $this->_clear();
        $this->trigger_handle('updateAfter', $this->_where_options, $data);
        return $res;
    }

    public function auto($data = array())
    {
        //安全考虑,阻止全表更新
        if (!trim($this->_where)) {
            return false;
        }
        $str = '';
        if (is_array($data)) {
            $temp = $this->trigger_handle('updateBefore', $this->_where_options, $data);
            if ($temp) {
                $data = $temp;
            }
            $data = $this->_dataFormat($this->_table_name, $data);
            $temp = array();
            foreach ($data as $k => $v) {
                $s = substr($v, 0, 1);
                if ($s != '+' && $s != '-') {
                    $temp[] = $k . '=' . '\'' . $v . '\'';
                } else {
                    $temp[] = $k . '=' . $k . $v;
                }
            }
            $str = implode(',', $temp);
        } else if (is_string($data)) {
            $str = $data;
        } else {
            return false;
        }
        $this->_prepare_sql = "update " . trim($this->_table_name) . " set " . trim($str) . " " . trim($this->_perpare_where);
        $sql = "update " . trim($this->_table_name) . " set " . trim($str) . " " . trim($this->_where);
        $res = $this->_doExec($sql, true);
        $this->_clear = 1;
        $this->_clear();
        return $res;
    }

    /**
     * 获取表名（无前缀）
     * @param string $tbName 操作的数据表名
     * @return array 结果集
     */
    public function table($tbName = '', $callback = array())
    {
        $this->_table_name = $tbName;
        if ($callback && !isset(self::$handle[$this->_table_name])) {
            self::$handle[$this->_table_name] = $callback;
        }
        return $this;
    }

    /**
     * 获取表名（有前缀）
     * @param string $tbName 操作的数据表名
     * @return array 结果集
     */
    public function name($tbName = '', $callback = array())
    {
        $this->_table_name = $this->_prefix . $tbName;
        if ($callback && !isset(self::$handle[$this->_table_name])) {
            self::$handle[$this->_table_name] = $callback;
        }
        return $this;
    }

    /**
     * 联查函数
     */
    public function join($tbName, $left = null)
    {
        if (!isset($left)) {
            $left = "";
        }
        if (is_array($tbName)) {
            $temp = "";
            foreach ($tbName as $key) {
                $temp .= " {$left} join " . $this->_prefix . "{$key}";
            }
            $this->_join = $temp;
            unset($temp);
        } else {
            $tbName = $this->_prefix . $tbName;
            $this->_join = " {$left} join {$tbName}";
        }
        return $this;
    }

    /**
     * 查询函数
     * @return array 结果集
     */
    public function select()
    {
        $sql = "select " . trim($this->_field) . " from " . trim($this->_table_name) . " " . trim($this->_join) . " " . trim($this->_where) . " " . trim($this->_order) . " " . trim($this->_limit);
        $this->_prepare_sql = "select " . trim($this->_field) . " from " . trim($this->_table_name) . " " . trim($this->_join) . " " . trim($this->_perpare_where) . " " . trim($this->_order) . " " . trim($this->_limit);
        $arr = $this->_doQuery(trim($sql), true);
        $this->_clear = 1;
        $this->_clear();
        if ($arr) {
            $temp = $this->trigger_handle('selectDataFormat', $this->_where_options, $arr);
            if ($temp) {
                return $temp;
            }
        }
        return $arr;
    }

    /**
     * 查询函数(单条记录)
     * @return array 记录信息
     */
    public function find()
    {
        $sql = "select " . trim($this->_field) . " from " . trim($this->_table_name) . " " . trim($this->_join) . " " . trim($this->_where) . " " . trim($this->_order) . " limit 1";
        $this->_prepare_sql = "select " . trim($this->_field) . " from " . trim($this->_table_name) . " " . trim($this->_join) . " " . trim($this->_perpare_where) . " " . trim($this->_order) . " limit 1";
        $arr = $this->_doQuery(trim($sql), true);
        $this->_clear = 1;
        $this->_clear();
        if ($arr) {
            $temp = $this->trigger_handle('selectDataFormat', $this->_where_options, $arr);
            if ($temp) {
                $arr = $temp;
            }
            return isset($arr[0]) ? $arr[0] : null;
        }
        return null;
    }

    /**
     * @param mixed $option 组合条件的二维数组，例：$option['field1'] = array(1,'=>','or')
     * @return $this
     */
    public function where($option)
    {
        if (empty($option)) return $this;
        if ($this->_clear > 0) {
            $this->_clear();
        }
        $this->_where_options = $option;
        $this->_where = ' where ';
        $this->_perpare_where = ' where ';
        $logic = 'and';
        if (is_string($option)) {
            $this->_where .= $option;
        } elseif (is_array($option)) {
            $tem_var = array();
            foreach ($option as $k => $v) {
                if (is_array($v)) {
                    if (!is_numeric($k)) {
                        $relative = isset($v[1]) ? $v[1] : '=';
                        $logic = isset($v[2]) ? $v[2] : 'and';
                        $condition = ' (' . $this->_addChar($k) . ' ' . $relative . ' \'' . $v[0] . '\') ';
                        $this->_prepare_var[':' . $k] = $v[0];
                        $prepare_condition = ' (' . $this->_addChar($k) . ' ' . $relative . ' :' . $k . ') ';
                    } else {
                        $relative = isset($v[2]) ? $v[2] : '=';
                        $logic = isset($v[3]) ? $v[3] : 'and';
                        if ($relative == 'between') {
                            $condition = ' (' . $this->_addChar($v[0]) . ' ' . $relative . ' \'' . $v[1][0] . '\' and \'' . $v[1][1] . '\') ';
                            $this->_prepare_var[':' . $v[0] . '_1'] = $v[1][0];
                            $this->_prepare_var[':' . $v[0] . '_2'] = $v[1][1];
                            $prepare_condition = ' (' . $this->_addChar($v[0]) . ' ' . $relative . ' :' . $v[0] . '_1\' and :' . $v[0] . '_2\') ';
                        } else if ($relative == 'in') {
                            $temp = array();
                            $temp2 = array();
                            foreach ($v[1] as $k2 => $v2) {
                                $temp[] = ':' . $v[0] . '_' . $k2 . '';
                                $temp2[] = '\'' . $v2 . '\'';
                                $this->_prepare_var[':' . $v[0] . '_' . $k2] = $v2;
                            }
                            $condition = ' (' . $this->_addChar($v[0]) . ' ' . $relative . ' (' . implode(',', $temp2) . ')) ';
                            $prepare_condition = ' (' . $this->_addChar($v[0]) . ' ' . $relative . ' (' . implode(',', $temp) . ')) ';
                        } else {
                            $index = '';
                            if (isset($tem_var[$v[0]])) {
                                $tem_var[$v[0]]++;
                                $index = '_' . ($tem_var[$v[0]]);
                            } else {
                                $tem_var[$v[0]] = 0;
                            }
                            $condition = ' (' . $this->_addChar($v[0]) . ' ' . $relative . ' \'' . $v[1] . '\') ';
                            $this->_prepare_var[':' . $v[0] . $index] = $v[1];
                            $prepare_condition = ' (' . $this->_addChar($v[0]) . ' ' . $relative . ' :' . $v[0] . '' . $index . ') ';
                        }
                    }
                } else {
                    $logic = 'and';
                    $condition = ' (' . $this->_addChar($k) . '=\'' . $v . '\') ';
                    $this->_prepare_var[':' . $k] = $v;
                    $prepare_condition = ' (' . $this->_addChar($k) . '=:' . $k . ') ';
                }
                $this->_perpare_where .= isset($mark) ? $logic . $prepare_condition : $prepare_condition;
                $this->_where .= isset($mark) ? $logic . $condition : $condition;
                $mark = 1;
            }
        }
        return $this;
    }

    /**
     * 设置排序
     * @param mixed $option 排序条件数组 例:array('sort'=>'desc')
     * @return $this
     */
    public function order($option)
    {
        if ($this->_clear > 0) {
            $this->_clear();
        }
        $this->_order = ' order by ';
        if (is_string($option)) {
            $this->_order .= $option;
        } elseif (is_array($option)) {
            foreach ($option as $k => $v) {
                $order = $this->_addChar($k) . ' ' . $v;
                $this->_order .= isset($mark) ? ',' . $order : $order;
                $mark = 1;
            }
        }
        return $this;
    }

    /**
     * 设置查询行数及页数
     * @param int $page pageSize不为空时为页数，否则为行数
     * @param int $pageSize 为空则函数设定取出行数，不为空则设定取出行数及页数
     * @return $this
     */
    public function limit($page, $pageSize = null)
    {
        if ($page <= 0) return $this;
        if ($this->_clear > 0) {
            $this->_clear();
        }
        if ($pageSize === null) {
            $this->_limit = "limit " . $page;
        } else {
            $pageval = intval(($page - 1) * $pageSize);
            $this->_limit = "limit " . $pageval . "," . $pageSize;
        }
        return $this;
    }

    /**
     * 设置分页查询行数及页数
     */
    public function page($page = 1, $pageSize = 10)
    {
        if ($this->_clear > 0) {
            $this->_clear();
        }
        if ($pageSize === null) {
            $this->_limit = "limit " . $page;
        } else {
            $pageval = intval(($page - 1) * $pageSize);
            $this->_limit = "limit " . $pageval . "," . $pageSize;
        }
        $sql = "select " . trim($this->_field) . " from " . trim($this->_table_name) . " " . trim($this->_join) . " " . trim($this->_where) . " " . trim($this->_order) . " " . trim($this->_limit);
        $sql2 = trim("SELECT COUNT(*) as `num` FROM " . trim($this->_table_name) . " " . trim($this->_join) . " " . trim($this->_where) . " " . trim($this->_order));
        $this->_clear = 1;
        $this->_clear();
        $total = $this->_doQuery($sql2);
        $return = array();
        $return['list'] = $this->_doQuery(trim($sql));
        if ($return['list']) {
            $temp = $this->trigger_handle('selectDataFormat', $this->_where_options, $return['list']);
            if ($temp) {
                $return['list'] = $temp;
            }
        }
        $return['total'] = intval($total[0]['num']);
        $return['page'] = intval($page);
        $return['page_size'] = intval($pageSize);
        $this->_clear = 1;
        $this->_clear();
        return $return;
    }

    /**
     * 统计数量
     */
    public function count($field = '*')
    {
        if ($this->_clear > 0) {
            $this->_clear();
        }
        if ($field != '*') $field = '`' . $field . '`';
        $sql = "select COUNT(" . $field . ") as `num` from " . trim($this->_table_name) . " " . trim($this->_join) . " " . trim($this->_where) . " " . trim($this->_order) . " " . trim($this->_limit);
        $d = $this->_doQuery($sql);
        $num = $d[0]['num'];
        $this->_clear = 1;
        $this->_clear();
        return $num;
    }

    /**
     * 求和
     */
    public function sum($field = '*')
    {
        if ($this->_clear > 0) {
            $this->_clear();
        }
        $sql = "select SUM(`" . $field . "`) as `num` from " . trim($this->_table_name) . " " . trim($this->_join) . " " . trim($this->_where) . " " . trim($this->_order) . " " . trim($this->_limit);
        $d = $this->_doQuery($sql);
        $num = $d[0]['num'];
        $this->_clear = 1;
        $this->_clear();
        return $num;
    }

    /**
     * 设置查询字段
     * @param mixed $field 字段数组
     * @return $this
     */
    public function field($field)
    {
        if ($this->_clear > 0) {
            $this->_clear();
        }
        if (is_string($field)) {
            $field = explode(',', $field);
        }
        $nField = array_map(array($this, '_addChar'), $field);
        $this->_field = implode(',', $nField);
        return $this;
    }

    /**
     * 清理标记函数
     */
    protected function _clear()
    {
        $this->_where = '';
        $this->_order = '';
        $this->_limit = '';
        $this->_field = '*';
        $this->_join = '';
        $this->_prepare_var = array();
        $this->_prepare_sql = '';
        $this->_perpare_where = '';
        $this->_clear = 0;
    }

    /**
     * 手动清理标记
     * @return $this
     */
    public function clearKey()
    {
        $this->_clear();
        return $this;
    }

    /**
     * 启动事务
     * @return void
     */
    public function startTrans()
    {
        //数据rollback 支持
        if (self::$_trans == 0) {
            self::$_dbh->beginTransaction();
        }
        self::$_trans++;
    }

    /**
     * 用于非自动提交状态下面的查询提交
     * @return boolen
     */
    public function commit()
    {
        $result = true;
        if (self::$_trans > 0) {
            $result = self::$_dbh->commit();
            self::$_trans = 0;
        }
        return $result;
    }

    /**
     * 事务回滚
     * @return boolen
     */
    public function rollback()
    {
        $result = true;
        if (self::$_trans > 0) {
            $result = self::$_dbh->rollback();
            self::$_trans = 0;
        }
        return $result;
    }

    /**
     * 关闭连接
     * PHP 在脚本结束时会自动关闭连接。
     */
    public function close()
    {
        if (!is_null(self::$_dbh)) {
            self::$_dbh = null;
        }
    }
}
