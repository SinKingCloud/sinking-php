let Settings = {
  layout: 'top',
  contentWidth: 'Fixed',
  splitMenus: false,
  fixedHeader: true,
  fixSiderbar: true,
  primaryColor: '#0051eb',
  navTheme: 'light',
  title: '云平台',
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  pwa: false,
  iconfontUrl: '',
  api: '',
  base: '/',
  publicPath: '/',
};
/**
 * 开发环境
 */
const isDev = process.env.NODE_ENV === 'development';
//配置合并
Settings = Object.assign(Settings, {
  title: '云平台',
  api: isDev ? 'http://sinking-php.clwl.online/index.php' : '/index.php',
  base: '/',
  publicPath: isDev ? '/' : '/Public/Web/',
  openKeys: false,
});

export default Settings;
