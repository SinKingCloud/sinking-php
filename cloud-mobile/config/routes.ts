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
        path: "list",
        title: "列表",
        name: "user.list",
        icon: 'icon-tabulate',
        component: "@/pages/user/list",
    },
    {
        path: "pay",
        title: "充值",
        name: "user.pay",
        icon: 'icon-recharge',
        component: "@/pages/user/recharge",
    },
    {
        path: "help",
        title: "帮助",
        name: "user.help",
        icon: 'icon-help',
        component: "@/pages/user/help",
    },
    {
        path: "person",
        title: "我的",
        name: "user.person",
        icon: 'icon-user',
        routes: [
            {
                path: "info",
                component: "@/pages/user/my",
                title: "账号信息",
                name: "user.person.info",
                icon: 'icon-user',
            },
        ]
    },
    {
        path: "other",
        title: "我的",
        name: "other.test",
        icon: 'icon-user',
        hideInTabBar: true,
        routes: [
            {
                path: "info",
                component: "@/pages/user/index/components/notice",
                title: "公告测试",
                name: "other.person.info",
                icon: 'icon-user',
            },
            {
                path: "onlinePay",
                title: "在线支付",
                name: "other.person.onlinePay",
                component: "@/pages/user/index/components/onlinePay",
            },
            {
                path: "cdkPay",
                title: "卡密支付",
                name: "other.person.cdkPay",
                component: "@/pages/user/index/components/cdkPay",
            },
            {
                path: "helpInfo",
                title: "帮助信息",
                name: "other.person.helpInfo",
                component: "@/pages/user/index/components/helpInfo",
            },
            {
                path: "invite",
                title: "邀请好友活动",
                name: "other.person.invite",
                component: "@/pages/user/index/components/invite",
            },
            {
                path: "summer",
                title: "暑假活动",
                name: "other.person.summer",
                component: "@/pages/user/index/components/summer",
            },
            {
                path: "join",
                title: "活动参与记录",
                name: "other.person.join",
                component: "@/pages/user/index/components/join",
            },
            {
                path: "smsLogin",
                component: "@/pages/user/login/components/smsLogin",
                title: "短信登录",
                name: "other.smsLogin",
            },
            {
                path: "qrLogin",
                component: "@/pages/user/login/components/qrLogin",
                title: "扫码登录",
                name: "other.qrLogin",
            },
            {
                path: "emailLogin",
                component: "@/pages/user/login/components/emailLogin",
                title: "邮箱登录",
                name: "other.emailLogin",
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
        component: "@/pages/user/list",
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
        component: "@/pages/user/list",
        title: "网站概览",
        name: "admin.index",
        icon: 'icon-web',
    },
]
/**
 * 首页系统路由
 */
export const indexPath = "index";
export const index = [
    {
        path: "index",
        component: "@/pages/user/list",
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
                path: '/' + userPath + '/login',
                component: '@/pages/user/login',
                name: "user.login",
                title: "帐号登录",
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
//
// export default [
//     {
//         path: "/index",
//         component: "@/pages/index",
//         title: "首页",
//         hideInMenu: false
//     },
//     {
//         path: "/",
//         redirect: "/index"
//     },
//     {
//         path: "/login",
//         component: "@/pages/login",
//         hideInMenu: true,
//         layout: false
//     },
//     {
//         path: "/list",
//         component: "@/pages/list",
//         title: "列表",
//         hideInMenu: false
//     },
//     {
//         path: "/recharge",
//         component: "@/pages/recharge",
//         hideInMenu: false
//     },
//     {
//         path: "/help",
//         component: "@/pages/help",
//         hideInMenu: false
//     },
//     {
//         path: "/my",
//         component: "@/pages/my",
//         hideInMenu: false
//     },
//     {
//         path: "/onlinePay",
//         component: "@/pages/index/components/onlinePay",
//         hideInMenu: true,
//         layout: false
//     },
//     {
//         path: "/cdkPay",
//         component: "@/pages/index/components/cdkPay",
//         hideInMenu: true,
//         layout: false
//     },
//     {
//         path: "/notice",
//         component: "@/pages/index/components/notice",
//         hideInMenu: true
//     },
// ]