<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Admin\Controller;

use app\Constant\Config as Constant;
use app\Constant\Input;
use app\Model\Cash as ModelCash;
use app\Model\Log;
use app\Model\Pay;
use app\Model\User;
use app\Service\AuthService;
use app\Service\LogService;
use app\Service\CashService;
use app\Service\ConfigService;
use app\Service\PayService;
use app\Service\UserService;
use Systems\Request;

class Cash extends Common
{

    /**
     * 列表
     *
     * @return void
     */
    public function lists()
    {
        $page = Request::input(Input::PAGE, 1);
        $page_size = Request::input(Input::PAGE_SIZE, 20);
        $data = $this->validate(array(
            array('type|提现方式', 'omitempty|number|in:0,1,2|default:0'),
            array('name|提现姓名', 'omitempty'),
            array('account|提现账号', 'omitempty'),
            array('status|状态', 'omitempty|number|in:0,1'),
            array('create_time_start|创建开始时间', 'omitempty|date'),
            array('create_time_end|创建结束时间', 'omitempty|date'),
            array('update_time_start|更新开始时间', 'omitempty|date'),
            array('update_time_end|更新结束时间', 'omitempty|date'),
            array('order_by_field|排序字段', 'omitempty|default:id|in:id,status,create_time,update_time'),
            array('order_by_type|排序类型', 'omitempty|default:desc|in:desc,asc'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        $data['user_id'] = $user['id'];
        LogService::getInstance()->add(Log::TYPE_LOOK, '查看提现', '查看提现记录');
        return $this->success('获取成功', CashService::getInstance()->page($data, $data['order_by_field'], $data['order_by_type'], $page, $page_size));
    }

    /**
     * 创建
     *
     * @return void
     */
    public function create()
    {
        $data = $this->validate(array(
            array('type|提现方式', 'require|number|in:0,1,2|default:0'),
            array('name|提现姓名', 'require'),
            array('account|提现账号', 'require'),
            array('money|提现金额', 'require|number|min:1'),
        ), Request::param());
        $config = ConfigService::getInstance();
        if ($config->get(Constant::SYSTEM_CASH_IS_OPEN) != 1) {
            return $this->error('系统维护,暂不支持提现');
        }
        $min_money = round($config->get(Constant::SYSTEM_CASH_MIN_MONEY),2);
        if ($min_money > 0 && $data['money'] < $min_money) {
            return $this->error('系统单笔提现金额最低为' . $min_money . '元');
        }
        $user = AuthService::getInstance()->getCurrentUser();
        if ($user['money'] < $data['money']) {
            return $this->error('您的账户余额不足');
        }
        $money = round($data['money'],2);
        User::startTrans(); //开启事务
        if (UserService::getInstance()->auto($user['id'], array('money' => '-' . $money))) {
            $num = intval($config->get(Constant::SYSTEM_CASH_DEDUCT));
            if ($num > 0) {
                $real_money = round($money - ($money / 100 * $num),2);
            } else {
                $real_money = $money;
            }
            $temp = array(
                'user_id' => $user['id'],
                'type' => intval($data['type']),
                'name' => $data['name'],
                'account' => $data['account'],
                'money' => $money,
                'real_money' => $real_money,
                'status' => ModelCash::STATUS_UNPAY,
            );
            if (CashService::getInstance()->create($temp)) {
                //写入余额记录
                PayService::getInstance()->create(
                    array(
                        'user_id' => $user['id'],
                        'type' => Pay::TYPE_COST,
                        'money' => $money,
                        'title' => Pay::TITLE_CASH,
                        'content' => '申请提现扣除' . $money . '元。',
                    )
                );
                //写入操作日志
                LogService::getInstance()->add(Log::TYPE_CREATE, '申请提现', '申请余额提现');
                User::commit(); //提交事务
                UserService::getInstance()->clear($user['id']);
                return $this->success('申请提现成功');
            }
        }
        User::rollback(); //回滚事务
        return $this->error('申请提现失败,请联系管理员');
    }

    /**
     * 修改
     *
     * @return void
     */
    public function update()
    {
        $data = $this->validate(array(
            array('ids|提现ID列表', 'require|array|number|length_between:1,1000'),
            array('type|提现方式', 'omitempty|number|in:0,1,2|default:0'),
            array('name|提现姓名', 'omitempty'),
            array('account|提现账号', 'omitempty'),
        ), Request::param());
        $user = AuthService::getInstance()->getCurrentUser();
        $where = array(
            array('id', $data['ids'], 'in'),
            array('user_id', $user['id']),
            array('status', 0),
        );
        if (CashService::getInstance()->update($where, $data)) {
            LogService::getInstance()->add(Log::TYPE_UPDATE, '修改提现', '修改提现信息');
            return $this->success('修改成功');
        } else {
            return $this->error('修改失败');
        }
    }
}
