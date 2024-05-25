<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Admin\Controller;

use app\Model\Cash;
use app\Model\Count as ModelCount;
use app\Service\AuthService;
use app\Service\CashService;
use app\Service\CountService;
use Systems\Request;

class Count extends Common
{
    /**
     * 获取概览数据
     *
     * @return void
     */
    public function all()
    {
        $days = 30;
        $web = AuthService::getInstance()->getCurrentWeb();
        $sum = CountService::getInstance()->getWeb($web['id'], ModelCount::TYPE_ALL);
        $count = CountService::getInstance()->getWeb($web['id'], ModelCount::TYPE_DAY, date("Y-m-d", time() - 86400 * $days), date("Y-m-d"));
        $donut = array();
        foreach ($sum as $key => $value) {
            if (in_array($key, array(ModelCount::FIELD_CONS_MONEY, ModelCount::FIELD_DEDU_MONEY, ModelCount::FIELD_RECH_MONEY))) {
                $donut[] = array(
                    'type' => $key,
                    'value' => $value,
                );
            }
        }
        $data = array(
            'sum' => $sum,
            'count' => $count,
            'donut' => $donut,
        );
        return $this->success('获取成功', $data);
    }

    /**
     * 获取站点排行榜
     *
     * @return void
     */
    public function topWeb()
    {
        $field = array(
            ModelCount::FIELD_ORDER_NUM,
            ModelCount::FIELD_ORDER_SUCC_NUM,
            ModelCount::FIELD_CONS_MONEY,
            ModelCount::FIELD_RECH_MONEY,
            ModelCount::FIELD_DEDU_MONEY,
            ModelCount::FIELD_SITE_NUM,
            ModelCount::FIELD_USER_NUM,
        );
        $data = $this->validate(array(
            array('order_by|提现方式', 'require|in:' . implode(',', $field) . '|default:' . $field[0]),
            array('limit|类型', 'require|number|default:20'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        return $this->success(
            '获取成功',
            CountService::getInstance()->getTopWeb(
                $web['id'],
                $data['order_by'],
                $data['limit']
            )
        );
    }

    /**
     * 用户排行榜
     *
     * @return void
     */
    public function topUser()
    {
        $field = array(
            ModelCount::FIELD_ORDER_NUM,
            ModelCount::FIELD_ORDER_SUCC_NUM,
            ModelCount::FIELD_CONS_MONEY,
            ModelCount::FIELD_RECH_MONEY,
            ModelCount::FIELD_DEDU_MONEY,
            ModelCount::FIELD_SITE_NUM,
            ModelCount::FIELD_USER_NUM,
        );
        $data = $this->validate(array(
            array('order_by|提现方式', 'require|in:' . implode(',', $field) . '|default:' . $field[0]),
            array('limit|类型', 'require|number|default:20'),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        return $this->success(
            '获取成功',
            CountService::getInstance()->getTopUser(
                $web['id'],
                $data['order_by'],
                $data['limit']
            )
        );
    }

    /**
     * 图表
     *
     * @return void
     */
    public function chart()
    {
        $data = $this->validate(array(
            array('type|类型', 'require|number|in:0,1,2,3,4|default:1'),
            array('start_date|开始时间', 'require|date|default:' . date("Y-m-d", time() - 86400 * 31)),
            array('end_date|结束时间', 'require|date|default:' . date("Y-m-d")),
        ), Request::param());
        $web = AuthService::getInstance()->getCurrentWeb();
        return $this->success(
            '获取成功',
            CountService::getInstance()->getWeb(
                $web['id'],
                $data['type'],
                $data['start_date'],
                $data['end_date']
            )
        );
    }

    /**
     * 获取待办
     *
     * @return void
     */
    public function toDo()
    {
        $user = AuthService::getInstance()->getCurrentUser();
        $web = AuthService::getInstance()->getCurrentWeb();
        $sum = CountService::getInstance()->getWeb($web['id'], ModelCount::TYPE_ALL);
        return $this->success('获取成功', array(
            'cash' => CashService::getInstance()->count(array('user_id' => $user['id'], 'status' => Cash::STATUS_UNPAY)), //待提现记录
            'deduct_money' => $sum[ModelCount::FIELD_DEDU_MONEY], //累计提成
        ));
    }
}
