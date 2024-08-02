import React, {useEffect, useState} from 'react'
import {Body} from "@/components";
import {createStyles} from "antd-style";
import {Button, Form, Input, Toast} from "antd-mobile";
import {getMy, getWeb, setWeb} from "@/service/admin/price";
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
            ".adm-list-item": {
                paddingRight: "12px"
            },
            ".adm-input-element": {
                fontSize: "12px !important"
            },
        },
        butt:{
            "--background-color": token.colorPrimary,
            "--border-color": token.colorPrimary,
            fontWeight: 600,
            letterSpacing:"1px"
        },
    }
});
export default () => {
    const {styles:{head,body,label,btn,butt}} = useStyles();
    const [form] = Form.useForm();
    const [myPrice, setMyPrice] = useState({});
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        return await getWeb({
            onSuccess: (r: any) => {
                form.setFieldsValue(r?.data);
            },
            onFail: (r: any) => {
                r?.error(r?.message || "请求失败");
            },
        });
    };
    /**
     * 获取成本价格
     */
    const getMyPrice = async () => {
        return await getMy({
            onSuccess: (r: any) => {
                setMyPrice(r?.data);
            },
            onFail: (r: any) => {
                r?.error(r?.message || "请求失败");
            },
        });
    };
    /**
     * 表单提交
     */
    const [loading,setLoading] = useState(false);
    const formFinish = async (values:any)=>{
        if(values?.site.price == '' || values?.site.price == undefined){
            Toast.show({
                content:"请输入分站开通价格",
                position:"top"
            });
            return
        }
        setLoading(true);
        await setWeb({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                Toast?.show({
                    content:r?.message || "修改成功",
                    position:"top"
                });
            },
            onFail: (r: any) => {
                Toast?.show({
                    content:r?.message || "修改失败",
                    position:"top"
                });
            },
            onFinally:()=>{
                setLoading(false);
            }
        });
    };
    const [pageLoading,setPageLoading] = useState(true);
    useEffect(() => {
        setPageLoading(true);
        getConfigs().finally(()=>{
            getMyPrice().finally(()=>{
                setPageLoading(false);
            });
        });
    }, []);
    return (
        <Body title="分站价格" titleStyle={{color:"#fff"}} headClassNames={head} loading={pageLoading}>
                <Form form={form} onFinish={formFinish} className={body}>
                    <Form.Item name="site.price" className={label} label={"开通价格,成本:" + (myPrice['site.cost.price'] || 0) + "元/" + (myPrice['site.month'] || 0) + "月,最低售价:" + (myPrice['site.min.price'] || 0) + "元/" + (myPrice['site.month'] || 0) + "月"}>
                        <Input placeholder={"请输入用户开通分站价格"}/>
                    </Form.Item>
                    <Form.Item className={btn}>
                        <Button type={"submit"} block color='primary' loading={loading} className={butt}>提交</Button>
                    </Form.Item>
                </Form>
        </Body>
    )
}