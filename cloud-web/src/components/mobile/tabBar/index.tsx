import React from "react";
import { TabBar } from 'antd-mobile'
import {createStyles} from "antd-style";
import {useLocation} from "umi";
const useStyles = createStyles(():any=>{
    return{
        tab_bar:{
            height:"50px",
            position:"fixed",
            bottom:"0px",
            zIndex:999,
            width:"100vw",
            boxShadow:"0px 0px 2px rgba(0,0,0,0.2)",
        },
    }
})
export interface TabItem {
    icon?: any;
    title?: any;
    key?: any;
}
export type TabBarProps = {
    tabBar?:TabItem[];
    change?:(key:any)=>void;
    path?:any;
}
const TabBars: React.FC<TabBarProps> = (props) => {
    const {styles:{tab_bar}} = useStyles();
    const {
        tabBar,
        change,
        path
    } = props;
    const {pathname} = useLocation();
    const showTab = ()=>{
      return pathname == '/user/index' || pathname == '/user/docs'
    }
    return <>
        {showTab() &&
            <div  className={tab_bar}>
                <TabBar
                    activeKey={path}
                    onChange={change}>
                    {tabBar?.map(item => (
                        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                    ))}
                </TabBar>
            </div>
            || null}
    </>
}
export default TabBars;