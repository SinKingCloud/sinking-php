<?php

namespace app\Service;

use app\Base\BaseService;
use app\Model\Count;
use Systems\Cache;

class CountService extends BaseService
{
    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = Count::getClass();//兼容php5.4
        $this->model = new $class();
    }

    /**
     * 首次初始化数据
     *
     * @return void
     */
    private function first($p_web_id = 0, $web_id = 0, $user_id = 0, $type = Count::TYPE_ALL, $date = '')
    {
        $key = __FUNCTION__ . $p_web_id . '-' . $web_id . '-' . $user_id . '-' . $type . '-' . $date;
        //判断是否存在数据
        if (!Cache::get($key)) {
            $res = false;
            //设置并发锁,防止重复写入
            $obj = &$this; #兼容php5.4
            Cache::lock('lock' . $key, function () use ($p_web_id, $web_id, $user_id, $type, $date, &$obj, &$res) {
                $n = $obj->count(array('p_web_id' => $p_web_id, 'web_id' => $web_id, 'user_id' => $user_id, 'type' => $type, 'date' => $date));
                if ($n <= 0) {
                    //写入数据
                    $res = $obj->create(array(
                        'p_web_id' => $p_web_id,
                        'web_id' => $web_id,
                        'user_id' => $user_id,
                        'type' => $type,
                        Count::FIELD_DATE => $date,
                        Count::FIELD_ORDER_NUM => 0,
                        Count::FIELD_ORDER_SUCC_NUM => 0,
                        Count::FIELD_CONS_MONEY => 0,
                        Count::FIELD_RECH_MONEY => 0,
                        Count::FIELD_DEDU_MONEY => 0,
                        Count::FIELD_SITE_NUM =>  0,
                        Count::FIELD_USER_NUM =>  0,
                    ));
                } else {
                    $res = true;
                }
            }, true);
            if ($res) {
                Cache::set($key, 1, 86400);
            }
            return $res;
        } else {
            return true;
        }
    }

    /**
     * 自增设置
     *
     * @param integer $p_web_id 上级站点ID
     * @param integer $web_id 站点ID
     * @param integer $user_id 用户ID
     * @param integer $type 类型
     * @param string $date 日期
     * @param array $data 数据
     * @return void
     */
    private function setAuto($p_web_id = 0, $web_id = 0, $user_id = 0, $type = Count::TYPE_ALL, $date = '', $data = array())
    {
        if (!$this->first($p_web_id, $web_id, $user_id, $type, $date)) return false;
        return $this->auto(array(
            'p_web_id' => $p_web_id,
            'web_id' => $web_id,
            'user_id' => $user_id,
            'type' => $type,
            'date' => $date,
        ), $data);
    }

    /**
     * 设置数据
     *
     * @param integer $web_id 站点ID
     * @param integer $user_id 用户ID
     * @param integer $type 统计类型
     * @param array $data 统计数据
     * @return void
     */
    public function set($web_id = 0, $user_id = 0, $data = array())
    {
        $web = WebService::getInstance()->get($web_id);
        if ($web) {
            $p_web_id = $web['web_id'];
        } else {
            $p_web_id = 0;
        }
        $this->setAuto($p_web_id, $web_id, $user_id, Count::TYPE_ALL, '0001-01-01', $data); //累计统计
        $this->setAuto($p_web_id, $web_id, $user_id, Count::TYPE_DAY, date("Y-m-d"), $data); //日统计
        $this->setAuto($p_web_id, $web_id, $user_id, Count::TYPE_WEEK, date('Y-m-d', (time() - ((date('w') == 0 ? 7 : date('w')) - 1) * 24 * 3600)), $data); //周统计
        $this->setAuto($p_web_id, $web_id, $user_id, Count::TYPE_MONTH, date("Y-m-01"), $data); //月统计
        $this->setAuto($p_web_id, $web_id, $user_id, Count::TYPE_YEAR, date("Y-01-01"), $data); //年统计
    }

    /**
     * 获取top用户
     *
     * @param integer $web_id 站点ID
     * @param integer $type 类型
     * @param string $order_by 排序日期
     * @param string $start_date 开始日期
     * @param string $end_date 结束日期
     * @param integer $limit 前多少条
     * @return void
     */
    public function getTopUser($web_id = 0, $order_by = Count::FIELD_CONS_MONEY, $limit = 20)
    {
        //查询条件
        $where = array();
        if ($web_id > 0) {
            //站点信息
            $web = WebService::getInstance()->get($web_id);
            if ($web) {
                $where['p_web_id'] = $web['web_id'];
                $where['web_id'] = $web['id'];
            }
        }
        $where['user_id'] = array(0, '>', 'and');
        $where['type'] = Count::TYPE_ALL;
        $field = array(
            'user_id',
            Count::FIELD_ORDER_NUM,
            Count::FIELD_ORDER_SUCC_NUM,
            Count::FIELD_CONS_MONEY,
            Count::FIELD_RECH_MONEY,
            Count::FIELD_DEDU_MONEY,
            Count::FIELD_SITE_NUM,
            Count::FIELD_USER_NUM,
        );
        $data = $this->select($where, $order_by, 'desc', implode(',', $field), $limit);
        foreach ($data as &$key) {
            $temp_user = UserService::getInstance()->get($key['user_id']);
            $key['user'] = array(
                'id' => $temp_user['id'],
                'nick_name' => $temp_user['nick_name'],
            );
        }
        return $data;
    }

    /**
     * 获取top站点
     *
     * @param integer $p_web_id 上级站点ID
     * @param integer $type 类型
     * @param string $order_by 排序日期
     * @param string $start_date 开始日期
     * @param string $end_date 结束日期
     * @param integer $limit 前多少条
     * @return void
     */
    public function getTopWeb($p_web_id = 0, $order_by = Count::FIELD_CONS_MONEY, $limit = 20)
    {
        //查询条件
        $where = array();
        if ($p_web_id > 0) {
            $where['p_web_id'] = $p_web_id;
        }
        $where['web_id'] = array(0, '>', 'and');
        $where['user_id'] = 0;
        $where['type'] = Count::TYPE_ALL;
        $field = array(
            'web_id',
            Count::FIELD_ORDER_NUM,
            Count::FIELD_ORDER_SUCC_NUM,
            Count::FIELD_CONS_MONEY,
            Count::FIELD_RECH_MONEY,
            Count::FIELD_DEDU_MONEY,
            Count::FIELD_SITE_NUM,
            Count::FIELD_USER_NUM,
        );
        $data = $this->select($where, $order_by, 'desc', implode(',', $field), $limit);
        foreach ($data as &$key) {
            $temp_web = WebService::getInstance()->get($key['web_id']);
            $key['web'] = array(
                'id' => $temp_web['id'],
                'name' => $temp_web['name'],
            );
        }
        return $data;
    }

    /**
     * 用户统计
     *
     * @param integer $user_id 用户ID
     * @param integer $type 统计类型
     * @param string $start_date 开始日期
     * @param string $end_date 截止日期
     * @return void
     */
    public function getUser($user_id = 0, $type = Count::TYPE_ALL, $start_date = '', $end_date = '')
    {
        //用户信息
        $user = UserService::getInstance()->get($user_id);
        if (!$user) {
            return false;
        }
        //站点信息
        $web = WebService::getInstance()->get($user['web_id']);
        if (!$web) {
            return false;
        }
        //查询条件
        $where = array(
            'p_web_id' => $web['web_id'],
            'web_id' => $web['id'],
            'user_id' => $user['id'],
            'type' => $type
        );
        return $this->getCountData($type, $where, $start_date, $end_date);
    }

    /**
     * 站点统计
     *
     * @param integer $web_id 站点ID
     * @param integer $type 统计类型
     * @param string $start_date 开始日期
     * @param string $end_date 截止日期
     * @return void
     */
    public function getWeb($web_id = 0, $type = Count::TYPE_ALL, $start_date = '', $end_date = '')
    {
        //站点信息
        $web = WebService::getInstance()->get($web_id);
        if (!$web) {
            return false;
        }
        //查询条件
        $where = array(
            'p_web_id' => $web['web_id'],
            'web_id' => $web['id'],
            'user_id' => 0,
            'type' => $type
        );
        return $this->getCountData($type, $where, $start_date, $end_date);
    }


    /**
     * 系统统计
     *
     * @param integer $type 统计类型
     * @param string $start_date 开始日期
     * @param string $end_date 截止日期
     * @return void
     */
    public function getSystem($type = Count::TYPE_ALL, $start_date = '', $end_date = '')
    {
        //查询条件
        $where = array(
            'p_web_id' => 0,
            'web_id' => 0,
            'user_id' => 0,
            'type' => $type
        );
        return $this->getCountData($type, $where, $start_date, $end_date);
    }

    /**
     * 获取统计数据
     *
     * @param integer $type 统计类型
     * @param array $where 查询条件
     * @param string $start_date 开始日期
     * @param string $end_date 截止日期
     * @return void
     */
    private function getCountData($type = Count::TYPE_ALL, $where = array(), $start_date = '', $end_date = '')
    {
        $data = array();
        switch ($type) {
            case Count::TYPE_ALL: #累计统计
                $data = $this->dataFormat(Count::TYPE_ALL, $this->find($where, '*'));
                break;
            case Count::TYPE_DAY: #日统计
            case Count::TYPE_WEEK: #周统计
            case Count::TYPE_MONTH: #月统计
            case Count::TYPE_YEAR: #年统计
                if ($start_date) {
                    $where[] = array('date', $start_date, '>=', 'and');
                }
                if ($end_date) {
                    $where[] = array('date', $end_date, '<=', 'and');
                }
                $data = $this->dataFormat($type, $this->select($where, 'date', 'desc', '*'), $start_date, $end_date);
                break;
        }
        return $data;
    }
    /**
     * 格式化数据
     *
     * @param integer $type 类型
     * @param array $data 数据
     * @param string $start_date 开始日期
     * @param string $end_date 截止日期
     * @return void
     */
    private function dataFormat($type = Count::TYPE_ALL, $data = array(), $start_date = '', $end_date = '')
    {
        if ($type == Count::TYPE_ALL) {
            return array(
                'order_num' => isset($data['order_num']) ? intval($data['order_num']) : 0,
                'order_succ_num' => isset($data['order_succ_num']) ? intval($data['order_succ_num']) : 0,
                'consume_money' => isset($data['consume_money']) ? round($data['consume_money'], 2) : 0,
                'recharge_money' => isset($data['recharge_money']) ? round($data['recharge_money'], 2) : 0,
                'deduct_money' => isset($data['deduct_money']) ? round($data['deduct_money'], 2) : 0,
                'site_num' => isset($data['site_num']) ? intval($data['site_num']) : 0,
                'user_num' => isset($data['user_num']) ? intval($data['user_num']) : 0,
            );
        }
        //转换条件
        $start_time = $start_date ? strtotime($start_date) : 0;
        $end_time = $end_date ? strtotime($end_date) + 86400 : 0;
        if ($start_time == 0 || $end_time == 0) {
            return $data;
        }
        //日期map
        $map = array();
        foreach ($data as $key) {
            $map[$key['date']] = $key;
        }
        //默认数据
        $default = array(
            Count::FIELD_ORDER_NUM => 0,
            Count::FIELD_ORDER_SUCC_NUM => 0,
            Count::FIELD_CONS_MONEY => 0,
            Count::FIELD_RECH_MONEY => 0,
            Count::FIELD_DEDU_MONEY => 0,
            Count::FIELD_SITE_NUM =>  0,
            Count::FIELD_USER_NUM =>  0,
        );
        //开始处理
        $temp = array();
        $add_num = 86400;
        $add_fun = function ($i) {
            return 86400;
        };
        $date_fun = function ($i) {
            return date("Y-m-d", $i);
        };
        switch ($type) {
            case Count::TYPE_DAY: #日统计
                $add_fun = function ($i) {
                    return 86400;
                };
                $date_fun = function ($i) {
                    return date("Y-m-d", $i);
                };
                break;
            case Count::TYPE_WEEK:
                $add_fun = function ($i) {
                    return 86400 * 7;
                };
                $date_fun = function ($i) {
                    return date('Y-m-d', ($i - ((date('w') == 0 ? 7 : date('w')) - 3) * 86400));
                };
                break;
            case Count::TYPE_MONTH:
                $add_fun = function ($i) {
                    return 86400 * date("t", strtotime(date("Y-m-d", $i)));
                };
                $date_fun = function ($i) {
                    return date('Y-m-01', $i);
                };
                break;
            case Count::TYPE_YEAR:
                $add_fun = function ($i) {
                    return 86400 * 366;
                };
                $date_fun = function ($i) {
                    return date('Y-01-01', $i);
                };
                break;
        }
        for ($i = $start_time; $i < $end_time; $i += $add_fun($i)) {
            $date = $date_fun($i);
            if (isset($map[$date])) {
                $temp[] = array(
                    Count::FIELD_DATE => $date,
                    Count::FIELD_ORDER_NUM => isset($map[$date][Count::FIELD_ORDER_NUM]) ? intval($map[$date][Count::FIELD_ORDER_NUM]) : 0,
                    Count::FIELD_ORDER_SUCC_NUM => isset($map[$date][Count::FIELD_ORDER_SUCC_NUM]) ? intval($map[$date][Count::FIELD_ORDER_SUCC_NUM]) : 0,
                    Count::FIELD_CONS_MONEY =>  isset($map[$date][Count::FIELD_CONS_MONEY]) ? round($map[$date][Count::FIELD_CONS_MONEY], 2) : 0,
                    Count::FIELD_RECH_MONEY =>  isset($map[$date][Count::FIELD_RECH_MONEY]) ? round($map[$date][Count::FIELD_RECH_MONEY], 2) : 0,
                    Count::FIELD_DEDU_MONEY => isset($map[$date][Count::FIELD_DEDU_MONEY]) ? round($map[$date][Count::FIELD_DEDU_MONEY], 2) : 0,
                    Count::FIELD_SITE_NUM => isset($map[$date][Count::FIELD_SITE_NUM]) ? intval($map[$date][Count::FIELD_SITE_NUM]) : 0,
                    Count::FIELD_USER_NUM => isset($map[$date][Count::FIELD_USER_NUM]) ? intval($map[$date][Count::FIELD_USER_NUM]) : 0,
                );
            } else {
                $t = $default;
                $t[Count::FIELD_DATE] = $date;
                $temp[] = $t;
            }
        }
        return $temp;
    }
}
