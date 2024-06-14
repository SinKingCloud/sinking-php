import React, {useState} from 'react';
import {Menu} from 'antd';
import BaseView from './components/base';
import PayView from "./components/pay";
import EmailView from "./components/email";
import CloudView from "./components/cloud";
import ProCard from "@ant-design/pro-card";
import CashView from "./components/cash";
import WebView from "./components/web";
import UpgradeView from "./components/upgrade";
import SmsView from "./components/sms";
import {createStyles} from "antd-style";
import {Body, Title} from "@/components";

type SettingsStateKeys = 'base' | 'email' | 'sms' | 'pay' | 'cash' | 'web' | 'cloud' | 'upgrade';
type SettingsState = {
    mode: 'inline' | 'horizontal';
    selectKey: SettingsStateKeys;
};
const useStyles = createStyles(({css,responsive,isDarkMode}):any=>{
    const border = isDarkMode ? "1px solid rgb(50, 50, 50)" : "1px solid #f0f0f0"
    return{
        main:css`
            display: flex;
            width: 100%;
            height: 100%;
            padding-bottom: 16px;
            .ant-menu-light.ant-menu-inline .ant-menu-item::after{
                top: 19%;
                right: 6px;
                border-top-left-radius: 15px;
                border-bottom-left-radius: 15px;
                height: 60%;
            }
            .ant-menu-light.ant-menu-root.ant-menu-inline{
                border-right: none;
            }
            ${responsive.md}{
                flex-direction: column;
            }
        `,
        leftMenu:css`
            width: 224px;
            .ant-menu-item{
                position: absolute;
                font-weight: bold;
                font-size: 14px;
                border-radius: 10px;
            }
            ${responsive.md}{
                width: 100%;
                border: none;
                margin-bottom: 10px;
            }
        `,
        right:css`
            flex: 1;
            padding: 8px 40px;
            margin-left: 1px;
            border-left:${border};
            ${responsive.md}{
                padding: 10px;
                border-left:none;
            }
        `,
        title:css`
            margin-bottom: 20px;
            font-weight: bolder;
            font-size: 25px;
            line-height: 28px;
        `,
        card:css`
            .ant-pro-card-body{
                padding: 24px;
            }
        `,
    }
})
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
    const {styles:{main,leftMenu,right,title,card}} = useStyles()
    const [initConfig, setInitConfig] = useState<SettingsState>({
        mode: 'inline',
        selectKey: 'base',
    });

    const getMenu = () => {
        return Object.keys(menuMap).map((item) => {
            return {
                key: item,label:menuMap[item]
            }
        });
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
        <Body>
            <ProCard title={<Title>系统设置</Title>} headerBordered className={card}>
                <div className={main}>
                    <div className={leftMenu}>
                        <Menu
                            mode={initConfig.mode}
                            selectedKeys={[initConfig.selectKey]}
                            onClick={({key}) => {
                                setInitConfig({
                                    ...initConfig,
                                    selectKey: key as SettingsStateKeys,
                                });
                            }}
                            items={getMenu()}
                        />
                    </div>
                    <div className={right}>
                        <div className={title}>{menuMap[initConfig.selectKey]}</div>
                        {renderChildren()}
                    </div>
                </div>
            </ProCard>
        </Body>
    );
};
export default Settings;
