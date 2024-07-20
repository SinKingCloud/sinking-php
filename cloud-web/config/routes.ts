/**
 * 用户系统路由
 */
export const userPath = "user";
export const user = [
    {
        path: "index",
        title: "数据概览",
        name: "user.index",
        icon: 'icon-home',
        hideInMenu: false,
        component: "@/pages/user/index",
    },
    {
        path: "result",
        title: "支付结果",
        name: "user.result",
        hideInMenu: true,
        component: "@/pages/user/result",
    },
    {
        path: "shop",
        title: "在线商城",
        name: "user.shop",
        icon: 'icon-shop',
        hideInMenu: false,
        routes: [
            {
                path: "site",
                component: "@/pages/user/shop",
                title: "开通主站",
                name: "user.site",
                hideInMenu: false,
            },
        ]
    },
    // {
    //     path: "text",
    //     title: "文章管理",
    //     name: "user.text",
    //     icon: 'icon-text',
    //     hideInMenu: false,
    //     routes: [
    //         {
    //             path: "release",
    //             component: "@/pages/user/text/release",
    //             title: "发布文章",
    //             name: "user.article",
    //             hideInMenu: false,
    //         },
    //         {
    //             path: "list",
    //             component: "@/pages/user/text/list",
    //             title: "文章列表",
    //             name: "user.articleList",
    //             hideInMenu: false,
    //         },
    //     ]
    // },
    {
        path: "pay",
        title: "财务管理",
        name: "user.pay",
        icon: 'icon-money',
        hideInMenu: false,
        routes: [
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
        icon: 'icon-user',
        hideInMenu: false,
        routes: [
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
];
export const masterPath = "master";
export const master = [
    {
        path: "index",
        component: "@/pages/master/index",
        title: "系统概览",
        icon: 'icon-system',
        name: "master.index",
        hideInMenu: false,
    },

    {
        path: "user",
        component: "@/pages/master/user",
        title: "用户管理",
        name: "master.user",
        icon: "icon-user",
        hideInMenu: false,
    },
    {
        path: "substation",
        component: "@/pages/master/substation",
        title: "分站管理",
        name: "master.substation",
        icon: "icon-substation",
        hideInMenu: false,
    },
    {
        path: "notice",
        component: "@/pages/master/notice",
        title: "公告管理",
        name: "master.notice",
        icon: "icon-notice",
        hideInMenu: false,
    },
    {
        path: "indent",
        component: "@/pages/master/indent",
        title: "订单管理",
        name: "master.indent",
        icon: "icon-indent",
        hideInMenu: false,
    },
    {
        path: "withdraw",
        component: "@/pages/master/withdraw",
        title: "提现管理",
        name: "master.withdraw",
        icon: "icon-withdraw",
        hideInMenu: false,
    },
    {
        path: "price",
        component: "@/pages/master/price",
        title: "价格设置",
        name: "master.price",
        icon: "icon-price",
        hideInMenu: false,
    },
    {
        path: "systematic",
        component: "@/pages/master/systematic",
        title: "系统设置",
        name: "master.systematic",
        icon: "icon-set",
        hideInMenu: false,
    },
]
export const adminPath = "admin";
export const admin = [
    {
        path: "index",
        component: "@/pages/admin/index",
        title: "网站概览",
        name: "admin.index",
        icon: 'icon-web',
        hideInMenu: false,
    },
    {
        path: "user",
        component: "@/pages/admin/user",
        title: "用户管理",
        name: "admin.user",
        icon: "icon-user",
        hideInMenu: false,
    },
    {
        path: "substation",
        component: "@/pages/admin/substation",
        title: "分站管理",
        name: "admin.substation",
        icon: "icon-substation",
        hideInMenu: false,
    },
    {
        path: "notice",
        component: "@/pages/admin/notice",
        title: "公告管理",
        name: "admin.notice",
        icon: "icon-notice",
        hideInMenu: false,
    },
    {
        path: "order",
        component: "@/pages/admin/order",
        title: "订单管理",
        name: "admin.order",
        icon: "icon-indent",
        hideInMenu: false,
    },
    {
        path: "withdraw",
        component: "@/pages/admin/withdraw",
        title: "提现管理",
        name: "admin.withdraw",
        icon: "icon-withdraw",
        hideInMenu: false,
    },
    {
        path: "price",
        component: "@/pages/admin/price",
        title: "价格设置",
        name: "admin.price",
        icon: "icon-price",
        hideInMenu: false,
    },
    {
        path: "web",
        component: "@/pages/admin/web",
        title: "网站设置",
        name: "admin.web",
        icon: "icon-set",
        hideInMenu: false,
    },
]
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
        routes: [
            {
                path: "/",
                component: index[0]?.component,
                title: index[0]?.title,
                name: index[0]?.name,
                hideInMenu: true,
            },
            {
                path: '/login',
                component: '@/pages/user/login',
                name: "login",
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
        routes: index,
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
        routes: user,
    },
    /**
     * master路由
     */
    {
        path: "/" + masterPath,
        name: "redirect." + masterPath,
        redirect: '/' + masterPath + '/' + (master[0]?.path || 'index'),
        layout: false,
        hideInMenu: true,
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
        layout: false,
        hideInMenu: true,
    },
    {
        path: adminPath,
        name: adminPath,
        title: "后台网站",
        icon: 'icon-set',
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
        layout: false,
        hideInMenu: true,
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
        component: '@/pages/403.tsx',
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