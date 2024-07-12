import {ConfigProvider, NavBar} from "antd-mobile";
import {Animation} from "@/components";
import {Animate} from "@/components/animation";
import React from "react";
import {createStyles} from "antd-style";
import zhCN from "antd-mobile/es/locales/zh-CN";

const useStyles = createStyles(({token, isDarkMode}): any => {
    return {
        header: {
            borderBottom: "0.5px solid " + (isDarkMode ? "rgb(29, 29, 29)" : "rgb(236, 236, 236)"),
            backgroundColor: token?.colorBgContainer,
            ".adm-nav-bar-back-arrow": {
                fontSize: "19px",
            },
        },
        body: {
            overflowY: "auto",
            backgroundColor: token?.colorBgContainer,
            flex: 1,
        },
        title2: {
            fontSize: "15px",
            fontWeight: "bold",
            color: isDarkMode ? "rgb(240, 240, 240)" : "rgb(91, 90, 90)",
        }
    }
});

export type BodyProps = {
    onBack?: () => void, //返回按钮的事件
    title?: React.ReactNode;// 头部标题显示
    showBack?: React.ReactNode;// 显示返回的按钮
    children?: any;//子内容
    showHeader?: any;//显示头部header
    right?: React.ReactNode;// 导航栏右边内容
    animate?: boolean;//动画
    headStyle?: any;//头部样式
    bodyStyle?: any;//内容样式
    headClassNames?: any;//头部class
    bodyClassNames?: any;//内容class
    themes?: any;//主题
    mode?: any;//模式
    titleStyle?:any;//标题样式
}

const Content: React.FC<BodyProps> = (props: any) => {

    const {styles: {header, body, title2}} = useStyles();

    const back = () => {
        window?.history?.back();
    }

    const {
        onBack = back,
        title = undefined,
        showBack = undefined,
        showHeader = true,
        children,
        right = undefined,
        animate = true,
        headStyle = undefined,
        bodyStyle = undefined,
        headClassNames = "",
        bodyClassNames = "",
        titleStyle = undefined
    } = props;

    /**
     * 页面容器
     */
    return <ConfigProvider locale={zhCN}>
        {showHeader && <NavBar
            backIcon={showBack}
            onBack={onBack}
            className={header + " " + headClassNames}
            right={right} style={headStyle}>
            {title && <span className={title2} style={titleStyle}>{title}</span>}
        </NavBar>}
        <div className={body + " " + bodyClassNames} style={bodyStyle}>
            <Animation animate={animate ? Animate.FadeUp : Animate.None}>
                {children}
            </Animation>
        </div>
    </ConfigProvider>;
};

export default Content
