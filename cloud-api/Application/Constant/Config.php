<?php
/**
 * 配置常量
 */

namespace app\Constant;

class Config
{
    /********************框架设置********************/
    const REQUEST_ID = "request_id"; // 请求唯一ID
    const IS_PROXY = "is_proxy"; //使用代理
    const IS_DEBUG = "default_debug"; //是否开启debug
    const VERSION = 'version'; //程序版本
    const DATABASE = 'database'; //数据库设置
    const AUTH = 'auth'; //授权信息


    /********************系统设置********************/
    #云端设置
    const SYSTEM_CLOUD_ID = 'cloud.id'; //云端ID
    const SYSTEM_CLOUD_KEY = 'cloud.key'; //云端KEY
    #开发设置
    const SYSTEM_IS_PROXY = 'master.is_proxy'; //是否使用代理
    const SYSTEM_REQUEST_LOG = 'master.request.log.open'; //是否开启日志记录
    const SYSTEM_DEBUG = 'master.debug'; //是否开启debug
    #注册设置
    const SYSTEM_REG_EMAIL = 'master.reg.email'; //是否开启邮箱注册
    const SYSTEM_REG_QRLOGIN = 'master.reg.qrlogin'; //是否开启QQ扫码注册
    const SYSTEM_REG_PHONE = 'master.reg.phone'; //是否开启手机注册
    #短信设置
    const SYSTEM_SMS_ALIYUN_KEY = 'sms.aliyun.key'; //阿里云短信key
    const SYSTEM_SMS_ALIYUN_SECRET = 'sms.aliyun.secret'; //阿里云短信secret
    const SYSTEM_SMS_CAPTCHA_SIGN = 'sms.captcha.sign'; //验证码发信模板签名
    const SYSTEM_SMS_CAPTCHA_CODE = 'sms.captcha.code'; //验证码发信模板code
    const SYSTEM_SMS_CAPTCHA_VAR = 'sms.captcha.var'; //验证码发信模板变量
    #邮件设置
    const SYSTEM_EMAIL_HOST = 'email.host'; //发信邮箱地址
    const SYSTEM_EMAIL_PORT = 'email.port'; //发信邮箱端口
    const SYSTEM_EMAIL_USER = 'email.user'; //发信邮箱用户
    const SYSTEM_EMAIL_PWD = 'email.pwd'; //发信邮箱密码
    #系统价格设置
    const SYSTEM_SITE_COST_PRICE = 'site.cost.price'; //站点成本价格
    const SYSTEM_SITE_MIN_PRICE = 'site.min.price'; //站点最低售价
    const SYSTEM_SITE_DEFAULT_PRICE = 'site.default.price'; //站点默认售价
    const SYSTEM_SITE_RECHARGE_DEDUCT = 'site.recharge.deduct'; //站点充值提成百分比
    const SYSTEM_SITE_ORDER_DEDUCT = 'site.order.deduct'; //站点下单提成百分比
    const SYSTEM_SITE_MONTH = 'site.month'; //开通分站自动续期的月数
    #分站设置
    const SYSTEM_DOMAINS = 'master.domains'; //系统支持绑定的域名(|分割)
    const SYSTEM_DOMAIN_RESOLVE = 'master.domain.resolve'; //域名解析地址
    const SYSTEM_DOMAIN_NUM = 'master.domain.num'; //最大域名绑定个数
    const SYSTEM_DOMAIN_BLACK = 'master.domain.black'; //禁止域名绑定黑名单(一行一个)
    const SYSTEM_WEB_TITLE = 'master.web.title'; //默认标题
    const SYSTEM_WEB_KEYWORDS = 'master.web.keywords'; //默认关键词
    const SYSTEM_WEB_DESCRIPTION = 'master.web.description'; //默认描述
    #支付设置
    const SYSTEM_PAY_ALIPAY_TYPE = 'pay.alipay.type'; //支付宝支付通道
    const SYSTEM_PAY_WXPAY_TYPE = 'pay.wxpay.type'; //微信支付通道
    const SYSTEM_PAY_QQPAY_TYPE = 'pay.qqpay.type'; //QQ支付通道
    const SYSTEM_PAY_MIN_MONEY = 'pay.min.money'; //最低充值金额
    #提现设置
    const SYSTEM_CASH_IS_OPEN = 'cash.open'; //是否开启提现
    const SYSTEM_CASH_MIN_MONEY = 'cash.min.money'; //最低提现金额
    const SYSTEM_CASH_DEDUCT = 'cash.deduct'; //提现手续费率


    /********************用户设置********************/
    #用户设置
    const USER_CONTACT = 'contact'; //用户联系方式


    /********************网站设置********************/
    #网站价格设置
    const WEB_SITE_PRICE = 'site.price'; //站点售价
    #联系方式设置
    const WEB_CONTACT_ONE = 'contact.one'; //客服1
    const WEB_CONTACT_TWO = 'contact.two'; //客服2
    const WEB_CONTACT_THREE = 'contact.three'; //客服3
    const WEB_CONTACT_FOUR = 'contact.four'; //客服4
    #滚动公告设置
    const WEB_NOTICE_INDEX = 'notice.index'; //首页滚动公告
    const WEB_NOTICE_SHOP = 'notice.shop'; //商城页滚动公告
    const WEB_NOTICE_ADMIN = 'notice.admin'; //分站后台滚动公告
    #界面设置
    const WEB_UI_INDEX = 'ui.index'; //首页模板设置
    const WEB_UI_LAYOUT = 'ui.layout'; //网站布局(上下:top/左右:left)
    const WEB_UI_LOGO = 'ui.logo'; //网站logo设置
    const WEB_UI_WATERMARK = 'ui.watermark'; //网站水印设置
    const WEB_UI_THEME = 'ui.theme'; //菜单主题设置
    const WEB_UI_COMPACT = 'ui.compact'; //紧凑模式设置
}
