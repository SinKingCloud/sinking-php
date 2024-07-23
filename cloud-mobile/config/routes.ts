/**
 * 用户系统路由
 */
export const userPath = "user";
export const user = [
    {
        path: "index",
        title: "首页",
        name: "user.index",
        icon: 'icon-home',
        component: "@/pages/user/index",
    },
    {
        path: "pay",
        title: "充值",
        icon: 'icon-recharge',
        routes: [
            {
                path: "index",
                component: "@/pages/user/pay",
                title: "充值",
                name: "user.pay",
            },
            {
                path: "recharge",
                component: "@/pages/user/pay/recharge",
                title: "充值账户余额",
                name: "user.pay.recharge",
            },
            {
                path: "station",
                component: "@/pages/user/pay/station",
                title: "开通主站",
                name: "user.pay.station",
            },
            {
                path: "record",
                component: "@/pages/user/pay/record",
                title: "订单记录",
                name: "user.pay.record",
            },
            {
                path: "balance",
                component: "@/pages/user/pay/balance",
                title: "余额明细",
                name: "user.pay.balance",
            },
        ]
    },
    {
        path: "notice",
        title: "公告",
        name: "user.notice",
        icon: 'icon-notice',
        component: "@/pages/user/notice/index",
        routes: [
            {
                path: "info/:id",
                title: "公告详情",
                name: "user.noticeInfo",
                component: "@/pages/user/notice/noticeInfo",
            },
        ]
    },
    {
        path: "person",
        title: "我的",
        name: "user.person",
        icon: 'icon-user',
        routes: [
            {
                path: "info",
                title: "我的",
                name: "user.person.info",
                component: "@/pages/user/person",
            },
            {
                path: "phoneVerify",
                title: "手机验证",
                name: "person.phoneVerify",
                component: "@/pages/user/person/phoneVerify",
            },
            {
                path: "emailVerify",
                title: "邮箱验证",
                name: "person.emailVerify",
                component: "@/pages/user/person/emailVerify",
            },
            {
                path: "log",
                title: "操作日志",
                name: "person.log",
                component: "@/pages/user/person/log",
            },
        ]
    },
];
/**
 * 系统后台路由
 */
export const masterPath = "master";
export const master = [
    {
        path: "index",
        component: "@/pages/master/index",
        title: "系统概览",
        icon: 'icon-system',
        name: "master.index",
    },
]
/**
 * 网站后台路由
 */
export const adminPath = "admin";
export const admin = [
    {
        path: "index",
        component: "@/pages/admin/index",
        title: "首页",
        name: "admin.index",
        icon: 'icon-admin',
    },
]
/**
 * 首页系统路由
 */
export const indexPath = "index";
export const index = [
    {
        path: "index",
        component: "@/pages/index",
        title: "系统首页",
        name: "index.index",
        icon: 'icon-doc',
    },
];

/**
 * 系统路由
 */
export default [
    /**
     * 首页路由
     */
    {
        path: "/",
        name: "redirect." + indexPath,
        title: index[0]?.title,
        routes: [
            {
                path: "/",
                component: index[0]?.component,
                title: index[0]?.title,
                name: index[0]?.name,
            },
            {
                path: '/login',
                component: '@/pages/index/login',
                name: "login",
                title: "帐号登录",
            },
            {
                path: '/login/sms',
                component: "@/pages/index/login/sms",
                title: "短信登录",
                name: "login.sms",
            },
            {
                path: '/login/qrcode',
                component: "@/pages/index/login/qrcode",
                title: "扫码登录",
                name: "login.qrcode",
            },
            {
                path: '/login/email',
                component: "@/pages/index/login/email",
                title: "邮箱登录",
                name: "login.email",
            },
        ],
    },
    {
        path: indexPath,
        name: indexPath,
        title: "系统首页",
        routes: index,
    },
    /**
     * 用户路由
     */
    {
        path: "/" + userPath,
        name: "redirect." + userPath,
        redirect: '/' + userPath + '/' + (user[0]?.path || 'index'),
    },
    {
        path: userPath,
        name: userPath,
        title: "用户系统",
        routes: user,
    },
    /**
     * master路由
     */
    {
        path: "/" + masterPath,
        name: "redirect." + masterPath,
        redirect: '/' + masterPath + '/' + (master[0]?.path || 'index'),
    },
    {
        path: masterPath,
        name: masterPath,
        title: "后台系统",
        routes: master,
    },
    /**
     * admin路由
     */
    {
        path: "/" + adminPath,
        name: "redirect." + adminPath,
        redirect: '/' + adminPath + '/' + (admin[0]?.path || 'index'),
    },
    {
        path: adminPath,
        name: adminPath,
        title: "后台网站",
        routes: admin,
    },
    /**
     * 支付结果
     */
    {
        path: "pay",
        component: "@/pages/pay.tsx",
        name: "pay",
        title: "支付结果",
    },
    /**
     * 500
     */
    {
        path: '/500',
        component: '@/pages/500.tsx',
        name: "error",
        title: "服务器错误",
    },
    /**
     * 403
     */
    {
        path: '/403',
        component: '@/pages/403.tsx',
        name: "notAllowed",
        title: "无权限",
    },
    /**
     * 404
     */
    {
        path: '/*',
        component: '@/pages/404.tsx',
        name: "notFound",
        title: "页面不存在",
    }
];