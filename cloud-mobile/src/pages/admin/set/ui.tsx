import {Body} from "@/components";
import {createStyles} from "antd-style";
import React, {useEffect, useState} from "react";
import {Button, Form, ImageUploader, Selector, Toast} from "antd-mobile";
import {useModel} from "umi";
import {getUi, setUi} from "@/service/admin/set";
import {ColorPicker} from "antd";
import {NamePath} from "rc-field-form/es/interface";
import {ImageUploadItem} from "antd-mobile/es/components/image-uploader";
import {uploadFile} from "@/service/common/upload";
const useStyles = createStyles(({token}):any=>{
    return{
        head:{
            backgroundColor:`${token.colorPrimary} !important`,
            color:"#fff"
        },
        sel:{
            "--padding":"6px 10px !important",
            fontSize:"12px"
        },
        btn1:{
            marginLeft:"10px"
        },
        btn: {
            ".adm-list-item-content": {
                borderBottom: "none !important",
                borderTop: "none !important",
                paddingBlock: "9px",
                paddingRight: "0 !important"
            },
        },
        body: {
            ".adm-list-body": {
                borderRadius: "5px",
                borderTop: "none !important",
                borderBottom: "none !important",
            },
            ".adm-list-item": {
                paddingRight: "12px !important"
            },
        },
    }
});
export default ()=>{
    const {styles:{head,sel,btn,btn1,body}} = useStyles();
    const [isLoading, setIsLoading] = useState(true);
    const [form] = Form.useForm();
    const web = useModel("web")
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        return await getUi({
            onSuccess: (r: any) => {
                form.setFieldsValue(r?.data);
                // setLogo([{url:r?.data["ui.logo"]}])
            },
            onFail: (r: any) => {
                Toast?.show({
                    content: r?.message || "请求失败",
                    position: "top"
                });
            },
        });
    };
    /**
     * 上传头像
     */
    const [logo,setLogo] = useState()
    const mockUpload = async (file: File) => {
        if (file.size > 1024 * 1024 * 10) {
            Toast.show('请选择小于 10M 的图片');
            return null
        }
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadFile(formData);
        setLogo(res?.data)
        if (res?.code != 200) {
            return undefined
        }
        return {url: res?.data}
    }
    /**
     * 提交数据
     * @param values
     */
    const [btnLoading,setBtnLoading] = useState(false);
    const [index,setIndex] = useState<any>()
    const [compact,setCompact] = useState<any>()
    const [layout,setLayout] = useState<any>()
    const [theme,setTheme] = useState<any>()
    const [watermark,setWatermark] = useState<any>()
    const onFinish = async (values: any) => {
        if(!values["ui.index"]){
            Toast?.show({
                content:"请选择首页模板",
                position:"top"
            });
            return
        }
        if(!values["ui.compact"]){
            Toast?.show({
                content:"请选择紧凑模式是否开启",
                position:"top"
            });
            return
        }
        if(!values["ui.layout"]){
            Toast?.show({
                content:"请选择网站布局",
                position:"top"
            });
            return
        }
        if(!values["ui.theme"]){
            Toast?.show({
                content:"请选择菜单主题",
                position:"top"
            });
            return
        }
        if(!values["ui.watermark"]){
            Toast?.show({
                content:"请选择是否打开界面水印",
                position:"top"
            });
            return
        }
        const updatedValues = {
            ...values,
            "ui.index": index,
            "ui.compact": compact,
            "ui.layout": layout,
            "ui.theme": theme,
            "ui.watermark": watermark,
            "ui.logo": logo,
        };
        setBtnLoading(true)
        await setUi({
            body: updatedValues,
            onSuccess: (r: any) => {
                Toast?.show({
                    content:r?.message,
                    position:"top"
                })
                web?.refreshInfo();
            },
            onFail: (r: any) => {
                Toast?.show({
                    content:r?.message || "修改失败",
                    position:"top"
                })
            },
            onFinally:()=>{
                setBtnLoading(false)
            }
        });
    };
    useEffect(() => {
        setIsLoading(true)
        getConfigs().finally(()=>{
            setIsLoading(false)
        });
    }, []);
    return(
        <Body title="界面设置" loading={isLoading} titleStyle={{color:"#fff"}} headClassNames={head}>
            <Form form={form}  onFinish={onFinish} className={body}>
                <Form.Item label="首页模板" name="ui.index" >
                    <Selector
                        className={sel}
                        options={[
                            {
                                label:"默认首页",
                                value:"index"
                            },
                            {
                                label:"直接跳转(屏蔽seo)",
                                value:"location"
                            }
                        ]}
                        onChange={(value) => {
                            setIndex(value[0])
                        }}
                    />
                </Form.Item>
                <Form.Item label="紧凑模式" name="ui.compact" >
                    <Selector
                        className={sel}
                        options={[
                            {
                                label:"关闭",
                                value:0
                            },
                            {
                                label:"开启",
                                value:1
                            }
                        ]}
                        onChange={(value) => {
                            setCompact(value[0])
                        }}
                    />
                </Form.Item>
                <Form.Item label="网站布局" name="ui.layout" >
                    <Selector
                        className={sel}
                        options={[
                            {
                                label:"上下布局",
                                value:'top'
                            },
                            {
                                label:"左右布局",
                                value:'left'
                            }
                        ]}
                        onChange={(value) => {
                            setLayout(value[0])
                        }}
                    />
                </Form.Item>
                <Form.Item label="菜单主题" name="ui.theme">
                    <Selector
                        className={sel}
                        options={[
                            {
                                label:"亮色模式",
                                value:'light'
                            },
                            {
                                label:"暗色模式",
                                value:'dark'
                            }
                        ]}
                        onChange={(value) => {
                            setTheme(value[0])
                        }}
                    />
                </Form.Item>
                <Form.Item label="界面水印" name="ui.watermark" >
                    <Selector
                        className={sel}
                        options={[
                            {
                                label:"关闭",
                                value:'0'
                            },
                            {
                                label:"开启",
                                value:'1'
                            }
                        ]}
                        onChange={(value) => {
                            setWatermark(value[0])
                        }}
                    />
                </Form.Item>
                <Form.Item label="主题颜色" name="ui.color" >
                    <ColorPicker
                        format="rgb"
                        defaultFormat="rgb"
                        onChange={(color) => {
                            form?.setFieldValue("ui.color" as NamePath, color?.toRgbString());
                        }}
                    />
                </Form.Item>
                <Form.Item  label="网站LOGO" >
                    <ImageUploader
                        // value={logo}
                        maxCount="1"
                        // onChange={setLogo}
                        upload={mockUpload as any}
                    />
                </Form.Item>
                <Form.Item className={btn}>
                    <Button fill="outline" size="mini" color='primary' onClick={()=>{
                        form.resetFields();
                    }}>重置</Button>
                    <Button type="submit" size="mini" loading={btnLoading} className={btn1}  color='primary'>提交</Button>
                </Form.Item>
            </Form>
        </Body>
    )
}