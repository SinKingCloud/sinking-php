import React, {useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Menu} from 'antd';
import BaseView from './components/base';
import styles from './style.less';
import PayView from "@/pages/master/set/components/pay";
import EmailView from "@/pages/master/set/components/email";
import CloudView from "@/pages/master/set/components/cloud";
import ProCard from "@ant-design/pro-card";
import CashView from "@/pages/master/set/components/cash";
import WebView from "@/pages/master/set/components/web";
import UpgradeView from "@/pages/master/set/components/upgrade";
import SmsView from "@/pages/master/set/components/sms";

const {Item} = Menu;

type SettingsStateKeys = 'base' | 'email' | 'sms' | 'pay' | 'cash' | 'web' | 'cloud' | 'upgrade';
type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};

const Settings: React.FC = () => {
  const menuMap: Record<string, React.ReactNode> = {
    base: '基本设置',
    email: '邮箱设置',
    sms: "短信设置",
    pay: '支付设置',
    cash: '提现设置',
    web: '分站设置',
    cloud: '云端设置',
    upgrade: '系统更新',
  };

  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'base',
  });

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  const renderChildren = () => {
    const {selectKey} = initConfig;
    switch (selectKey) {
      case 'base':
        return <BaseView/>;
      case 'pay':
        return <PayView/>;
      case 'email':
        return <EmailView/>;
      case 'sms':
        return <SmsView/>;
      case 'cash':
        return <CashView/>;
      case 'web':
        return <WebView/>;
      case 'cloud':
        return <CloudView/>;
      case 'upgrade':
        return <UpgradeView/>;
      default:
        return null;
    }
  };

  return (
    <PageContainer title={false}>
      <ProCard title={"系统设置"} headerBordered>
        <div className={styles.main}>
          <div className={styles.leftMenu}>
            <Menu
              mode={initConfig.mode}
              selectedKeys={[initConfig.selectKey]}
              onClick={({key}) => {
                setInitConfig({
                  ...initConfig,
                  selectKey: key as SettingsStateKeys,
                });
              }}
            >
              {getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
            {renderChildren()}
          </div>
        </div>
      </ProCard>
    </PageContainer>
  );
};
export default Settings;
