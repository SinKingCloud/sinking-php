import React, {useState} from "react"
import {Body, Icon} from "@/components";
import {Button, Form, Input, Selector, Toast} from "antd-mobile";
import {createStyles, useResponsive} from "antd-style";
import {Mayun, Qq, Weinxin} from "@/components/icon";
import {recharge} from "@/service/pay";
import {setPayJumpUrl} from "@/utils/pay";
import {historyPush} from "@/utils/route";
const useStyles = createStyles(():any=>{
    return{
        label:{
            ".adm-list-item-content-prefix":{
                fontSize:"30px",
                paddingTop:"5px !important",
                fontWeight:600,
                width:"auto !important",
            },
            ".adm-form-item-label":{
                lineHeight:1
            },
            ".adm-list-item-content":{
                borderBottom:"none !important",
                borderTop:"none !important",
                paddingBlock:"8px"
            },

        },
        body:{
            ".adm-list-body":{
                borderRadius:"5px",
                borderTop:"none !important",
                borderBottom:"none !important",
            },
            marginBottom:"10px",
        },
    }
})
export default ()=>{
    const [form] = Form.useForm()
    const {styles:{label,body}} = useStyles();
    const [loading,setLoading] = useState(false)
    const {mobile} = useResponsive()
    const formFinish = async(values:any)=>{
        values = {money: parseInt(values?.money), type: parseInt(values?.type)}
        setLoading(true)
       await recharge({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                    setPayJumpUrl();
                    if (mobile) {
                        window.location.href = r.data;
                    } else {
                        window.open(r.data);
                    }
                Toast.show({
                    content: '订单是否已支付成功,如支付成功请点击刷新按钮刷新余额',
                    afterClose: () => {
                        historyPush("user.pay")
                    },
                })
            },
            onFail: (r: any) => {
                Toast.show({
                    content:r?.message || "请求错误",
                    position: 'top',
                })
            },
           onFinally:()=>{
               setLoading(false)
           }
        })
    }
    return(
        <Body title="充值账户余额" bodyStyle={{padding:"20px"}}>
            <Form  layout="horizontal" form={form} className={body} onFinish={formFinish}>
                <p style={{fontSize:"14px"}}>充值金额</p>
                <Form.Item name="money" label={"￥"}  className={label}>
                    <Input placeholder="请输入充值金额" clearable/>
                </Form.Item>
                <p style={{fontSize: "14px"}}>支付方式</p>
                <Form.Item name="type"  className={label}>
                    <Selector
                        style={{"--border-radius": "5px","--padding":"8px 12px"}}
                        options={[
                            {
                                label:(
                                    <span style={{fontSize:"12px",fontWeight:600}}><Icon type={Mayun} style={{fontSize:"14px",marginRight:"5px"}}/>支付宝</span>
                                ),
                                value: 0,
                            },
                            {
                                label:(
                                    <span style={{fontSize:"12px",fontWeight:600}}><Icon type={Weinxin} style={{fontSize:"14px",marginRight:"5px"}}/>微信</span>
                                ),
                                value: 1,
                            },
                            {
                                label: (
                                    <span style={{fontSize:"12px",fontWeight:600}}><Icon type={Qq}  style={{fontSize:"14px",marginRight:"5px"}}/>QQ</span>
                                ),
                                value: 2,
                            }
                        ]}
                        defaultValue={[0]}
                    />
                </Form.Item>
                <Form.Item className={label}>
                    <Button type={"submit"} block color='primary' loading={loading}
                            style={{"--background-color":"#5ca5d6","--border-color":"#5ca5d6",fontSize:"15px",fontWeight:600,marginBottom:"10px",letterSpacing:"1px"}}>立即支付</Button>
                </Form.Item>
            </Form>
            <p style={{color:"#b3b3b3",fontSize:"12px",textAlign:"center"}}>提示信息:在线支付后余额实时到账，无需等待</p>
        </Body>
    )
}