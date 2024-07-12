import React from 'react'
import {Body} from "@/components";
import {Button, Card, Form, Input} from "antd-mobile";
export default () => {

    return (
        <Body title={"等级查询"}>
            <div  style={{
                padding: "10px",
                boxSizing: "border-box",
                height: "calc(100vh - 45px)",
                backgroundColor: "#faf8f8"
            }}>
                <Card>
                    <p style={{color:"#f655a6",textAlign:'center',fontSize:"13px",fontWeight:600}}>欢迎使用等级查询工具</p>
                </Card>
                <Form>
                    <Form.Item name="account">
                        <Input placeholder="请输入号码查询" clearable/>
                    </Form.Item>
                    <Form.Item>
                        <Button color="warning" block size="large">确&nbsp;定</Button>
                    </Form.Item>
                </Form>
            </div>
        </Body>
    )
}