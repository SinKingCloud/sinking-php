import React, {useCallback} from 'react';
import {CopyOutlined, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {Avatar, Menu, Spin} from 'antd';
// @ts-ignore
import {history, useModel} from 'umi';
import {stringify} from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {outLogin} from '@/services/user/login';
import type {MenuInfo} from 'rc-menu/lib/interface';
import * as auth from "@/util/auth";

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  const {query = {}, pathname} = history.location;
  const {redirect} = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    auth.deleteHeader()
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({menu}) => {
  const {initialState, setInitialState} = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const {key} = event;
      if (key === 'logout') {
        setInitialState((s: any) => ({...s, currentUser: undefined}));
        loginOut();
        return;
      }
      history.push(`/person/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const {currentUser} = initialState;

  if (!currentUser || !currentUser.nick_name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <>
          <Menu.Item key="setting">
            <SettingOutlined/>
            账号设置
          </Menu.Item>
          <Menu.Item key="log">
            <CopyOutlined/>
            操作日志
          </Menu.Item>
        </>
      )}
      {menu && <Menu.Divider/>}
      <Menu.Item key="logout">
        <LogoutOutlined/>
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown} placement="bottomRight" arrow={true}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar}
                src={currentUser.avatar || "https://aliyun_id_photo_bucket.oss.aliyuncs.com/default_handsome.jpg"}
                alt="avatar"/>
        <span className={`${styles.name} anticon`}>{currentUser.nick_name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
