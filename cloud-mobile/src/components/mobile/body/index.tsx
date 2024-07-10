import {NavBar, SafeArea} from "antd-mobile";
import {Animation} from "@/components";
import {Animate} from "@/components/animation";
import React from "react";
import {createStyles} from "antd-style";
import {history} from "umi";
const useStyles = createStyles(():any => {
    return {
        header: {
            boxShadow: "0px 0px 2px rgba(0,0,0,0.2)",
            ".adm-nav-bar-back-arrow":{
                fontSize: "19px",
            }
        },
        body: {
            overflowY: "auto",
            flex: 1,
        },
    }
})
export type BodyProps = {
    onBack?: () => void, //返回按钮的事件
    title?: React.ReactNode;// 头部标题显示
    showTabBar?: any; // 显示底部tabBar
    showBack?: React.ReactNode;// 显示返回的按钮
    children?: any;//子内容
    showHeader?: any;//显示头部header
    right?: React.ReactNode;// 导航栏右边内容
    Animal?: boolean,//动画
}
const Body: React.FC<BodyProps> = (props: any) => {
    const {styles: {header, body}} = useStyles()
    const back = () => {
        history.back()
    }
    const {
        onBack = back,
        title = undefined,
        showBack = undefined,
        showHeader = true,
        children,
        right = undefined,
        Animal = true,
    } = props
    return <>
            {showHeader && <NavBar
                backIcon={showBack}
                onBack={onBack}
                className={header}
                right={right}
            >
                <span style={{fontSize:"15px",fontWeight:"bold"}}>{title}</span>
            </NavBar>}
            <div className={body} >
                <Animation animate={Animal ? Animate.FadeUp : Animate.None}>
                    <SafeArea position='top'/>
                    {children}
                    <SafeArea position='bottom'/>
                </Animation>
            </div>
    </>;
};
export default Body
