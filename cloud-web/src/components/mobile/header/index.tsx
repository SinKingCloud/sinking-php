import {createStyles} from "antd-style";
import {NavBar} from "antd-mobile";
import React from "react";
const useStyles = createStyles(():any=>{
    return{
        header:{
            height:"50px",
            position:'sticky',
            top:"0px",
            zIndex:"999"
        }
    }
})
export type HeaderProps = {
    backArrow?:any,
    titles?:any,
    onBack?:()=>void
}
const Header: React.FC<HeaderProps> = (props:any) => {
    const { styles:{header} } = useStyles();
    const {backArrow,titles,onBack} = props;
    return (
        <NavBar
            className={header}
            backArrow={backArrow}
            onBack={onBack}
        >
            {titles}
        </NavBar>
    )
}
export default Header