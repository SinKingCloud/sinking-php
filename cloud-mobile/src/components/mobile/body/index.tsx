import React from "react";
import Theme from "@/components/theme";
import Content from "./content";
import {
    ActionSheet,
    ActionSheetProps,
    Dialog,
    DialogAlertProps,
    DialogConfirmProps,
    DialogProps, Modal, ModalAlertProps, ModalConfirmProps, ModalShowProps,
    Toast,
    ToastShowProps
} from "antd-mobile";
import {createStyles} from "antd-style";
import {VirtualRef} from "@/components";

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
    showActions?: (params: ActionSheetProps) => any;//action提示
    clearToast?: () => void;//清理toast提示
    showDialog?: (params: DialogProps) => any;//dialog提示
    showDialogAlert?: (params: DialogAlertProps) => any;//dialog alert提示
    showDialogConfirm?: (params: DialogConfirmProps) => any;//dialog confirm提示
    clearDialog?: () => void;//清理dialog提示
    showModal?: (params: ModalShowProps) => any;//modal提示
    showModalAlert?: (params: ModalAlertProps) => any;//modal alert提示
    showModalConfirm?: (params: ModalConfirmProps) => any;//modal confirm提示
    clearModal?: () => void;//清理modal提示
}

const useStyles = createStyles(({css}): any => {
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
     * 显示action
     * @param params
     */
    const showActions = (params: ActionSheetProps) => {
        params.getContainer = VirtualRef?.current;
        return ActionSheet?.show(params);
    }

    /**
     * 显示Dialog
     * @param params
     */
    const showDialog = (params: DialogProps) => {
        params.getContainer = VirtualRef?.current;
        return Dialog?.show(params);
    }

    /**
     * dialog提示
     * @param params
     */
    const showDialogAlert = (params: DialogAlertProps) => {
        params.getContainer = VirtualRef?.current;
        return Dialog?.alert(params);
    }

    /**
     * dialog对话框
     * @param params
     */
    const showDialogConfirm = (params: DialogConfirmProps) => {
        params.getContainer = VirtualRef?.current;
        return Dialog?.confirm(params);
    }

    /**
     * 清理dialog提示
     */
    const clearDialog = () => {
        Dialog?.clear();
    }

    /**
     * 显示Modal
     * @param params
     */
    const showModal = (params: ModalShowProps) => {
        params.getContainer = VirtualRef?.current;
        return Dialog?.show(params);
    }

    /**
     * Modal提示
     * @param params
     */
    const showModalAlert = (params: ModalAlertProps) => {
        params.getContainer = VirtualRef?.current;
        return Modal?.alert(params);
    }

    /**
     * Modal对话框
     * @param params
     */
    const showModalConfirm = (params: ModalConfirmProps) => {
        params.getContainer = VirtualRef?.current;
        return Modal?.confirm(params);
    }

    /**
     * 清理Modal提示
     */
    const clearModal = () => {
        Modal?.clear();
    }

    /**
     * 注册方法
     */
    React.useImperativeHandle(ref, () => ({
        showToast,
        clearToast,
        showActions,
        showDialog,
        showDialogAlert,
        showDialogConfirm,
        clearDialog,
        showModal,
        showModalAlert,
        showModalConfirm,
        clearModal
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
