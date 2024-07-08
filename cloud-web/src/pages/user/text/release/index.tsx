import React from "react";
import {Body, Title} from "@/components";
import {Button, Card, Col,  Form, Input, Row} from "antd";
import BraftEditor from "braft-editor";
import {uploadFile} from "@/service/common/upload";
import {createStyles, useTheme} from "antd-style";
const useStyles = createStyles(()=>{
    return{
        label:{
            ".ant-form-item .ant-form-item-label >label":{
                fontSize:"14px"
            }
        }
    }
})
export default () => {
    const [form] = Form.useForm()
    const [subForm] = Form.useForm()
    const { styles:{label} } = useStyles();
    const theme = useTheme()
    const onFormFinish = (values: any) => {
        console.log(values);
    };
    return (
        <Body  breadCrumb={false}>
            <Row style={{display:"flex",justifyContent:"space-around"}}>
                <Col span={15} style={{padding:"15px",backgroundColor:theme.isDarkMode?"rgb(20,20,20)":"#fff",borderRadius:"5px"}}>
                    <div style={{margin:"0 0 10px 0",fontSize:"16px",fontWeight:"bold"}}>
                        <Title>发布文章</Title>
                    </div>
                    <Form form={form} className={label} layout={"vertical"} onFinish={onFormFinish} labelAlign="right">
                        <Form.Item name="title" label="标题" rules={[{required: true}]}>
                            <Input placeholder="请输入标题" />
                        </Form.Item>
                        <Form.Item name="content" label="输入内容" rules={[{required: true}]}>
                            <BraftEditor
                                media={{
                                    uploadFn: async (param) => {
                                        const formData = new FormData();
                                        formData.append('file', param.file);
                                        const res = await uploadFile(formData);
                                        if (res?.code == 200) {
                                            param.success({
                                                meta: {
                                                    alt: param?.file?.name || "",
                                                    autoPlay: false,
                                                    controls: false,
                                                    id: res?.data || "",
                                                    loop: false,
                                                    poster: param?.file?.name || "",
                                                    title: param?.file?.name || ""
                                                }, url: res?.data || ""
                                            });
                                        } else {
                                            param.error({msg: "上传文件失败"});
                                        }
                                    }
                                }}
                                className="my-editor"
                                style={{border: theme.isDarkMode ?"1px solid rgb(70,70,70)" : "1px solid #d1d1d1", borderRadius: "5px"}}
                                placeholder="请输入文章内容"
                            />
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={8} style={{padding:"15px",backgroundColor:theme.isDarkMode?"rgb(20,20,20)":"#fff",borderRadius:"5px"}}>
                    <Card title={<Title>其他信息</Title>} bordered={false}>
                        <Form layout={"vertical"} form={subForm}>
                            <Form.Item label="浏览量">
                                <Input defaultValue="0"/>
                            </Form.Item>
                            <Form.Item label="自定义文本">
                                <Input />
                            </Form.Item>
                            <Form.Item style={{textAlign: "center"}}>
                                <Button type="primary" htmlType="submit">
                                    立即发布
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Body>
    );
}