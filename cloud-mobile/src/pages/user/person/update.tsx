import React, {useEffect, useState} from 'react'
import {Body} from "@/components";
import {Form, Input, Toast, Button, ImageUploader} from "antd-mobile";
import {useModel} from "umi";
import {updateInfo} from "@/service/person/update";
import {createStyles} from "antd-style";
import {historyPush} from "@/utils/route";
import {uploadFile} from "@/service/common/upload";
import {ImageUploadItem} from "antd-mobile/es/components/image-uploader";

const useStyles = createStyles(({token, isDarkMode, css}): any => {
    const border = isDarkMode ? "1px solid rgb(40,40,40) !important" : "1px solid #eeeeee !important"
    return {
        label: css`
            .adm-list-item-content-prefix {
                font-size: 12px !important;
                width: 65px
            }
        ,
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
        }
        `,
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
                paddingRight: "12px"
            },
            ".adm-input-element": {
                fontSize: "12px !important"
            },
        },
        butt: {
            "--background-color": token.colorPrimary,
            "--border-color": token.colorPrimary,
            fontWeight: 600,
            letterSpacing: "1px"
        }
    }
})
export default () => {
    const {styles: {label, btn, body, butt}} = useStyles()
    const [form] = Form.useForm()
    const user = useModel("user")
    /**
     * 上传头像
     */
    const [files, setFiles] = useState<ImageUploadItem[]>([
        {
            url: user?.web?.avatar || ""
        }
    ]);
    const mockUpload = async (file: File) => {
        if (file.size > 1024 * 1024 * 10) {
            Toast.show('请选择小于 10M 的图片')
            return null
        }
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadFile(formData);
        if (res?.code != 200) {
            return undefined
        }
        setFiles([{url: res?.data}]);
        return {url: res?.data}
    }
    /**
     * 表单提交
     */
    const [btnLoading, setBtnLoading] = useState(false)
    const formFinish = async (values: any) => {
        if (values?.nick_name == undefined || values?.nick_name == "") {
            Toast.show({
                content: "请输入昵称",
                position: 'top',
            })
            return
        }
        if (values?.contact == undefined || values?.contact == "") {
            Toast.show({
                content: "请输入联系方式",
                position: 'top',
            })
            return
        }
        delete values?.avatar
        if (files?.length > 0) {
            values.avatar = files[0]?.url || "";
        }
        setBtnLoading(true)
        await updateInfo({
            body: {
                ...values,
            },
            onSuccess: (r: any) => {
                Toast.show({
                    content: r?.message,
                    position: 'top',
                })
                user?.refreshWebUser()
                historyPush("user.person")
            },
            onFail: (r: any) => {
                Toast.show({
                    content: r?.message || "修改失败",
                    position: 'top',
                })
            },
            onFinally: () => {
                setBtnLoading(false)
            }
        })
    }
    return (
        <Body title="修改资料" space={true}>
            <Form form={form} initialValues={{
                contact: user?.web?.contact || "未设置",
                nick_name: user?.web?.nick_name || "未设置",
                login_time: user?.web?.login_time,
                account: user?.web?.account
            }} onFinish={formFinish} className={body}>
                <Form.Item name="account" label="账号" className={label}>
                    <Input placeholder="请输入账号" clearable disabled={user?.web?.account}/>
                </Form.Item>
                <Form.Item name="contact" label="联系方式" className={label}>
                    <Input placeholder="请输入联系方式" clearable/>
                </Form.Item>
                <Form.Item name="nick_name" label="昵称" className={label}>
                    <Input placeholder="请输入账户名称" clearable/>
                </Form.Item>
                <Form.Item name="avatar" label="头像" className={label} initialValue={files}>
                    <ImageUploader
                        value={files}
                        maxCount="1"
                        upload={mockUpload as any}
                    />
                </Form.Item>
                <Form.Item name="login_time" label="登录时间" className={label}>
                    <Input disabled={true}/>
                </Form.Item>
                <Form.Item className={btn}>
                    <Button type="submit" block color={"primary"} loading={btnLoading} className={butt}>保存</Button>
                </Form.Item>
            </Form>
        </Body>
    )
}