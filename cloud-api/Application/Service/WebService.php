<?php

namespace app\Service;

use app\Base\BaseService;
use app\Constant\Cache as Constant;
use app\Constant\Config;
use app\Model\Domain;
use app\Model\Web;
use Systems\Cache;

class WebService extends BaseService
{
    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = Web::getClass(); //兼容php5.4
        $this->model = new $class();
    }

    /**
     * 获取站点信息
     *
     * @param int $web_id 站点ID
     * @return void
     */
    public function get($web_id, $refresh = false)
    {
        if ($refresh) {
            $this->clear($web_id);
        }
        return Cache::remember(Constant::WEB_INFO_NAME . $web_id, function () use ($web_id) {
            return Web::where(array('id' => $web_id))->find();
        }, Constant::WEB_INFO_TIME);
    }

    /**
     * 清理站点缓存
     *
     * @param integer $web_id 站点ID
     * @return void
     */
    public function clear($web_id)
    {
        return Cache::delete(Constant::WEB_INFO_NAME . $web_id);
    }

    /**
     * 获取下级站点列表
     *
     * @param mixed $web_id 上级站点ID
     * @return void
     */
    public function getSubSites($web_id)
    {
        $where = array();
        if (is_array($web_id)) {
            $where[] = array('web_id', $web_id, 'in');
        } else if (is_numeric($web_id)) {
            $where['web_id'] = $web_id;
        }
        return $this->select($where);
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
        if (isset($where['user_id']) && $where['user_id'] > 0) {
            $where_map['user_id'] = $where['user_id'];
        }
        if (isset($where['web_id']) && $where['web_id'] >= 0) {
            $where_map['web_id'] = $where['web_id'];
        }
        if (isset($where['name']) && $where['name']) {
            $where_map['name'] = array('%' . $where['name'] . '%', 'like', 'and');
        }
        if (isset($where['status']) && $where['status'] >= 0) {
            $where_map['status'] = $where['status'];
        }
        if (isset($where['expire_time_start']) && $where['expire_time_start']) {
            $where_map[] = array('expire_time', $where['expire_time_start'], '>=', 'and');
        }
        if (isset($where['expire_time_end']) && $where['expire_time_end']) {
            $where_map[] = array('expire_time', $where['expire_time_end'], '<=', 'and');
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
        $field = 'id,web_id,user_id,name,title,keywords,description,status,expire_time,create_time,update_time';
        return parent::page($where_map, $order_field, $order_type, $page, $page_size, $field);
    }

    /**
     * 添加网站
     *
     * @param integer $user_id 用户ID
     * @param string $name 站点名称
     * @param string $domain 站点域名
     * @param integer $months 开通月数
     * @return void
     */
    public function add($user_id, $name, $domain, $months = -1)
    {
        if (empty($user_id) || empty($name) || empty($domain)) {
            return $this->error('参数不足');
        }
        $user = UserService::getInstance()->get($user_id);
        if (!$user) {
            return $this->error('此用户不存在');
        }
        if ($this->count(array('user_id' => $user['id'])) > 0) {
            return $this->error('此用户已开通过网站');
        }
        if (DomainService::getInstance()->count(array('domain' => $domain)) > 0) {
            return $this->error('此域名已被占用');
        }
        $config = ConfigService::getInstance();
        $datetime = new \DateTime();
        if ($months <= 0) {
            $months = intval(ConfigService::getInstance()->get(Config::SYSTEM_SITE_MONTH));
            if ($months <= 0) {
                $months = 999;
            }
        }
        $w_data = array(
            'user_id' => $user['id'],
            'web_id' => $user['web_id'],
            'name' => $name,
            'title' => str_replace('{$name}', $name, $config->get(Config::SYSTEM_WEB_TITLE)),
            'keywords' => str_replace('{$name}', $name, $config->get(Config::SYSTEM_WEB_KEYWORDS)),
            'description' => str_replace('{$name}', $name, $config->get(Config::SYSTEM_WEB_DESCRIPTION)),
            'status' => Web::STATUS_NORMAL,
            'expire_time' => $datetime->setTimestamp(time() + $months * 30 * 24 * 60)->format('Y-m-d H:i:s'),
        );
        Web::startTrans(); //开启事务
        //写入站点
        if ($this->create($w_data)) {
            $web = $this->find(array('user_id' => $user['id']));
            //写入域名
            if ($web && DomainService::getInstance()->set($domain, $web['id'], Domain::STATUS_NORMAL, Domain::TYPE_SYS)) {
                //更改用户站点ID
                if (UserService::getInstance()->update($user['id'], array('web_id' => $web['id']))) {
                    //写入一些基础配置
                    SettingService::getInstance()->setWeb($web['id'], Config::WEB_SITE_PRICE, $config->get(Config::SYSTEM_SITE_DEFAULT_PRICE)); //默认售价
                    //用户数据转移到新网站
                    OrderService::getInstance()->update(array('web_id' => $user['web_id'], 'user_id' => $user['id']), array('web_id' => $web['id'])); #订单数据
                    //写入站点统计
                    $inc_data = array('site_num' => '+1');
                    CountService::getInstance()->set(0, 0, $inc_data); //系统统计
                    CountService::getInstance()->set($user['web_id'], 0, $inc_data); //上级站点统计
                    Web::commit(); //提交事务
                    //清理缓存
                    UserService::getInstance()->clear($user['id']);
                    return true;
                }
            }
        }
        Web::rollback(); //回滚事务
        return $this->error('开通网站失败');
    }
}
