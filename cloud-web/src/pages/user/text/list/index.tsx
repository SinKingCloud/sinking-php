import React, {useState} from "react";
import {Body, Title} from "@/components";
import {Card, Col, Drawer, List, Row} from "antd";
import {createStyles, useTheme} from "antd-style";

const useStyles = createStyles((): any => {
    return {
        card: {
            ".ant-card-body": {
                padding: 0
            }
        },
        li: {
            height: "40px",
            lineHeight: "20px",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between"
        },
    }
})
export default () => {
    const theme = useTheme()
    const {styles: {card, li,phone}} = useStyles()
    const [open, setOpen] = useState<any>(false)
    const data = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ];
    return (
        <Body breadCrumb={false}>
            <Row style={{display:"flex",justifyContent:"space-around"}}>
                <Col
                    xs={24} sm={24} md={24} lg={10} xl={10}  style={{
                    padding: "15px",
                    backgroundColor: theme.isDarkMode ? "rgb(20,20,20)" : "#fff",
                    borderRadius: "5px",
                    marginBottom:"10px"
                }}>
                    <div style={{margin: "0 0 10px 0", fontSize: "16px", fontWeight: "bold"}}>
                        <Title>文章列表</Title>
                    </div>
                    <Card title="最近发表" className={card} bordered={false}>
                        <ul style={{marginBottom: 0,paddingLeft:"15px"}}>
                            <li className={li}>
                                <span>fdsjfksjdfksjkfdfldsjfdksfskdfksdfk</span>
                                <span style={{color: "rgb(130,130,130)",marginRight:"5px"}}>2021-01-01</span>
                            </li>
                            <li className={li}>
                                <span>fdsjfksjdfksjkfdfldsjfdksfskdfksdfk</span>
                            </li>
                            <li className={li}>
                                <span>fdsjfksjdfksjkfdfldsjfdksfskdfksdfk</span>
                            </li>
                            <li className={li}>
                                <span>fdsjfksjdfksjkfdfldsjfdksfskdfksdfk</span>
                            </li>
                            <li className={li}>
                                <span>fdsjfksjdfksjkfdfldsjfdksfskdfksdfk</span>
                            </li>
                        </ul>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={13} xl={13} style={{
                    padding: "15px",
                    backgroundColor: theme.isDarkMode ? "rgb(20,20,20)" : "#fff",
                    borderRadius: "5px"
                }}>
                    <List
                        style={{cursor: "pointer"}}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item actions={[<a onClick={() => setOpen(true)}>查看</a>]}>
                                <List.Item.Meta
                                    title={<a>{item.title}</a>}
                                    description={
                                        <>
                                            <div>这是内容</div>
                                            <span>时间</span>
                                        </>
                                    }/>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
            <Drawer title={<Title>文章详情</Title>} placement="bottom" forceRender={true} height="100%"
                    onClose={() => setOpen(false)} open={open}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </Body>
    );
};