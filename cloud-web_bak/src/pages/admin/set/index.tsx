import React, {useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Menu} from 'antd';
import BaseView from './components/base';
import styles from './style.less';
import ProCard from "@ant-design/pro-card";
import DomainView from "@/pages/admin/set/components/domain";
import ContactView from "@/pages/admin/set/components/contact";
import NoticeView from "@/pages/admin/set/components/notice";
import UiView from "@/pages/admin/set/components/ui";

const {Item} = Menu;

type SettingsStateKeys = 'base' | 'ui' | 'contact' | 'notice' | 'domain';
type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};

const Settings: React.FC = () => {
  const menuMap: Record<string, React.ReactNode> = {
    base: '基本设置',
    ui: '界面设置',
    contact: '客服设置',
    notice: '通知设置',
    domain: '域名设置',
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
      case 'ui':
        return <UiView/>;
      case 'contact':
        return <ContactView/>;
      case 'notice':
        return <NoticeView/>;
      case 'domain':
        return <DomainView/>;
      default:
        return null;
    }
  };

  return (
    <PageContainer title={false}>
      <ProCard title={"网站设置"} headerBordered>
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
