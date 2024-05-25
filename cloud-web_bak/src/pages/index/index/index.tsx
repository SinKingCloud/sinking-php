import type {FC} from 'react';
import {Avatar, Card, Col, Skeleton, Row, Statistic, Alert, Button, List} from 'antd';

import {Link} from 'umi';
import {PageContainer} from '@ant-design/pro-layout';
import styles from './style.less';

// @ts-ignore
import Marquee from 'react-fast-marquee';
import React, {useEffect, useState} from "react";
import {useModel} from "@@/plugin-model/useModel";
import ProCard from "@ant-design/pro-card";
import {NotificationOutlined, PlusOutlined, QqOutlined} from "@ant-design/icons";
import {getNoticeList} from "@/services/person/notice";
import {ago} from "@/util/time";
import {getContact, getNotice} from "@/services/person/config";
import NoticeInfo from "@/components/Other/NoticeInfo";

const PageHeaderContent: FC<{ currentUser: Partial<any> }> = ({currentUser}) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{rows: 1}} active/>;
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser?.avatar}/>
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          你好，
          {currentUser?.nick_name}！
        </div>
        <div style={{maxWidth: "450px"}}>
          尊敬的 <b>{currentUser?.nick_name}</b> ,欢迎回来，我们已等候多时！
        </div>
      </div>
    </div>
  );
};

const ExtraContent: FC<{ currentUser: Partial<any> }> = ({currentUser}) => (
  <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="余额" prefix={"￥"} value={parseFloat(currentUser?.money || 0).toFixed(2)}/>
    </div>
    <div className={styles.statItem}>
      <Statistic title="身份" value={currentUser?.is_master ? '管理员' : (currentUser?.is_admin ? '站长' : '会员')}/>
    </div>
  </div>
);

export default (): React.ReactNode => {
  const {initialState, setInitialState} = useModel('@@initialState');
  // @ts-ignore
  const {currentUser} = initialState;
  /**
   * 获取当前用户信息
   */
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  const [userLoading, setUserLoading] = useState(false);
  const getUserData = () => {
    setUserLoading(true);
    fetchUserInfo().then(() => {
      setUserLoading(false)
    });
  };
  /**
   * 获取公告信息
   */
  const [noticeLoading, setNoticeLoading] = useState(true);
  const [noticeData, setNoticeData] = useState<any>([]);
  const getNoticeData = async () => {
    setNoticeLoading(true);
    const temp: any[] = [];
    let d = await getNoticeList({page: 1, page_size: 3, web_id: 'system', place: "index"});
    if (d?.code == 200) {
      d?.data?.list?.map((k: any) => {
        temp?.push(k);
      });
    }
    d = await getNoticeList({page: 1, page_size: 5, web_id: 'my', place: "index"});
    if (d?.code == 200) {
      d?.data?.list?.map((k: any) => {
        temp?.push(k);
      });
    }
    setNoticeData(temp);
    setNoticeLoading(false);
  };
  /**
   * 滚动公告信息
   */
  const [notice2Loading, setNotice2Loading] = useState(true);
  const [notice2Data, setNotice2Data] = useState({});
  const getNotice2Data = () => {
    setNotice2Loading(true);
    getNotice().then((r) => {
      setNotice2Loading(false);
      if (r?.code == 200) {
        setNotice2Data(r?.data);
      }
    })
  };
  /**
   * 客服信息
   */
  const [contactLoading, setContactLoading] = useState(true);
  const [contactData, setContactData] = useState({});
  const getContactData = () => {
    setContactLoading(true);
    getContact().then((r) => {
      setContactLoading(false);
      if (r?.code == 200) {
        setContactData(r?.data);
      }
    })
  };
  /**
   * 查看公告
   */
  const [noticeId, setNoticeId] = useState(0);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const showNoticeInfoModal = (id: number) => {
    setNoticeId(id);
    setNoticeVisible(true);
  }
  const hideNoticeInfoModal = () => {
    setNoticeId(0);
    setNoticeVisible(false);
  }
  /**
   * 初始化数据
   */
  useEffect(() => {
    getNoticeData();
    getUserData();
    getNotice2Data();
    getContactData();
  }, []);
  return (
    <PageContainer title={false}>
      <NoticeInfo id={noticeId} visible={noticeVisible} onClose={hideNoticeInfoModal}/>
      <Row gutter={24}>
        <Skeleton title={false} loading={notice2Loading} active>
          <Col xl={24} md={24} hidden={notice2Data?.['notice.index'] == "" || notice2Data?.['notice.index'] == null}>
            <Alert
              style={{margin: "-10px 0 15px 0"}}
              banner
              type={"info"}
              message={
                <Marquee pauseOnHover gradient={false}>
                  {notice2Data?.['notice.index']}
                </Marquee>
              }
            />
          </Col>
        </Skeleton>
        <Col xl={24} md={24}>
          <Card style={{marginBottom: "20px"}} loading={userLoading}>
            <Row gutter={24}>
              <Col>
                <PageHeaderContent
                  currentUser={currentUser}
                />
              </Col>
              <Col style={{margin: "10px auto 0 auto"}}>
                <ExtraContent currentUser={currentUser}/>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <ProCard
                className={styles.projectList}
                headerBordered
                style={{marginBottom: 24}}
                title="我的数据"
                bordered={false}
                extra={<Link to="/">查看全部</Link>}
                loading={false}
                bodyStyle={{padding: 0}}
              >

                <Card.Grid className={styles.projectGrid} style={{padding: "0px"}}>
                  <Card bodyStyle={{padding: 0}} bordered={false}>
                    <Button type="dashed" className={styles.newButton}>
                      <PlusOutlined/> 立即添加
                    </Button>
                  </Card>
                </Card.Grid>
              </ProCard>
            </Col>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <ProCard
                className={styles.projectList}
                headerBordered
                style={{marginBottom: 24}}
                bordered={false}
                loading={contactLoading}
                bodyStyle={{padding: 0}}
              >
                <Row>
                  <Col xl={8} lg={8} md={8} sm={24} xs={24} className={styles.contact}
                       hidden={contactData?.['contact.one'] == ''}>
                    <div>
                      <div className={styles.avatar}>
                        <Avatar
                          src={"https://q4.qlogo.cn/headimg_dl?dst_uin=" + (contactData?.['contact.one'] || 10000) + "&spec=100"}
                          size="large" shape="square" style={{borderRadius: "5px"}}/>
                      </div>
                      <div className={styles.info}>
                        <div><span className={styles.text}>官方客服</span></div>
                        <div><span className={styles.uin}>QQ:{contactData?.['contact.one']}</span></div>
                      </div>
                      <div className={styles.btn}>
                        <Button size={"small"} type="primary" ghost onClick={() => {
                          window.open("https://wpa.qq.com/wpa_jump_page?v=3&uin=" + contactData?.['contact.one'] + "&site=qq&menu=yes");
                        }}>联系</Button>
                      </div>
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={24} xs={24} className={styles.contact}
                       hidden={contactData?.['contact.two'] == ''}>
                    <div>
                      <div className={styles.avatar}>
                        <Avatar
                          src={"https://q4.qlogo.cn/headimg_dl?dst_uin=" + (contactData?.['contact.two'] || 10000) + "&spec=100"}
                          size="large" shape="square" style={{borderRadius: "5px"}}/>
                      </div>
                      <div className={styles.info}>
                        <div><span className={styles.text}>官方客服</span></div>
                        <div><span className={styles.uin}>QQ:{contactData?.['contact.two']}</span></div>
                      </div>
                      <div className={styles.btn}>
                        <Button size={"small"} type="primary" ghost onClick={() => {
                          window.open("https://wpa.qq.com/wpa_jump_page?v=3&uin=" + contactData?.['contact.two'] + "&site=qq&menu=yes");
                        }}>联系</Button>
                      </div>
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={24} xs={24} className={styles.contact}
                       hidden={contactData?.['contact.three'] == '' || contactData?.['contact.four'] == ''}>
                    <div>
                      <div className={styles.avatar}>
                        <Avatar
                          src={"https://p.qlogo.cn/gh/" + (contactData?.['contact.three'] || 10000) + "/" + (contactData?.['contact.three'] || 1000) + "/100"}
                          size="large" shape="square" style={{borderRadius: "5px"}}/>
                      </div>
                      <div className={styles.info}>
                        <div><span className={styles.text}>官方Q群</span></div>
                        <div><span className={styles.uin}>群号:{contactData?.['contact.three']}</span></div>
                      </div>
                      <div className={styles.btn}>
                        <Button size={"small"} type="primary" ghost onClick={() => {
                          window.open(contactData?.['contact.four']);
                        }}>加入</Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </ProCard>
            </Col>
          </Row>
        </Col>
        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
          <ProCard
            style={{marginBottom: 24}}
            headerBordered
            title="系统公告"
            loading={noticeLoading}
            bodyStyle={{padding: "0 20px 0 20px"}}
          >
            <List
              loading={noticeLoading}
              itemLayout="horizontal"
              dataSource={noticeData}
              renderItem={(item: any) => (
                <Skeleton avatar title={false} loading={noticeLoading} active>
                  <List.Item
                    actions={[<a key="list-loadmore-edit" onClick={() => {
                      showNoticeInfoModal(item?.id || 0);
                    }}>查看</a>]}
                  >

                    <List.Item.Meta
                      key={"notice-" + item?.id}
                      avatar={<NotificationOutlined style={{fontSize: "20px", lineHeight: "50px"}}/>}
                      title={item?.title}
                      description={<span
                        style={{fontSize: "10px"}}>发布于 {ago(item?.create_time)} ,共 {item?.look_num} 次浏览</span>}
                    />

                  </List.Item>

                </Skeleton>
              )}
            />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

