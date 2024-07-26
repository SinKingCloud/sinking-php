import React, {useEffect, useState} from 'react'
import {Body} from "@/components";
import {createStyles} from "antd-style";
import {Button, Form, Input, Skeleton, TextArea, Toast} from "antd-mobile";
import {getWeb, setWeb} from "@/service/admin/set";
import {useModel} from "umi";
import {getMy} from "@/service/admin/price";
const useStyles = createStyles(({token,css,isDarkMode}) => {
    const border = isDarkMode ? "1px solid rgb(40,40,40) !important" : "1px solid #eeeeee !important"
    return {
        head:{
            backgroundColor:`${token.colorPrimary} !important`,
            color:"#fff"
        },
        label: css`
            .adm-list-item-content-prefix {
                font-size: 12px !important;
                width: 65px
            } ,
        . adm-form-item-label {
            line-height: 2;
            margin-bottom: 6px !important;
        },
        . adm-list-item-content {
            border-bottom: ${border};
            border-top: none !important;
        },
        . adm-input-element {
            font-size: 12px !important;
        },

        `,
        btn: {
            ".adm-list-item-content": {
                borderBottom: "none !important",
                borderTop: "none !important",
                paddingBlock: "9px",
            },
        },
        body: {
            ".adm-list-body": {
                borderRadius: "5px",
                borderTop: "none !important",
                borderBottom: "none !important",
            },
            ".adm-input-element": {
                fontSize: "13px !important"
            },
        },
        butt:{
            "--background-color": token.colorPrimary,
            "--border-color": token.colorPrimary,
            fontWeight: 600,
            letterSpacing:"1px"
        },
        inner:{
            ".adm-form-item-child-inner":{
                display:"flex"
            }
        },
    }
})
export default () => {
    const {styles:{head,body,label,btn,butt,inner}} = useStyles()
    const [form] = Form.useForm()
    const web = useModel("web")
    /**
     * 初始化表单值
     */
    const [isLoading, setIsLoading] = useState(false);
    const getConfigs = async () => {
        setIsLoading(true);
        return await getWeb({
            onSuccess: (r: any) => {
                form.setFieldsValue(r?.data)
            },
            onFail: (r: any) => {
                Toast?.show({
                    content: r?.message || "请求失败",
                    position:"top"
                })
            },
            onFinally: () => {
                setIsLoading(false)
            }
        });
    }

    /**
     * 表单提交
     */
    const [loading,setLoading] = useState(false)
    const formFinish = async (values:any)=>{
        setLoading(true)
        await setWeb({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                Toast?.show({
                    content: r?.message,
                    position:"top"
                })
                web?.refreshInfo()
            },
            onFail: (r: any) => {
                Toast?.show({
                    content: r?.message || "请求失败",
                    position:"top"
                })
            },
            onFinally:()=>{
                setLoading(false)
            }
        });
    }
    /**
     * 获取成本价格
     */
    const [myPrice, setMyPrice] = useState({});
    const getMyPrice = async () => {
        await getMy({
            onSuccess: (r: any) => {
                setMyPrice(r?.data || {});
            },
            onFail: (r: any) => {
                Toast?.show({
                    content: r?.message || "请求失败",
                    position:"top"
                })
            }
        });
    }
    useEffect(() => {
        getConfigs()
        getMyPrice()
    }, []);

    return (
        <Body title="基本设置" titleStyle={{color:"#fff"}} headClassNames={head}>
            {isLoading && <Skeleton.Paragraph animated/> ||
                <Form form={form} onFinish={formFinish} className={body}>
                    <Form.Item label="网站名称" name="name" className={label}>
                        <Input placeholder="请输入网站名称"/>
                    </Form.Item>
                    <Form.Item label="网站标题" name="title" className={label}>
                        <Input placeholder="请输入网站标题"/>
                    </Form.Item>
                    <Form.Item label="网站关键词" name="keywords" className={label}>
                        <TextArea placeholder='请输入网站关键词'/>
                    </Form.Item>
                    <Form.Item label="网站描述" name="description" className={label}>
                        <TextArea placeholder='请输入网站描述'/>
                    </Form.Item>
                    <Form.Item label="到期时间" style={{display:"flex"}}  className={inner}>
                        <Form.Item noStyle className={label}>
                            <Input disabled={true} width="80%" value={web?.info?.expire_time}/>
                        </Form.Item>
                       <Form.Item noStyle>
                           <Button width="18%" color='primary'>续期</Button>
                       </Form.Item>
                    </Form.Item>
                    <Form.Item className={btn}>
                        <Button type={"submit"} block color='primary' loading={loading} className={butt}>提交</Button>
                    </Form.Item>
                </Form>
            }
        </Body>
    )
}