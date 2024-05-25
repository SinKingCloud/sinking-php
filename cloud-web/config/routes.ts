
/**
 * 用户系统路由
 */
export const userPath = "user";
export const user = [
    {
        path: "index",
        component: "@/pages/user/index",
        title: "数据概览",
        name: "user.index",
        icon: 'icon-zhuye',
        hideInMenu: false,
        routes:[
            {
                path: "dashboard",
                component: "@/pages/user/index",
                title: "控制台",
                name: "user.dashboard",
                hideInMenu: false,
            },
        ]
    },
    {
        path: "shop",
        component: "@/pages/user/shop",
        title: "在线商城",
        name: "user.shop",
        icon: 'icon-shangcheng',
        hideInMenu: false,
        routes:[
            {
                path: "site",
                component: "@/pages/user/shop",
                title: "开通主站",
                name: "user.site",
                hideInMenu: false,
            },
        ]
    },
    {
        path: "pay",
        title: "财务管理",
        name: "user.pay",
        icon: 'icon-jinqian',
        hideInMenu: false,
        routes:[
            {
                path: "recharge",
                component: "@/pages/user/pay/recharge",
                title: "账户充值",
                name: "user.recharge",
                hideInMenu: false,
            },
            {
                path: "order",
                component: "@/pages/user/pay/order",
                title: "订单记录",
                name: "user.order",
                hideInMenu: false,
            },
            {
                path: "log",
                component: "@/pages/user/pay/log",
                title: "余额明细",
                name: "user.log",
                hideInMenu: false,
            },
        ]
    },
    {
        path: "person",
        title: "账户管理",
        name: "user.person",
        icon: 'icon-yonghu',
        hideInMenu: false,
        routes:[
            {
                path: "setting",
                component: "@/pages/user/person/setting",
                title: "资料管理",
                name: "user.setting",
                hideInMenu: false,
            },
            {
                path: "log",
                component: "@/pages/user/person/log",
                title: "操作日志",
                name: "user.log2",
                hideInMenu: false,
            },
        ]
    },
    {
        path: "master",
        title: "系统管理",
        name: "master.index",
        icon: 'icon-yonghu',
        hideInMenu: false,
        routes:[
            {
                path: "system",
                component: "@/pages/master/system",
                title: "系统概览",
                name: "master.system",
                hideInMenu: false,
            },
            {
                path: "user",
                component: "@/pages/master/user",
                title: "用户管理",
                name: "master.user",
                hideInMenu: false,
            },
            {
                path: "substation",
                component: "@/pages/master/substation",
                title: "分站管理",
                name: "master.substation",
                hideInMenu: false,
            },
            {
                path: "notice",
                component: "@/pages/master/notice",
                title: "公告管理",
                name: "master.notice",
                hideInMenu: false,
            },
            {
                path: "indent",
                component: "@/pages/master/indent",
                title: "订单管理",
                name: "master.indent",
                hideInMenu: false,
            },
            {
                path: "withdraw",
                component: "@/pages/master/withdraw",
                title: "提现管理",
                name: "master.withdraw",
                hideInMenu: false,
            },
            {
                path: "price",
                component: "@/pages/master/price",
                title: "价格设置",
                name: "master.price",
                hideInMenu: false,
            },
            {
                path: "systematic",
                component: "@/pages/master/systematic",
                title: "系统设置",
                name: "master.systematic",
                hideInMenu: false,
            },
        ]
    },
];
/**
 * 首页系统路由
 */
export const indexPath = "index";
export const index = [
    {
        path: "index",
        component: "@/pages/index/index",
        title: "系统首页",
        name: "index.index",
        icon: 'icon-doc',
        hideInMenu: false,
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
        component: '@/layouts/index',
        routes: [
            {
                path: "/",
                component: index[0]?.component,
                title: index[0]?.title,
                name: index[0]?.name,
                hideInMenu: true,
            },
            {
                path: '/' + userPath + '/login',
                component: '@/pages/user/login',
                name: "user.login",
                title: "帐号登录",
                hideInMenu: false,
            },
        ],
        layout: false,
    },
    {
        path: indexPath,
        name: indexPath,
        title: "系统首页",
        icon: 'icon-doc',
        routes: index,
        component: '@/layouts/index',
        layout: false,
    },
    /**
     * 用户路由
     */
    {
        path: "/" + userPath,
        name: "redirect." + userPath,
        redirect: '/' + userPath + '/' + (user[0]?.path || 'index'),
        layout: false,
        hideInMenu: true,
    },
    {
        path: userPath,
        name: userPath,
        title: "用户系统",
        icon: 'icon-doc',
        layout: false,
        component: '@/layouts/user',
        routes: user,
    },
    /**
     * 500
     */
    {
        path: '/500',
        component: '@/pages/500.tsx',
        name: "error",
        title: "服务器错误",
        layout: false,
        hideInMenu: true,
    },
    /**
     * 403
     */
    {
        path: '/403',
        component: '@/pages/500.tsx',
        name: "notAllowed",
        title: "无权限",
        layout: false,
        hideInMenu: true,
    },
    /**
     * 404
     */
    {
        path: '/*',
        component: '@/pages/404.tsx',
        name: "notFound",
        title: "页面不存在",
        layout: false,
        hideInMenu: true,
    }
];