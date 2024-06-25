import {createStyles} from "antd-style";
import React from "react";
import {Outlet} from "umi";
import {PullToRefresh} from "antd-mobile";

const useStyles = createStyles(():any=>{
    return{
        body:{
            height:"calc(100vh - 100px)",
            overflowY:"auto",
        }
    }
})
export type BodyProps = {
    headerTitle?: any;
    showTabBar?: any;
};
const Body: React.FC<BodyProps> = (props) => {
    const { styles:{body} } = useStyles();
    return(
        <div className={body}>
            <PullToRefresh completeDelay={1000}>
                <Outlet/>
            </PullToRefresh>
        </div>
    )
}
export default Body;