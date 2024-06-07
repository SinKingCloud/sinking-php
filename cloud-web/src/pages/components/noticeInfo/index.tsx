import React, {useState} from "react";
import {Modal, Skeleton, Spin} from "antd";
import {getNoticeInfo} from "@/service/person/notice";
import {ClockCircleOutlined, EyeOutlined, UserOutlined} from "@ant-design/icons";
import {ago} from "@/utils/time";

export type NoticeInfoProps = {
    id?: number;
    open?: boolean;
    onClose?: (value?: any) => void;
};

const NoticeInfo: React.FC<NoticeInfoProps> = (props) => {
    const {id, open, onClose} = props;
    const [noticeId, setNoticeId] = useState(id);
    const [loading, setLoading] = useState(false);
    const [noticeData, setNoticeData] = useState<any>({});
    const handleCancel = () => {
        onClose?.(noticeData);
    };
    const getNoticeData = (id:any) => {
        if ((id || 0) > 0) {
            setLoading(true);
            getNoticeInfo({
                body:{
                    id: id
                },
                onSuccess: (r:any) => {
                    if (r?.code == 200) {
                        setNoticeData(r?.data);
                    }
                    setLoading(false);
                },
            });
        }
    };
    if ((id || 0) > 0 && id != noticeId) {
        setNoticeId(id);
        getNoticeData(id || 0);
    }
    return (
        <>
            <Modal  footer={null} width={550} onCancel={handleCancel} open={open}>
                <Spin spinning={loading}>
                    <Skeleton title={false} loading={loading} active>
                        <div style={{margin: "10px"}}>
                            <div style={{
                                textAlign: "center",
                                fontSize: "20px",
                                fontWeight: "bolder",
                                color: "#545454"
                            }}>{noticeData?.title}</div>
                            <div style={{textAlign: "center", fontSize: "13px", color: "#8d8d8d", margin: "10px 0"}}>
                                <UserOutlined/> 管理员&nbsp;&nbsp;&nbsp;
                                <ClockCircleOutlined/> {ago(noticeData?.create_time || '0000-00-00 00:00:00')}&nbsp;&nbsp;&nbsp;
                                <EyeOutlined/> {noticeData?.look_num || 0}次
                            </div>
                            <div style={{margin: "10px 0"}} dangerouslySetInnerHTML={{__html: noticeData?.content || ""}}/>
                        </div>
                    </Skeleton>
                </Spin>
            </Modal>
        </>
    );
};


export default NoticeInfo;
