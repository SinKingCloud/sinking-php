import React from 'react'
import {Body} from "@/components";
import {Button, Dialog, Toast} from "antd-mobile";

export default () => {
    return (
        <Body>我的<Button onClick={() => {
            Dialog.alert({
                content: '人在天边月上明',
                onConfirm: () => {
                    console.log('Confirmed')
                },
            })
        }}>test</Button>
            <Button color='danger' onClick={()=>{
                Toast.show({
                    content: 'Hello World, This is a long text',
                    afterClose: () => {
                        console.log('after')
                    },
                })
            }} fill='solid'>
                Solid
            </Button>
        </Body>
    )
}