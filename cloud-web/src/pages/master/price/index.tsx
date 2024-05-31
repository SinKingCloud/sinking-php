import React, {useState} from 'react';
import {Menu} from 'antd';
import ProCard from "@ant-design/pro-card";
import SiteView from "./components";
import {createStyles} from "antd-style";

const {Item} = Menu;

type SettingsStateKeys = 'site';
type SettingsState = {
    mode: 'inline' | 'horizontal';
    selectKey: SettingsStateKeys;
};
const useStyles = createStyles(({css,responsive}):any=>{
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
            border-left:1px solid #f0f0f0 ;
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
    const {styles:{main,leftMenu,right,title,card}} = useStyles()
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
            <ProCard title={"价格设置"} headerBordered className={card}>
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
                        >
                            {getMenu()}
                        </Menu>
                    </div>
                    <div className={right}>
                        <div className={title}>{menuMap[initConfig.selectKey]}</div>
                        {renderChildren()}
                    </div>
                </div>
            </ProCard>
    );
};
export default Settings;
