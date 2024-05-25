<?php

namespace app\Service;

use app\Base\BaseService;
use app\Constant\Config as Constant;
use app\Constant\Lock;
use app\Model\Order;
use app\Model\Pay;
use app\Model\User;
use Systems\Cache;
use Systems\Util;

class OrderService extends BaseService
{
    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = Order::getClass(); //兼容php5.4
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
        if (isset($where['web_id']) && $where['web_id'] > 0) {
            $where_map['web_id'] = $where['web_id'];
        }
        if (isset($where['user_id']) && $where['user_id'] > 0) {
            $where_map['user_id'] = $where['user_id'];
        }
        if (isset($where['pay_type']) && $where['pay_type'] >= 0) {
            $where_map['pay_type'] = $where['pay_type'];
        }
        if (isset($where['order_type']) && $where['order_type'] >= 0) {
            $where_map['order_type'] = $where['order_type'];
        }
        if (isset($where['trade_no']) && $where['trade_no']) {
            $where_map['trade_no'] = $where['trade_no'];
        }
        if (isset($where['out_trade_no']) && $where['out_trade_no']) {
            $where_map['out_trade_no'] = $where['out_trade_no'];
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
        $field = 'id,web_id,user_id,name,pay_type,order_type,trade_no,out_trade_no,money,commission_money,status,create_time,update_time';
        return parent::page($where_map, $order_field, $order_type, $page, $page_size, $field);
    }

    /**
     * 批量删除
     *
     * @param array $where 条件
     * @return void
     */
    public function delete($where = array())
    {
        $where_map = array();
        if (isset($where['pay_type']) && $where['pay_type'] >= 0) {
            $where_map['pay_type'] = $where['pay_type'];
        }
        if (isset($where['order_type']) && $where['order_type'] >= 0) {
            $where_map['order_type'] = $where['order_type'];
        }
        if (isset($where['trade_no']) && $where['trade_no']) {
            $where_map['trade_no'] = $where['trade_no'];
        }
        if (isset($where['out_trade_no']) && $where['out_trade_no']) {
            $where_map['out_trade_no'] = $where['out_trade_no'];
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
        return parent::delete($where_map);
    }

    /**
     * 判断支付通道是否可用
     *
     * @param integer $pay_type 支付方式
     * @return void
     */
    public function checkPayType($pay_type = 0)
    {
        $config = ConfigService::getInstance();
        $res = false;
        switch ($pay_type) {
            case Order::PAY_TYPE_QQ:
                $res = $config->get(Constant::SYSTEM_PAY_QQPAY_TYPE) != '0';
                break;
            case Order::PAY_TYPE_ALI:
                $res = $config->get(Constant::SYSTEM_PAY_ALIPAY_TYPE) != '0';
                break;
            case Order::PAY_TYPE_WX:
                $res = $config->get(Constant::SYSTEM_PAY_WXPAY_TYPE) != '0';
                break;
            default:
                $res = true;
                break;
        }
        return $res;
    }

    /**
     * 构建订单参数
     *
     * @param integer $type 类型
     * @param array $data 数据
     * @return void
     */
    public function buildParam($type = 0, $data = array())
    {
        $temp  = array();
        switch ($type) {
            case Order::ORDER_TYPE_REWEB:
                if (empty($data['web_id']) || empty($data['month'])) {
                    return false;
                }
                $temp = array(
                    'web_id' => intval($data['web_id']),
                    'month' => intval($data['month']),
                );
                break;
            case Order::ORDER_TYPE_RECHARGE: //余额充值
                if (empty($data['user_id']) || empty($data['money'])) {
                    return false;
                }
                $temp = array(
                    'user_id' => intval($data['user_id']),
                    'money' => round($data['money'], 2),
                );
                break;
            case Order::ORDER_TYPE_WEB: //开通网站
                if (empty($data['user_id']) || empty($data['name']) || empty($data['domain'])) {
                    return false;
                }
                $temp = array(
                    'user_id' => intval($data['user_id']),
                    'name' => $data['name'],
                    'domain' => $data['domain'],
                );
                break;
            case Order::ORDER_TYPE_BUY: //在线下单
                $temp = $data;
                break;
        }
        return $temp;
    }


    /**
     * 订单处理(余额充值)
     *
     * @param integer $trade_no 订单号
     * @param array $param 参数
     * @return void
     */
    private function orderRecharge($trade_no, $param = array())
    {
        $user_id = intval($param['user_id']);
        $money = round($param['money'], 2);
        $user = UserService::getInstance()->get($user_id);
        if ($user) {
            //增加余额
            UserService::getInstance()->auto($user['id'], array('money' => '+' . $money));
            //写入记录
            PayService::getInstance()->create(array(
                'user_id' => $user['id'],
                'type' => Pay::TYPE_ADD,
                'money' => $money,
                'title' => Pay::TITLE_RECHARGE,
                'content' => '在线充值(订单号:' . $trade_no . ')充值' . $money . '元。'
            ));
            //清理缓存
            UserService::getInstance()->clear($user['id']);
            //写入充值统计
            $inc_data = array('recharge_money' => '+' . $money);
            CountService::getInstance()->set(0, 0, $inc_data); //系统统计
            CountService::getInstance()->set($user['web_id'], 0, $inc_data); //站点统计
            CountService::getInstance()->set($user['web_id'], $user['id'], $inc_data); //用户统计
        }
        return true;
    }

    /**
     * 订单处理(开通网站)
     *
     * @param integer $trade_no 订单号
     * @param array $param 参数
     * @return void
     */
    private function orderWeb($trade_no, $param = array())
    {
        $user_id = intval($param['user_id']);
        $name = $param['name'];
        $domain = $param['domain'];
        return WebService::getInstance()->add($user_id, $name, $domain);
    }

    /**
     * 订单处理(在线下单)
     *
     * @param integer $trade_no 订单号
     * @param array $param 参数
     * @return void
     */
    private function orderBuy($trade_no, $param = array())
    {
        return true;
    }

    /**
     * 订单处理(续费网站)
     *
     * @param integer $trade_no 订单号
     * @param array $param 参数
     * @return void
     */
    private function orderReWeb($trade_no, $param = array())
    {
        $web_id = intval($param['web_id']);
        $month = intval($param['month']);
        if ($month <= 0) {
            $month = 1;
        }
        $web = WebService::getInstance()->get($web_id, true);
        if ($web) {
            $time = strtotime($web['expire_time']);
            if ($time < time()) {
                $time = time();
            }
            $datetime = new \DateTime();
            $data = array(
                'expire_time' => $datetime->setTimestamp($time + $month * 30 * 24 * 60 * 60)->format('Y-m-d H:i:s'),
            );
            WebService::getInstance()->update(array('id' => $web['id']), $data);
            WebService::getInstance()->clear($web['id']);
        }
        return true;
    }


    /**
     * 更改订单状态
     *
     * @param integer $trade_no 订单号
     * @param integer $out_trade_no 外部订单号
     * @return void
     */
    public function changeStatus($trade_no, $out_trade_no)
    {
        $order_info = $this->find(array('trade_no' => $trade_no));
        if (!$order_info) {
            return $this->error('该订单不存在');
        }
        if ($order_info['status'] != Order::STATUS_UNPAY) {
            return $this->error('该订单已支付');
        }

        //解析参数
        $param = json_decode($order_info['param'], true);
        $param = is_array($param) ? $param : array();

        //执行业务
        Order::startTrans(); //开启事务
        $res = false;
        switch ($order_info['order_type']) {
            case Order::ORDER_TYPE_RECHARGE: //余额充值
                $res = $this->orderRecharge($trade_no, $param);
                break;
            case Order::ORDER_TYPE_WEB: //开通分站
                $res = $this->orderWeb($trade_no, $param);
                break;
            case Order::ORDER_TYPE_BUY: //在线下单
                $res = $this->orderBuy($trade_no, $param);
                break;
            case Order::ORDER_TYPE_REWEB: //网站续期
                $res = $this->orderReWeb($trade_no, $param);
                break;
        }
        //更改订单状态
        if ($res) {
            if ($this->update(array('trade_no' => $trade_no), array('status' => Order::STATUS_PAYED, 'out_trade_no' => $out_trade_no))) {
                //发放提成
                if ($order_info['commission_money'] > 0) {
                    //站长提成
                    $web = WebService::getInstance()->get($order_info['web_id']);
                    if ($web) {
                        $user = UserService::getInstance()->get($web['user_id']);
                        if ($user && $user['status'] == User::STATUS_NORMAL) {
                            $money = round($order_info['commission_money'], 2);
                            //增加余额
                            UserService::getInstance()->auto($user['id'], array('money' => '+' . $money));
                            //写入记录
                            PayService::getInstance()->create(array(
                                'user_id' => $user['id'],
                                'type' => Pay::TYPE_ADD,
                                'money' => $money,
                                'title' => Pay::TITLE_COST,
                                'content' => '网站订单(订单号:' . $trade_no . ')提成' . $money . '元。'
                            ));
                            //清理缓存
                            UserService::getInstance()->clear($user['id']);
                            //写入提成统计
                            $inc_data = array('deduct_money' => '+' . $money);
                            CountService::getInstance()->set(0, 0, $inc_data); //系统统计
                            CountService::getInstance()->set($user['web_id'], 0, $inc_data); //站点统计
                            CountService::getInstance()->set($user['web_id'], $user['id'], $inc_data); //用户统计
                        }
                    }
                    //站长上级提成
                    $p_web = WebService::getInstance()->get($web['web_id']);
                    if ($p_web) {
                        $p_user = UserService::getInstance()->get($p_web['user_id']);
                        if ($p_user && $p_user['status'] == User::STATUS_NORMAL) {
                            $num = intval(ConfigService::getInstance()->get(Constant::SYSTEM_SITE_ORDER_DEDUCT)); //提成百分比
                            if ($num > 0) {
                                $money = round(round($order_info['commission_money'] / 100, 2) * $num, 2); //计算提成金额
                                //增加余额
                                UserService::getInstance()->auto($p_user['id'], array('money' => '+' . $money));
                                //写入记录
                                PayService::getInstance()->create(array(
                                    'user_id' => $p_user['id'],
                                    'type' => Pay::TYPE_ADD,
                                    'money' => $money,
                                    'title' => Pay::TITLE_COST_USER,
                                    'content' => '下级网站' . $web['name'] . '(ID:' . $web['id'] . ')订单(订单号:' . $trade_no . ')提成' . $money . '元。'
                                ));
                                //清理缓存
                                UserService::getInstance()->clear($p_user['id']);
                                //写入提成统计
                                $inc_data = array('deduct_money' => '+' . $money);
                                CountService::getInstance()->set(0, 0, $inc_data); //系统统计
                                CountService::getInstance()->set($p_user['web_id'], 0, $inc_data); //站点统计
                                CountService::getInstance()->set($p_user['web_id'], $p_user['id'], $inc_data); //用户统计
                            }
                        }
                    }
                }
                //写入成功订单统计
                $inc_data = array('order_succ_num' => '+1');
                //写入消费统计
                if ($order_info['order_type'] != Order::ORDER_TYPE_RECHARGE) {
                    $inc_data['consume_money'] = '+' . $order_info['money'];
                }
                CountService::getInstance()->set(0, 0, $inc_data); //系统统计
                CountService::getInstance()->set($order_info['web_id'], 0, $inc_data); //站点统计
                CountService::getInstance()->set($order_info['web_id'], $order_info['user_id'], $inc_data); //用户统计
                Order::commit(); //提交事务
                return true;
            }
        }
        Order::rollback(); //回滚事务
        return $this->error('更改订单状态失败');
    }

    /**
     * 更改订单状态(并发锁)
     *
     * @param integer $trade_no 订单号
     * @param integer $out_trade_no 外部订单号
     * @return void
     */
    public function changeStatusSync($trade_no, $out_trade_no)
    {
        $res = false;
        $obj = &$this;
        Cache::lock(Lock::ORDER_STATUS . $trade_no, function () use (&$res, &$obj, $trade_no, $out_trade_no) {
            $res = $obj->changeStatus($trade_no, $out_trade_no);
        }, true);
        return $res;
    }

    /**
     * 创建订单
     *
     * @param integer $web_id 网站ID
     * @param integer $user_id 用户ID
     * @param integer $pay_type 支付方式
     * @param integer $order_type 订单类型
     * @param integer $money 订单金额
     * @param string $name 订单名称
     * @param array $param 订单参数
     * @param integer $commission_money 提成金额
     * @return void
     */
    public function add($web_id = 0, $user_id = 0, $pay_type = Order::PAY_TYPE_MONEY, $order_type = Order::ORDER_TYPE_RECHARGE, $money = 0, $name = '', $param = array(), $commission_money = 0)
    {
        //判断相关参数
        if (!$this->checkPayType($pay_type)) {
            return $this->error('该支付通道已关闭');
        }
        if ($web_id > 0) {
            $web = WebService::getInstance()->get($web_id);
            if (!$web) {
                return $this->error('此站点不存在');
            }
        }
        if ($user_id > 0) {
            $user = UserService::getInstance()->get($user_id);
            if (!$user) {
                return $this->error('此用户不存在');
            }
        }

        //根据订单类型计算相关提成
        $trade_no = date("YmdHis") . rand(100000, 999999); //订单号
        //站长和余额下单无提成
        if ($web['user_id'] != $user['id'] && $commission_money <= 0) {
            if ($order_type == Order::ORDER_TYPE_RECHARGE && $pay_type != Order::PAY_TYPE_MONEY) {
                //在线充值
                $num = intval(ConfigService::getInstance()->get(Constant::SYSTEM_SITE_RECHARGE_DEDUCT)); //提成百分比
                if ($num > 0) {
                    $commission_money = round($money / 100, 2) * $num;
                }
            } else if ($order_type == Order::ORDER_TYPE_WEB) {
                //开通网站
                $my_price = round(ConfigService::getInstance()->get(Constant::SYSTEM_SITE_COST_PRICE), 2);
                if ($money - $my_price > 0) {
                    $commission_money = round($money - $my_price, 2);
                }
            }
        }

        //构建订单
        $data = array(
            'web_id' => $web_id,
            'user_id' => $user_id,
            'pay_type' => $pay_type,
            'order_type' => $order_type,
            'name' => $name ? $name : ($order_type == Order::ORDER_TYPE_RECHARGE ? '在线充值' : ($order_type == Order::ORDER_TYPE_BUY ? '在线下单' : '开通主站')),
            'money' => round($money, 2),
            'commission_money' => round($commission_money, 2),
            'trade_no' => $trade_no,
            'param' => json_encode($param),
            'status' => Order::STATUS_UNPAY,
        );

        //写入订单
        if ($this->create($data)) {
            //写入订单统计
            CountService::getInstance()->set(0, 0, array('order_num' => '+1')); //系统统计
            CountService::getInstance()->set($web['id'], 0, array('order_num' => '+1')); //站点统计
            CountService::getInstance()->set($user['web_id'], $user['id'], array('order_num' => '+1')); //用户统计
            return $trade_no;
        } else {
            return $this->error('订单创建失败,请联系管理员');
        }
    }

    /**
     * 获取支付链接
     *
     * @param array $order_info 订单信息
     * @param string $type 通道类型
     * @param string $pay_type 支付类型
     * @return void
     */
    public function getPayUrl($order_info = array(), $type = 'epay1', $pay_type = 'alipay')
    {
        //易支付
        if (mb_substr($type, 0, 4) == 'epay') {
            $config = ConfigService::getInstance();
            $pay_config = array(
                'apiurl' => $config->get('pay.' . $type . '.url'),
                'pid' => $config->get('pay.' . $type . '.appid'),
                'key' => $config->get('pay.' . $type . '.key'),
            );
            $parameter = array(
                "pid" => $config->get('pay.' . $type . '.appid'),
                "type" => $pay_type,
                "notify_url" => Util::getHost(true) . '/index.php/callback/pay/' . $type . '_notify',
                "return_url" => Util::getHost(true) . '/index.php/callback/pay/' . $type . '_return',
                "out_trade_no" => $order_info['trade_no'],
                "name" => $order_info['name'],
                "money"    => $order_info['money'],
            );
            $epay = new \Plugins\Pay\Epay($pay_config);
            return $epay->getPayLink($parameter);
        }
        //其他支付
        return false;
    }

    /**
     * 发起支付
     *
     * @param string $trade_no 订单号
     * @return void
     */
    public function pay($trade_no)
    {
        $order_info = $this->find(array('trade_no' => $trade_no));
        if (!$order_info) {
            return $this->error('该订单不存在');
        }
        //判断支付通道类型
        if (!$this->checkPayType($order_info['pay_type'])) {
            return $this->error('该支付通道已关闭');
        }
        $ret = array('code' => 500, 'message' => '获取支付信息失败', 'trade_no' => $order_info['trade_no'], 'url' => '');
        $obj = &$this;
        Cache::lock(Lock::ORDER_PAY . $order_info['user_id'], function () use (&$ret, &$obj, $trade_no, $order_info) {
            $config = ConfigService::getInstance();
            //获取支付连接
            switch ($order_info['pay_type']) {
                case Order::PAY_TYPE_ALI: //支付宝
                    $url = $obj->getPayUrl($order_info, $config->get(Constant::SYSTEM_PAY_ALIPAY_TYPE), 'alipay');
                    if ($url !== false) {
                        $ret = array('code' => 200, 'message' => '获取支付信息成功', 'trade_no' => $order_info['trade_no'], 'url' => $url);
                    }
                    break;
                case Order::PAY_TYPE_WX: //微信
                    $url = $obj->getPayUrl($order_info, $config->get(Constant::SYSTEM_PAY_WXPAY_TYPE), 'wxpay');
                    if ($url !== false) {
                        $ret = array('code' => 200, 'message' => '获取支付信息成功', 'trade_no' => $order_info['trade_no'], 'url' => $url);
                    }
                    break;
                case Order::PAY_TYPE_QQ: //QQ
                    $url = $obj->getPayUrl($order_info, $config->get(Constant::SYSTEM_PAY_QQPAY_TYPE), 'qqpay');
                    if ($url !== false) {
                        $ret = array('code' => 200, 'message' => '获取支付信息成功', 'trade_no' => $order_info['trade_no'], 'url' => $url);
                    }
                    break;
                default: //余额
                    $user = UserService::getInstance()->get($order_info['user_id']);
                    if (!$user || round($user['money'], 2) < round($order_info['money'], 2)) {
                        $ret = array('code' => 500, 'message' => '账户余额不足', 'trade_no' => $order_info['trade_no'], 'url' => '');
                    } else {
                        $money = round($order_info['money'], 2);
                        User::startTrans(); //开启事务
                        //扣除余额
                        if (UserService::getInstance()->auto($user['id'], array('money' => '-' . $money))) {
                            //写入记录
                            PayService::getInstance()->create(array(
                                'user_id' => $user['id'],
                                'type' => Pay::TYPE_COST,
                                'money' => $money,
                                'title' => Pay::TITLE_ORDER,
                                'content' => '在线下单' . $order_info['name'] . '(订单号:' . $order_info['trade_no'] . ')消费' . $money . '元。'
                            ));
                            //清理缓存
                            UserService::getInstance()->clear($user['id']);
                            //更改订单状态
                            $out_trade_no = date("YmdHis") . rand(100000, 999999); //订单号
                            $res = $obj->changeStatusSync($order_info['trade_no'], $out_trade_no);
                            if ($res) {
                                User::commit(); //提交事务
                                $ret = array('code' => 200, 'message' => '购买成功', 'trade_no' => $order_info['trade_no'], 'url' => '');
                            } else {
                                User::rollback(); //回滚事务
                                $ret = array('code' => 500, 'message' => '购买失败，请联系管理员(-2)', 'trade_no' => $order_info['trade_no'], 'url' => '');
                            }
                        } else {
                            User::rollback(); //回滚事务
                            $ret = array('code' => 500, 'message' => '购买失败，请联系管理员(-1)', 'trade_no' => $order_info['trade_no'], 'url' => '');
                        }
                    }
                    break;
            }
        }, true);
        return $ret;
    }
}
