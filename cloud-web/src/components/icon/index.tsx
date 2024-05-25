import {createFromIconfontCN} from '@ant-design/icons';

/**
 * 图标组件(生产环境需使用本地资源)
 */
const Icon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4556436_p35ije88dm.js', // 在 iconfont.cn 上生成
});
/**
 * 图标数据
 */
const Exit = "icon-tuichu1"
const Right = "icon-right"
const Order = "icon-dingdanguanli"
const Home = "icon-zhuye"
const Setting = "icon-set"
const User = "icon-yonghu"
const Shop = "icon-shangcheng"
const System = "icon-xitong"
const Business  = "icon-zongheyewu"
const Link = "icon-lianjie"
const Money = "icon-jinqian"
const Bottom = "icon-bottom"
export {
    Icon,
    Exit,
    Right,
    Order,
    Home,
    Setting,
    User,
    Shop,
    System,
    Business,
    Link,
    Money,
    Bottom
}