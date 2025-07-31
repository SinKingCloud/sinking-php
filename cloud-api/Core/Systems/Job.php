<?php
/*
 * Title:沉沦云MVC开发框架
 * Project:Job功能类
 * Author:流逝中沉沦
 * QQ：1178710004
*/

namespace Systems;

class Job extends Command
{
    protected $name; //job名称

    const STATUS_UNRUN = 1; //未执行
    const STATUS_SUCCESS = 2; //执行成功
    const STATUS_ERROR = 3; //执行失败

    /**
     * 推送任务
     *
     * @param array $data 数据
     * @param integer $delay 延迟秒数
     * @param integer $retry 重试次数
     * @return string 任务ID
     */
    public function producer($data = array(), $retry = 3, $delay = 0)
    {
        $temp = array(
            'id' => Util::getUuid(), //任务ID
            'name' => $this->name, //任务名称
            'data' => $data, //任务数据
            'retry' => $retry, //重试次数
            'delay' => $delay, //延迟秒数
            'retry_num' => 0, //已重试次数
            'status' => self::STATUS_UNRUN, //任务状态
            'push_time' => time(), //推送时间
            'consumer_time' => 0, //消费时间
        );
        if ($this->addJob($temp['id'], $temp)) {
            return $temp['id'];
        }
        return false;
    }

    /**
     * 消费任务
     *
     * @param integer $num 消费数量
     * @return boolean 是否消费完
     */
    public function consumer($num = 200)
    {
        $jobs = $this->getJob($num);
        foreach ($jobs['data'] as $job) {
            $id = isset($job['id']) && $job['id'] ? $job['id'] : '';
            if ($id) {
                //判断是否延迟任务
                if (time() - $job['push_time'] < $job['delay']) {
                    $this->addJob($job['id'], $job);
                } else {
                    $r = $this->handle($id, $job['data']);
                    $job['retry_num']++;
                    $job['consumer_time'] = time();
                    $job['status'] = $r !== false ? self::STATUS_SUCCESS : self::STATUS_ERROR;
                    if ($r === false && $job['retry_num'] < $job['retry']) {
                        $this->addJob($job['id'], $job);
                    }
                }
            }
        }
        return $jobs['bottom'];
    }

    /**
     * 监听执行任务
     *
     * @return void
     */
    public function execute()
    {
        $num = intval($this->getParam('num'));
        $num = $num > 0 ? $num : 200;
        $this->println('listening to [', $this->name, '] success.');
        while (true) {
            try {
                $is_end = $this->consumer($num);
                if ($is_end) {
                    sleep(5);
                }
            } catch (\Throwable $th) {
                $this->println('run error file ', $th->getFile(), '.the line ', $th->getLine(), '.the message ', $th->getMessage());
            }
        }
    }

    /**
     * 业务逻辑
     *
     * @return void
     */
    public function handle($id, $data = array())
    {
    }

    /**
     * 获取任务
     *
     * @param integer $num 数量
     * @return void
     */
    private function getJob($num = 200)
    {
        //使用并发锁，避免进程冲突
        $obj = &$this;
        $file = $this->getJobFile();
        $txts = array();
        $bottom = false;
        Cache::lock(__CLASS__ . __FUNCTION__ . $this->name, function () use (&$obj, &$file, &$num, &$txts, &$bottom) {
            $index = $obj->getJobIndex(); //获取行数
            $index = $index <= 1 ? 1 : $index;
            $d = $obj->getFileLines($file, $index, $num);
            $txts = $d['data'];
            if ($d['bottom']) {
                $bottom = true;
                File::CreateFile($file, "<?php exit;?>\n", true);
                $obj->setJobIndex(1);
            } else {
                $obj->setJobIndex($index + count($txts));
            }
        }, true);
        //方序列化
        $temp = array();
        foreach ($txts as $txt) {
            $tmp = unserialize($txt);
            if ($tmp) {
                $temp[] = $tmp;
            }
        }
        return array('bottom' => $bottom, 'data' => $temp);
    }

    /**
     * 添加任务
     *
     * @param string $id 任务ID
     * @param array $data 数据
     * @return void
     */
    private function addJob($id, $data = array())
    {
        //使用并发锁，避免任务丢失
        $res = 0;
        $file = $this->getJobFile();
        Cache::lock(__CLASS__ . __FUNCTION__ . $this->name, function () use (&$res, &$file, &$data) {
            $fh = fopen($file, "a+");
            $res = fwrite($fh, serialize($data) . "\n"); // 输出：6
            fclose($fh);
        }, true);
        return $res > 0;
    }

    /**
     * 获取文件指定行数
     *
     * @param string $filename 文件
     * @param integer $start_line 开始行数
     * @param integer $lines 截取行数
     * @return void
     */
    private function getFileLines($filename, $start_line = 1, $lines = 1)
    {
        $content = array();
        $fp = new \SplFileObject($filename, 'rb');
        $valid = false;
        $fp->seek($start_line); //转到第n行
        for ($i = 1; $i <= $lines; $i++) {
            $txt = trim($fp->current());
            if (!$fp->valid() || empty($txt)) {
                $valid = true;
                break;
            }
            $content[] = $txt;
            $fp->next(); //下一行
        }
        return array('bottom' => $valid, 'data' => $content);
    }

    /**
     * 获取任务文件
     *
     * @return void
     */
    private function getJobFile()
    {
        $config = Config::get();
        $file = $config['cache_dir'] . '/Job/List_' . $this->name . '.php';
        File::CreateFile($file, "<?php exit;?>\n", false);
        return $file;
    }

    /**
     * 获取任务下标
     *
     * @return void
     */
    private function getJobIndex()
    {
        $config = Config::get();
        $file = $config['cache_dir'] . '/Job/Index_' . $this->name . '.php';
        return intval(File::init($file)->read());
    }

    /**
     * 设置任务下标
     *
     * @param integer $index 下标
     * @return void
     */
    private function setJobIndex($index = 0)
    {
        $config = Config::get();
        $file = $config['cache_dir'] . '/Job/Index_' . $this->name . '.php';
        File::CreateFile($file, (string)$index, true);
    }
}
