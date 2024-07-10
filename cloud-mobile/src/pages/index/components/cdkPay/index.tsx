import React, {useState} from 'react'
import {Body, Icon} from "@/components";
import {Button, Checkbox, Form, Input, NoticeBar} from "antd-mobile";
import {createStyles} from "antd-style";
import {Label} from "@/components/icon";
import {Modal} from "antd"
import {history} from "umi"
const useStyles = createStyles(():any=>{
    return{
        label:{
            ".adm-list-item-content-prefix":{
                fontSize:"12px",
                width:"65px"
            },
            ".adm-input-element":{
                fontSize:"12px !important"
            },
            ".adm-form-item-label":{
                lineHeight:2
            },
            ".adm-list-item-content":{
                borderBottom:"1px solid #eeeeee",
                borderTop:"none !important"
            }
        },
        body:{
            ".adm-list-body":{
                borderRadius:"5px"
            },
            marginBottom:"10px"
        },
        modal:{
            ".ant-modal-title":{
                textAlign:"center",
            },
            ".ant-modal-content":{
                padding: "20px 0 !important"
            }
        },
        check:{
            ".adm-checkbox-icon":{
                height:"15px !important",
                width:"15px !important",
            }
        }
    }
})
export default () => {
    const {styles:{label,body,modal,check}} = useStyles();
    const [form] = Form.useForm();
    const [isModalOpen,setIsModalOpen] = useState<any>(false)
    return (
        <Body title="使用卡密下单">
            <Modal title="请选择要更换到的代练地区" className={modal} open={isModalOpen} onCancel={()=>setIsModalOpen(false)} footer={null}>
                <p style={{fontSize: "12px", lineHeight: "30px", color: "#f38e1b",textAlign:"center",
                    borderTop:"1px solid #eeeeee",borderBottom:"1px solid #eeeeee",marginBottom:0}}>
                    支持全国30个地区可选，请选择常用地进行使用
                </p>
                <ul style={{listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", margin: 0}}>
                    <li style={{
                        fontSize: "12px",
                        width: "33.3%",
                        borderBottom: "1px solid #eeeeee",
                        cursor: "pointer",
                        height: "30px",
                        lineHeight: "30px",
                        textAlign: "center"
                    }}>
                        <span style={{color: "#477eeb", marginRight: "5px"}}><Icon type={Label}/></span>
                        <span>广东省</span>
                    </li>
                </ul>
            </Modal>
            <div style={{
                padding: "10px",
                boxSizing: "border-box",
                height: "calc(100vh - 45px)",
                backgroundColor: "#faf8f8"
            }}>
                <NoticeBar
                    style={{
                        fontSize: "12px",
                        lineHeight: "15px",
                        borderRadius: "5px",
                        backgroundColor: "#b6d2ef", marginBottom:"10px"}}
                    content='暑假活动开启，下单任意套装代练3个月及以上的均享受超低折扣价，并且还有额外赠送时长，欢迎参与。'
                    wrap
                    color='info'
                />
                <Form layout='horizontal' form={form} className={body} >
                    <p style={{textAlign: 'center', color: "#f655a6",fontSize:"12px",fontWeight:"bold",letterSpacing:"0.5px",lineHeight:"30px"}}>请输入需要代练的号码和密码</p>
                    <Form.Item label='号码 :' name="number" className={label}>
                        <Input placeholder='请输入要代练的号码'/>
                    </Form.Item>
                    <Form.Item label='密码 :' name="password" className={label}>
                        <Input placeholder='请输入代练号码的密码' />
                    </Form.Item>
                    <Form.Item label='代练卡密 :' name="cdk" className={label}>
                        <Input placeholder='请输入代练下单卡密' />
                    </Form.Item>
                    <Form.Item className={label}>
                        <div style={{fontSize:"12px",marginTop:"10px"}}>
                            <span style={{fontWeight:"bold",marginRight:"10px"}}>代练地区 :</span>
                            <span style={{color:"#477eeb",marginRight:"8px"}}><Icon type={Label}/></span>
                            <span style={{color:"red"}}>安徽省</span>
                        </div>
                        <span style={{fontSize:"12px",lineHeight:1}}>此位置来自于系统自动定位，如定位错误，
                                <a style={{fontWeight:"bold",color:"#477eeb"}} onClick={()=>setIsModalOpen(true)}>可点此更改</a>
                            </span>
                    </Form.Item>
                    <Form.Item name="checked" className={label}>
                        <Checkbox className={check}>
                            <span style={{fontSize: "13px", marginRight: "10px"}}>我已阅读</span>
                            <span style={{fontSize: "12px", color: "#477eeb"}}  onClick={(e) => {
                                e.preventDefault();
                                history.push("/helpInfo")
                            }}>关于禁止养号、禁止小号挂机的说明</span>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{"--background-color":"#5ca5d6","--border-color":"#5ca5d6"}} block color='primary'>下一步</Button>
                    </Form.Item>
                </Form>
            </div>
        </Body>
    )
}