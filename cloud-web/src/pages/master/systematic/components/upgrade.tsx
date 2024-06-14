import React, {useEffect, useState} from 'react';
import {getUpgradeList, systemUpgrade} from "@/service/master/config";
import {Alert, App, Button, Result, Spin, Tag, Timeline} from "antd";
import {history} from "umi";
const UpgradeView: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {message} = App.useApp()
    const [versionInfo, setVersionInfo] = useState<any>({});
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        setIsLoading(true);
         await getUpgradeList({
            onSuccess:(r:any)=>{
                    setVersionInfo(r?.data)
            },
            onFail:(r:any)=>{
                    setVersionInfo({})
            },
             onFinally:()=>{
                 setIsLoading(false)
             }
        });
    }
    /**
     * 初始化数据
     */
    useEffect(() => {
        getConfigs()
    }, []);

    const [updateBtnLoading, setUpdateBtnLoading] = useState(false);

    return (
        <Spin spinning={isLoading} size="default">
            <div style={{display: isLoading ? 'none' : 'block'}}>
                {!versionInfo?.is_upgrade && <Result
                    status="success"
                    title="当前系统已是最新版本,无需更新"
                    subTitle={"当前系统版本:" + versionInfo?.local?.name + ",内部版本号:" + versionInfo?.local?.number}
                    extra={[
                        <Button type="primary" key="site" onClick={() => {
                            window.open("https://www.clwl.online");
                        }}>
                            官网
                        </Button>,
                        <Button key="back" onClick={() => {
                            history.goBack();
                        }}>返回</Button>,
                    ]}
                />}
                {versionInfo?.is_upgrade && <>
                    <Result
                        title="检测到系统更新,请及时更新系统"
                        subTitle={"最新版本:" + versionInfo?.cloud?.[0]?.version + ",内部版本号:" + versionInfo?.cloud?.[0]?.version_number}
                        extra={[
                            <Button type="primary" key="update" onClick={async () => {
                                setUpdateBtnLoading(true);
                                await systemUpgrade({
                                    onSuccess: (r: any) => {
                                        setUpdateBtnLoading(false);
                                        if (r?.code == 200) {
                                            message?.success("系统升级成功").then(() => {
                                                window.location.reload();
                                            });
                                        }
                                    },
                                    onFail:(r:any)=>{
                                        if(r?.code != 200){
                                            message.error(r?.message || "请求错误")
                                        }
                                    }
                                })
                            }} loading={updateBtnLoading} disabled={updateBtnLoading}>
                                立即更新
                            </Button>,
                        ]}
                    />
                    <div
                        style={{
                            padding: "20px",
                            borderRadius: "10px",
                            maxWidth: "450px",
                            margin: "0 auto",
                            backgroundColor: "#e7e7e7"
                        }}>
                        <div style={{fontWeight: "bolder", fontSize: "15px", marginBottom: "20px"}}>更新内容</div>
                        <Timeline>
                            {versionInfo?.cloud?.map((item: any) => {
                                return <Timeline.Item key={item?.id}>
                                    <div>
                  <span style={{fontWeight: "bolder", color: "#676767"}}>
                    {item?.create_time}
                  </span>
                                        &nbsp;&nbsp;&nbsp;
                                        <Tag>{item?.version}</Tag>
                                    </div>
                                    <div style={{fontSize: "10px", marginTop: "7px"}} dangerouslySetInnerHTML={{
                                        __html: item?.content,
                                    }}>
                                    </div>
                                </Timeline.Item>
                            })}
                        </Timeline>
                        <Alert message="为防止出现bug及漏洞,请及时更新系统" type="info" showIcon/>
                    </div>
                </>}
            </div>
        </Spin>
    );
};
export default UpgradeView;
