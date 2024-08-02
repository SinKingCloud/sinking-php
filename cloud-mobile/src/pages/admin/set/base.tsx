import React, {useEffect, useRef, useState} from 'react'
import {Body, VirtualRef} from "@/components";
import {createStyles} from "antd-style";
import {Button, Form, Input, Modal, ModalShowProps, TextArea, Toast} from "antd-mobile";
import {getWeb, setWeb} from "@/service/admin/set";
import {useModel} from "umi";
import {getMy} from "@/service/admin/price";
import {ExclamationCircleFill} from "antd-mobile-icons";
import {buySite} from "@/service/admin/web";
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
            line-height: 1 !important;
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
        inner:{
            ".adm-form-item-child-inner":{
                display:"flex"
            },
            ".adm-list-item-content":{
                width:"100%"
            },
        },
        inp:{
            ".adm-input":{
                width:"80% !important"
            },
            display:"flex"
        },
        modals: {
            ".adm-center-popup-wrap": {
                minWidth: "354px !important",
            }
        },
        war:{
            fontSize: "26px",
            color: 'var(--adm-color-warning)',
        },
        sp1:{
            textAlign:"center",
            fontSize:"13px",
            margin:"0 0 20px 0!important",
        },
        box:{
            display:"flex",
            justifyContent:"flex-end"
        },
        lef:{
            marginLeft:"10px"
        }
    }
});
export default () => {
    const {styles:{head,body,label,btn,butt,inner,inp,modals,war,sp1,box,lef}} = useStyles();
    const [form] = Form.useForm();
    const web = useModel("web");
    const modalShow = useRef<any>();
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        return await getWeb({
            onSuccess: (r: any) => {
                form.setFieldsValue(r?.data);
            },
            onFail: (r: any) => {
                Toast?.show({
                    content: r?.message || "请求失败",
                    position:"top"
                });
            },
        });
    };

    /**
     * 表单提交
     */
    const [loading,setLoading] = useState(false);
    const formFinish = async (values:any)=>{
        if(values?.name =="" || values?.name == undefined){
            Toast?.show({
                content:"网站名称不能为空",
                position:"top"
            });
            return
        }
        if(values?.title =="" || values?.title == undefined){
            Toast?.show({
                content:"网站标题不能为空",
                position:"top"
            });
            return
        }
        if(values?.keywords =="" || values?.keywords == undefined){
            Toast?.show({
                content:"网站关键词不能为空",
                position:"top"
            });
            return
        }
        if(values?.description =="" || values?.description == undefined){
            Toast?.show({
                content:"网站描述不能为空",
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
                    content: r?.message,
                    position:"top"
                });
                web?.refreshInfo();
            },
            onFail: (r: any) => {
                Toast?.show({
                    content: r?.message || "请求失败",
                    position:"top"
                });
            },
            onFinally:()=>{
                setLoading(false);
            }
        });
    };
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
                });
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
    const [btnLoading,setBtnLoading] = useState(false);
    return (
        <Body title="基本设置" titleStyle={{color:"#fff"}} loading={pageLoading} headClassNames={head}>
                <Form form={form} onFinish={formFinish} className={body}>
                    <Form.Item label="网站名称" name="name" className={label} >
                        <Input placeholder="请输入网站名称" clearable />
                    </Form.Item>
                    <Form.Item label="网站标题" name="title" className={label} >
                        <Input placeholder="请输入网站标题" clearable />
                    </Form.Item>
                    <Form.Item label="网站关键词" name="keywords" className={label} >
                        <Input placeholder='请输入网站关键词' clearable />
                    </Form.Item>
                    <Form.Item label="网站描述" name="description" className={label}>
                        <TextArea placeholder='请输入网站描述'/>
                    </Form.Item>
                    <Form.Item label="到期时间"  className={inner + " " + inp} >
                        <Form.Item noStyle className={label}>
                            <Input disabled={true}  value={web?.info?.expire_time}/>
                        </Form.Item>
                       <Form.Item noStyle>
                           <Button  fill="outline" size="mini" color='primary' onClick={()=>{
                               modalShow.current = Modal?.show({
                                   header: (
                                       <ExclamationCircleFill className={war}/>
                                   ),
                                   forceRender: true,
                                   getContainer: VirtualRef?.current,
                                   className: modals,
                                   title:"确定要续费站点到期时间吗？",
                                   content: (
                                       <>
                                           <p className={sp1}>{"将会花费" + (myPrice?.['site.cost.price'] || 0) + '元续期' + (myPrice?.['site.month'] || 0) + '个月网站时长'}</p>
                                            <div className={box}>
                                                <Button size="mini" fill="outline" color="primary" onClick={()=>{
                                                    modalShow?.current?.close()
                                                }}>取消</Button>
                                                <Button size="mini" color='primary' loading={btnLoading} className={lef} onClick={async()=>{
                                                    setBtnLoading(true);
                                                    try {
                                                        await buySite({
                                                            onSuccess: (r: any) => {
                                                                Toast?.show({
                                                                    content:r?.message,
                                                                    position:"top"
                                                                })
                                                                web?.refreshInfo();
                                                                modalShow?.current?.close();
                                                            },
                                                            onFail: (r: any) => {
                                                                Toast?.show({
                                                                    content:r?.message || "续期失败",
                                                                    position:"top"
                                                                })
                                                            },
                                                            onFinally: () => {
                                                                setBtnLoading(false);
                                                            }
                                                        });
                                                    }finally {
                                                        setBtnLoading(false);
                                                    }

                                                }}>确定</Button>
                                            </div>
                                       </>
                                   )
                               } as ModalShowProps)
                           }}>续期</Button>
                       </Form.Item>
                    </Form.Item>
                    <Form.Item className={btn}>
                        <Button fill="outline" size="mini" color='primary' onClick={()=>{
                            form.resetFields();
                        }}>重置</Button>
                        <Button type={"submit"} size="mini"   color='primary' loading={loading} className={butt}>提交</Button>
                    </Form.Item>
                </Form>
        </Body>
    )
}