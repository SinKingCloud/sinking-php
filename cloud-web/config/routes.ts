export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: '账户登录',
            path: 'login',
            component: './user/login',
          },
          {
            name: "支付结果",
            path: 'result',
            component: './user/result',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: "数据概览",
    icon: "HomeOutlined",
    path: '/index',
    routes: [
      {
        name: "控制台",
        path: 'index',
        component: './index/index',
      },
      {
        redirect: '/index/index',
      },
    ],
  },
  {
    name: "在线商城",
    icon: "ShoppingCartOutlined",
    path: '/shop',
    routes: [
      {
        name: "开通主站",
        path: 'site',
        component: './shop/site',
      },
      {
        redirect: '/shop/site',
      },
    ],
  },
  {
    name: "财务管理",
    icon: "DollarCircleOutlined",
    path: '/pay',
    routes: [
      {
        name: "账户充值",
        path: 'recharge',
        component: './pay/recharge',
      },
      {
        name: "订单记录",
        path: 'order',
        component: './pay/order',
      },
      {
        name: "余额明细",
        path: 'log',
        component: './pay/log',
      },
      {
        redirect: '/pay/recharge',
      },
    ],
  },
  {
    name: "账户管理",
    icon: "UserOutlined",
    path: '/person',
    routes: [
      {
        name: "资料管理",
        path: 'setting',
        component: './person/setting',
      },
      {
        name: "操作日志",
        path: 'log',
        component: './person/log',
      },
      {
        redirect: '/person/setting',
      },
    ],
  },
  {
    name: "网站管理",
    icon: "SettingOutlined",
    path: '/admin',
    access: 'canAdmin',
    routes: [
      {
        name: "网站概览",
        path: 'index',
        component: './admin/index',
      },
      {
        name: "用户管理",
        path: 'user',
        component: './admin/user',
      },
      {
        name: "分站管理",
        path: 'web',
        component: './admin/web',
      },
      {
        name: "公告管理",
        path: 'notice',
        component: './admin/notice',
      },
      {
        name: "订单管理",
        path: 'order',
        component: './admin/order',
      },
      {
        name: "提现管理",
        path: 'cash',
        component: './admin/cash',
      },
      {
        name: "价格设置",
        path: 'price',
        component: './admin/price',
      },
      {
        name: "网站设置",
        path: 'set',
        component: './admin/set',
      },
      {
        redirect: '/admin/index',
      },
    ],
  },
  {
    name: "系统管理",
    icon: "GlobalOutlined",
    path: '/master',
    access: 'canMaster',
    routes: [
      {
        name: "系统概览",
        path: 'index',
        component: './master/index',
      },
      {
        name: "用户管理",
        path: 'user',
        component: './master/user',
      },
      {
        name: "分站管理",
        path: 'web',
        component: './master/web',
      },
      {
        name: "公告管理",
        path: 'notice',
        component: './master/notice',
      },
      {
        name: "订单管理",
        path: 'order',
        component: './master/order',
      },
      {
        name: "提现管理",
        path: 'cash',
        component: './master/cash',
      },
      {
        name: "价格设置",
        path: 'price',
        component: './master/price',
      },
      {
        name: "系统设置",
        path: 'set',
        component: './master/set',
      },
      {
        redirect: '/master/index',
      },
    ],
  },
  {
    path: '/',
    redirect: '/index/index',
  },
  {
    component: './404',
  },
];
