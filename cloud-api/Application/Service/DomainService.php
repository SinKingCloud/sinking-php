<?php

namespace app\Service;

use app\Base\BaseService;
use app\Constant\Cache as Constant;
use app\Constant\Config as ConstantConfig;
use app\Constant\Lock;
use app\Model\Domain;
use Plugins\Util\Domain as UtilDomain;
use Systems\Cache;

class DomainService extends BaseService
{
    /**
     * 实例化model
     */
    public function __construct()
    {
        $class = Domain::getClass(); //兼容php5.4
        $this->model = new $class();
    }

    /**
     * 判断域名是否在黑名单内
     *
     * @param string $domain 域名
     * @return void
     */
    public function checkBlack($domain = '')
    {
        $txt = ConfigService::getInstance()->get(ConstantConfig::SYSTEM_DOMAIN_BLACK);
        $domains = explode("\n", $txt);
        return in_array($domain, $domains);
    }

    /**
     * 获取域名信息
     *
     * @param string $domain 
     * @param int $status 
     * @return void
     */
    public function get($domain, $refresh = false, $status = -1)
    {
        if ($refresh) {
            $this->clear($domain);
        }
        $key = 'domain';
        if (is_numeric($domain)) {
            $key = 'web_id';
        }
        return Cache::remember(Constant::DOMAIN_INFO_NAME . $domain, function () use ($key, $domain, $status) {
            $where = array($key => $domain);
            if ($status >= 0) {
                $where['status'] = $status;
            }
            return Domain::where($where)->order('id desc')->find();
        }, Constant::DOMAIN_INFO_TIME);
    }

    /**
     * 设置域名信息
     *
     * @param mixed $domain 域名/域名ID
     * @param integer $web_id 站点ID
     * @param integer $status 状态
     * @param integer $type 类型
     * @return void
     */
    public function set($domain, $web_id = -1, $status = -1, $type = -1)
    {
        if ($this->checkBlack($domain)) {
            return false;
        }
        $data = array();
        if ($web_id > 0) $data['web_id'] = $web_id;
        if ($status >= 0) $data['status'] = $status;
        if ($type >= 0) $data['type'] = $type;
        if (!$data) return false;
        $key = 'domain';
        if (is_numeric($domain)) $key = 'web_id';
        $res = false;
        //设置并发锁,防止重复写入
        Cache::lock(Lock::SYSTEM_DOMAIN_SET . $domain, function () use ($domain, $data, $key, &$res) {
            if (Domain::where(array($key => $domain))->count() > 0) {
                $res = Domain::where(array($key => $domain))->update($data);
            } else {
                $data['domain'] = $domain;
                if (!isset($data['web_id']) || $data['web_id'] <= 0) {
                    $data['web_id'] = 1;
                }
                if (!isset($data['status']) || $data['status'] < 0) {
                    $data['status'] = 0;
                }
                if (!isset($data['type']) || $data['type'] < 0) {
                    $data['type'] = 1;
                }
                $res =  Domain::create($data);
            }
        }, true);
        if ($res) {
            $this->clear($domain);
        }
        return $res;
    }

    /**
     * 清理文件缓存
     *
     * @param integer $domain 域名标识
     * @return void
     */
    public function clear($domain)
    {
        return Cache::delete(Constant::DOMAIN_INFO_NAME . $domain);
    }

    /**
     * 查询数据
     *
     * @param array $where 查询条件
     * @param string $order_field 排序字段
     * @param string $order_type 排序方式
     * @param integer $page 页码
     * @param integer $page_size 每页数量 
     * @return void 数据
     */
    public function page($where = array(),  $order_field = 'id',  $order_type = 'desc',  $page = 1, $page_size = 20, $field = '*')
    {
        $where_map = array();
        if (isset($where['web_id']) && $where['web_id'] > 0) {
            $where_map['web_id'] = $where['web_id'];
        }
        if (isset($where['status']) && $where['status'] >= 0) {
            $where_map['status'] = $where['status'];
        }
        if (isset($where['type']) && $where['type'] >= 0) {
            $where_map['type'] = $where['type'];
        }
        $field = 'id,web_id,domain,status,type,update_time,create_time';
        return parent::page($where_map, $order_field, $order_type, $page, $page_size, $field);
    }

    /**
     * 获取域名备案
     *
     * @param string $domain 域名
     * @return void
     */
    public function getIcp($domain)
    {
        $domain = UtilDomain::getTop($domain);
        return Cache::remember(Constant::DOMAIN_ICP_NAME . $domain, function () use ($domain) {
            return UtilDomain::getIcp($domain);
        }, Constant::DOMAIN_ICP_TIME);
    }
}
