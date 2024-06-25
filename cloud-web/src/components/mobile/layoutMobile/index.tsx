import React from "react";
import Header from "../header"
import TabBars from "../tabBar";
import Body from "../body"
export type LayoutMobileProps = {
    tabBar?:[
        {
            icon:any,
            title:any;
            key:any,
        }
    ];
    change?:(key:any)=>void;
    path?:any;
    backArrow?:any,
    titles?:any,
    onBack?:()=>void;
}
const Mobile: React.FC<LayoutMobileProps> = (props:any) => {
    const{
        tabBar,
        change,
        path,
        backArrow,
        titles,
        onBack
    } = props;
    return (
        <div >
          <Header backArrow={backArrow} titles={titles} onBack={onBack}/>
            <Body/>
            <TabBars tabBar={tabBar} change={change} path={path}/>
        </div>
    )
}
export default Mobile;