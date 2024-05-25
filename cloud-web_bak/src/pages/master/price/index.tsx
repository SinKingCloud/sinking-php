import React, {useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Menu} from 'antd';
import styles from './style.less';
import ProCard from "@ant-design/pro-card";
import SiteView from "@/pages/master/price/components/site";

const {Item} = Menu;

type SettingsStateKeys = 'site';
type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};

const Settings: React.FC = () => {
  const menuMap: Record<string, React.ReactNode> = {
    site: '系统价格',
  };

  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'site',
  });
  const getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  const renderChildren = () => {
    const {selectKey} = initConfig;
    switch (selectKey) {
      case 'site':
        return <SiteView/>;
      default:
        return null;
    }
  };

  return (
    <PageContainer title={false}>
      <ProCard title={"价格设置"} headerBordered>
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
