import React, {useEffect, useState} from 'react';
import {createStyles} from "antd-style";
import {Body} from "@/components";
import {Button, Form, Input, TextArea, Toast} from "antd-mobile";
import {getNotice, setNotice} from "@/service/admin/set";
const useStyles = createStyles(({token,css,isDarkMode}):any => {
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
        .adm-text-area{
            --font-size: var(--adm-font-size-4);
        },
        .adm-text-area-element{
            margin-top: 5px;
        }
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
            ".adm-list-item": {
                paddingRight: "12px"
            },
            ".adm-input-element": {
                fontSize: "12px !important"
            },
        },
        butt:{
            marginLeft:"10px"
        },
    }
});
export default () => {
    const {styles:{head,body,label,btn,butt}} = useStyles();
    const [form] = Form.useForm();
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        return await getNotice({
            onSuccess: (r: any) => {
                form.setFieldsValue(r?.data);
            },
            onFail: (r: any) => {
                Toast?.show({
                    content: r?.message || "请求失败",
                    position: "top",
                });
            },
        });
    }
    /**
     * 提交表单
     */
    const [btnLoading,setBtnLoading] = useState(false);
    const onFinish = async (values: any) => {
        setBtnLoading(true);
        await setNotice({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                Toast?.show({
                    content:r?.message || "修改成功",
                    position: "top",
                });
            },
            onFail: (r: any) => {
                Toast?.show({
                    content:r?.message || "修改失败",
                    position: "top",
                });
            },
            onFinally:()=>{
                setBtnLoading(false)
            }
        });
    }
    const [pageLoading,setPageLoading] = useState(true)
    useEffect(() => {
        setPageLoading(true)
        getConfigs().finally(()=>{
            setPageLoading(false)
        })
    }, []);
    return (
        <Body title="公告设置" titleStyle={{color:"#fff"}} loading={pageLoading} headClassNames={head}>
            <Form form={form} onFinish={onFinish} className={body}>
                <Form.Item label="首页公告" name="notice.index" className={label}>
                    <TextArea placeholder='请输入首页滚动公告,不开启请留空'/>
                </Form.Item>
                <Form.Item label="商城公告" name="notice.shop" className={label}>
                    <TextArea placeholder='请输入商城滚动公告,不开启请留空'/>
                </Form.Item>
                <Form.Item label="后台公告" name="notice.admin" className={label}>
                    <TextArea placeholder='请输入后台滚动公告,不开启请留空'/>
                </Form.Item>
                <Form.Item className={btn}>
                    <Button fill="outline" size="mini" color='primary' onClick={()=>{
                        form.resetFields();
                    }}>重置</Button>
                    <Button type={"submit"} size="mini"   color='primary' loading={btnLoading} className={butt}>提交</Button>
                </Form.Item>
            </Form>
        </Body>
    )
}