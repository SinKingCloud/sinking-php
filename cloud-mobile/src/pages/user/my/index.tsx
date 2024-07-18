import React from 'react'
import {Body} from "@/components";
import {Button, Dialog, Toast} from "antd-mobile";
import {deleteHeader} from "@/utils/auth";
import {historyPush} from "@/utils/route";

export default () => {
    return (
        <Body>
            <Button color='danger' onClick={()=>{
             deleteHeader()
                historyPush("user.login")
            }} fill='solid'>
                Solid
            </Button>
        </Body>
    )
}