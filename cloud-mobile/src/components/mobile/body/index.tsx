import React from "react";
import Theme from "@/components/theme";
import Content from "./content";
import {Toast, ToastShowProps} from "antd-mobile";
import {createStyles} from "antd-style";
import {Animate} from "@/components/animation";

export type BodyProps = {
    onBack?: () => void, //返回按钮的事件
    title?: React.ReactNode;// 头部标题显示
    showBack?: React.ReactNode;// 显示返回的按钮
    children?: any;//子内容
    showHeader?: any;//显示头部header
    right?: React.ReactNode;// 导航栏右边内容
    rightBtn?: any;//导航栏右边按钮
    animate?: boolean;//动画
    headStyle?: any;//头部样式
    bodyStyle?: any;//内容样式
    headClassNames?: any;//头部class
    bodyClassNames?: any;//内容class
    themes?: any;//主题
    mode?: any;//模式
    titleStyle?: any;//标题样式
    loading?: boolean;//是否加载
    space?: boolean;//是否开启间距
}

export interface BodyRef {
    showToast?: (params: ToastShowProps, animate?: boolean) => any;//toast提示
    clearToast?: () => void;//清理toast提示
}

const useStyles = createStyles(({css, isDarkMode, responsive}): any => {
    return {
        toast: css`
            @keyframes fadeInUp200px {
                0% {
                    opacity: 0;
                    transform: translateY(200px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .adm-toast-main {
                animation-name: fadeInUp200px;
                animation-fill-mode: both;
                animation-duration: 0.3s;
            }
        `,
    }
});

const Body = React.forwardRef<BodyRef, BodyProps>((props, ref) => {

    /**
     * 样式信息
     */
    const {styles: {toast}} = useStyles();

    /**
     * 显示提示
     * @param params 参数
     * @param animate 是否使用动画
     */
    const showToast = (params: ToastShowProps, animate = true): any => {
        if (animate) {
            params.maskClassName = toast;
        }
        return Toast?.show(params);
    };
    /**
     * 清理提示
     */
    const clearToast = () => {
        Toast?.clear()
    }

    /**
     * 注册方法
     */
    React.useImperativeHandle(ref, () => ({
        showToast: showToast,
        clearToast: clearToast,
    }));

    /**
     * 页面容器
     */
    return <Theme theme={props?.themes} mode={props?.mode}>
        <Content {...props}>
            {props?.children}
        </Content>
    </Theme>;
});

export default Body
