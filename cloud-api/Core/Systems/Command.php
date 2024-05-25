<?php
/*
 * Title:沉沦云MVC开发框架
 * Project:命令行
 * Author:流逝中沉沦
 * QQ：1178710004
*/

namespace Systems;

class Command
{
    protected $argument = array(); //传递参数

    /**
     * 构造参数
     *
     * @param array $argument 参数
     */
    public function __construct($param = '')
    {
        if ($param) {
            $arr = explode(',', $param);
            foreach ($arr as $t) {
                $temp_arr = explode('=', $t);
                if (count($temp_arr) == 2) {
                    $this->argument[$temp_arr[0]] = $temp_arr[1];
                }
            }
        }
    }

    /**
     * 获取输入参数
     *
     * @param string $key 键
     * @return void
     */
    protected function getParam($key = '')
    {
        if ($key) {
            return isset($this->argument[$key]) ? $this->argument[$key] : null;
        } else {
            return $this->argument;
        }
    }

    /**
     * 执行任务
     *
     * @return void
     */
    public function execute()
    {
    }

    /**
     * 日志输出
     *
     * @return void
     */
    protected function prints()
    {
        $arg_list = func_get_args();
        echo $this->format($arg_list);
    }

    /**
     * 日志输出(换行)
     *
     * @return void
     */
    protected function println()
    {
        $arg_list = func_get_args();
        echo $this->format($arg_list) . "\n";
    }

    /**
     * 格式化参数
     *
     * @param array $arg_list
     * @return void
     */
    private function format($arg_list = array())
    {
        $txt = array();
        foreach ($arg_list as $key) {
            if (is_string($key) || is_numeric($key)) {
                $t = $key;
            } else {
                $t = Util::jsonEncode($key);
            }
            $txt[] = $t;
        }
        return date("Y-m-d H:i:s") . ' ' . implode('', $txt);
    }
}
