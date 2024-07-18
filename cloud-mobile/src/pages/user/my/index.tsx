import React, {useRef, useState} from 'react'
import {Body, Icon} from "@/components";
import {Avatar, Button, Card, Form, Input, List, Modal, Tag, Toast} from "antd-mobile";
import {deleteHeader} from "@/utils/auth";
import {historyPush} from "@/utils/route";
import {createStyles, useTheme} from "antd-style";
import {useModel} from "umi";
import {Cards, Money, Tongxunlu} from "@/components/icon";
import {Select} from "antd";
import {updateInfo} from "@/service/person/update";
import {ModalShowProps} from "antd-mobile/2x/es/components/modal";
const useStyles = createStyles(()=>{
    return{
        card:{
            ".adm-card-body":{
                display:"flex"
            }
        },
        list:{
            ".adm-list-body":{
                borderTop:"none !important",
                borderBottom:"none !important",
                borderRadius:"8px"
            }
        },
        card1:{
            ".adm-card-body":{
                padding: "var(--adm-card-body-padding-block, 0px) 0"
            }
        },
        item:{
            ".adm-list-item-content-arrow":{
                fontSize:"14px"
            }
        },
        extra:{
            ".adm-list-item-content-extra":{
                marginRight:"17px"
            }
        },
        modal: {
            ".adm-center-popup-wrap": {
                minWidth: "96% !important",
                maxWidth: "96% !important"
            }
        },
        label:{
            ".adm-input-element":{
                fontSize:"14px !important"
            }
        },
        formBody: {
            ".adm-list-body": {
                borderRadius: "5px",
                borderTop: "none !important",
                borderBottom: "none !important",
            },
        },
    }
})
export default () => {
    const {styles:{card,list,card1,item,extra,modal,label,formBody}} = useStyles()
    const theme = useTheme()
    const user = useModel("user")
    const modalRef = useRef()
    /**
     * 表单提交
     */
    const [form] = Form.useForm()
    const [btnLoading,setBtnLoading] = useState(false)
    const formFinish = async(values:any) => {
        setBtnLoading(true)
       await updateInfo({
            body:{
                ...values
            },
           onSuccess:(r:any)=>{
               Toast.show({
                   content:r?.message,
                   position: 'top',
               })
               user?.refreshWebUser()
               modalRef?.current?.close()
           },
           onFail:(r:any)=>{
               Toast.show({
                   content:r?.message || "修改失败",
                   position: 'top',
               })
           },
           onFinally:()=>{
               setBtnLoading(false)
           }
        })
    }
    return (
        <Body showHeader={false} bodyStyle={{padding:0}}>
            <Card className={card} style={{backgroundColor:theme.colorPrimary,borderRadius:0,paddingBlock:"15px"}}>
                    <Avatar src={user?.web?.avatar} style={{width:"60px",height:"60px",marginRight:"15px",borderRadius:"8px"}}/>
                <div>
                    <span style={{
                        color: "#fff",
                        display: "inline-block",
                        marginBottom: "10px"
                    }}>{user?.web?.nick_name}</span><br/>
                    <div style={{display:"flex",alignItems:"center"}}>
                        <Tag style={{
                            backgroundColor: "#dbe6f0",color:theme.colorPrimary,paddingBlock:"6px","--border-radius":"5px","--border-color":theme.colorPrimary
                        }}>{user?.web?.is_master ? '管理员' : (user?.web?.is_admin ? '站长' : '会员')}</Tag>
                        <Tag style={{marginLeft: "10px",backgroundColor: "#dbe6f0",color:theme.colorPrimary,paddingBlock:"6px","--border-radius":"5px","--border-color":theme.colorPrimary}}>ID:{user?.web?.id}</Tag>
                    </div>
                </div>
            </Card>
            <div style={{padding:"10px"}}>
                <Card style={{marginBottom:"10px","--adm-card-padding-inline":0}} className={card1}>
                    <List className={list} style={{borderRadius:"5px"}}>
                        <List.Item  className={item} style={{fontSize:"14px",color:theme.isDarkMode ? "#b3b3b3":"rgba(0,0,0,0.7)"}}
                                    prefix={<Icon style={{fontSize:"22px",color:"#f38e1b"}} type={Money}/>}
                                    extra={<span style={{fontSize:"13px",color:"gray"}}>{user?.web?.money}</span>}
                                    onClick={() =>historyPush("user.pay")}>
                            账户余额
                        </List.Item>
                        <List.Item className={extra} style={{fontSize:"14px",color:theme.isDarkMode ? "#b3b3b3":"rgba(0,0,0,0.7)"}}
                                    prefix={<Icon style={{fontSize:"22px",color:"#33cc4d"}} type={Cards}/>}
                                    extra={<span style={{fontSize:"13px",color:"gray"}}>{user?.web?.id}</span>}>
                            账号ID
                        </List.Item>
                        <List.Item  className={item} style={{fontSize:"14px",color:theme.isDarkMode ? "#b3b3b3":"rgba(0,0,0,0.7)"}}
                                    prefix={<Icon style={{fontSize:"22px",color:"#19b3e6"}} type={Tongxunlu}/>}
                                    extra={<span style={{fontSize:"13px",color:"gray"}}>{user?.web?.nick_name}</span>}
                                    onClick={() => {
                                        modalRef.current = Modal?.show({
                                            className: modal,
                                            showCloseButton: true,
                                            content: (<Form form={form} initialValues={{nick_name:user?.web?.nick_name || "未设置"}} className={formBody} onFinish={formFinish}>
                                                <Form.Item name="nick_name" label="昵称" className={label}>
                                                    <Input placeholder="请输入账户名称" clearable />
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button type="submit" block color={"primary"} loading={btnLoading} style={{letterSpacing:"1px"}}>保存</Button>
                                                </Form.Item>
                                            </Form>)
                                        } as ModalShowProps)
                                    } }>
                            我的昵称
                        </List.Item>
                    </List>
                </Card>
            </div>

        </Body>
    )
}