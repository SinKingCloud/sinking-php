<?php
/*
* Title:沉沦云MVC开发框架
* Project:控制器
* Author:流逝中沉沦
* QQ：1178710004
*/

namespace app\Http\Callback\Controller;

use app\Service\ConfigService;
use app\Service\OrderService;
use Systems\Request;

class Pay extends Common
{

    /**
     * 获取易支付对象
     *
     * @param string $type 支付通道
     * @return void
     */
    private function getEpayObj($type = 'epay1')
    {
        $config = ConfigService::getInstance();
        $pay_config = array(
            'apiurl' => $config->get('pay.' . $type . '.url'),
            'pid' => $config->get('pay.' . $type . '.appid'),
            'key' => $config->get('pay.' . $type . '.key'),
        );
        return new \Plugins\Pay\Epay($pay_config);
    }

    /**
     * 易支付通道异步回调
     *
     * @param string $type 支付通道
     * @return void
     */
    private function epay_notify($type = 'epay1')
    {
        $param = Request::input();
        if ($this->getEpayObj($type)->verifyNotify($param)) {
            $trade_no = $param['out_trade_no'];
            $out_trade_no = $param['trade_no'];
            $trade_status = $param['trade_status'];
            $res = false;
            if ($trade_status == 'TRADE_SUCCESS') {
                $res = OrderService::getInstance()->changeStatusSync($trade_no, $out_trade_no);
            }
            if ($res) {
                return "success";
            } else {
                return "fail";
            }
        } else {
            return "fail";
        }
    }

    /**
     * 易支付通道同步回调
     *
     * @param string $type 支付通道
     * @return void
     */
    private function epay_return($type = 'epay1')
    {
        $param = Request::input();
        if ($this->getEpayObj($type)->verifyReturn($param)) {
            $trade_no = $param['out_trade_no'];
            $out_trade_no = $param['trade_no'];
            $trade_status = $param['trade_status'];
            if ($trade_status == 'TRADE_SUCCESS') {
                OrderService::getInstance()->changeStatusSync($trade_no, $out_trade_no);
            }
            return '<script>window.location.href="/?s#/pay"</script>';
        } else {
            return '<script>window.location.href="/?s"</script>';
        }
    }

    /**
     * 易支付通道A异步回调
     *
     * @return void
     */
    public function epay1_notify()
    {
        return $this->epay_notify('epay1');
    }

    /**
     * 易支付通道A同步回调
     *
     * @return void
     */
    public function epay1_return()
    {
        return $this->epay_return('epay1');
    }

    /**
     * 易支付通道B异步回调
     *
     * @return void
     */
    public function epay2_notify()
    {
        return $this->epay_notify('epay2');
    }

    /**
     * 易支付通道B同步回调
     *
     * @return void
     */
    public function epay2_return()
    {
        return $this->epay_return('epay2');
    }

    /**
     * 易支付通道C异步回调
     *
     * @return void
     */
    public function epay3_notify()
    {
        return $this->epay_notify('epay3');
    }

    /**
     * 易支付通道C同步回调
     *
     * @return void
     */
    public function epay3_return()
    {
        return $this->epay_return('epay3');
    }
}
