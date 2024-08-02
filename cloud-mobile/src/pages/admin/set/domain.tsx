import React, {useEffect, useRef, useState} from 'react'
import {Body, Title, VirtualRef} from "@/components";
import {createStyles} from "antd-style";
import { deleteDomain, getDomainConfig, getDomainList, updateDomain} from "@/service/admin/web";
import {
    Card,
    ErrorBlock,
    Button,
    ActionSheet,
    Form,
    Input,
    Modal,
    NoticeBar,
    Selector,
    Popup,
    Toast, ModalShowProps
} from "antd-mobile";
import {Typography} from "antd";
import {ExclamationCircleFill} from "antd-mobile-icons";
const useStyles = createStyles(({token,css,isDarkMode}):any => {
    const border = isDarkMode ? "1px solid rgb(40,40,40) !important" : "1px solid #eeeeee !important"
    return {
        head:{
            backgroundColor:`${token.colorPrimary} !important`,
            color:"#fff"
        },
        extra: {
            fontSize: "12px", color: "gray"
        },
        par:{
            marginBottom:"-22px !important"
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
        modals: {
            ".adm-center-popup-wrap": {
                minWidth: "354px !important",
                top:"250px !important"
            }
        },
        sel:{
            "--padding":"6px 10px !important",
            fontSize:"12px"
        },
        notice:{
            borderRadius:"8px",
            margin:"10px"
        },
        war:{
            fontSize: "26px",
            color: 'var(--adm-color-danger)',
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
    const {styles:{head,par,extra,body,label,btn,modals,notice,sel,war,sp1,box,lef}} = useStyles();
    /**
     * 初始化数据
     */
    const [tableData,setTableData] = useState();
    const [domainConfig, setDomainConfig] = useState({});
    const getConfigs = async () => {
        await getDomainList({
            onSuccess:(r:any)=>{
                setTableData(r?.data?.list);
            },
        });
       await getDomainConfig({
            onSuccess: (r: any) => {
                setDomainConfig(r?.data);
            }
        });
    };
    /**
     * 操作
     */
    const [visible, setVisible] = useState(false);
    const [selKey,setSelKey] = useState();
    const actions = [
        { text: '添加', key: 'add'},
        { text: '封禁', key: 'ban'},
        { text: '删除',
            key: 'delete',
            description: '删除后数据不可恢复',
            danger: true,
            bold: true
        },
    ];
    /**
     * 添加
     */
    const [addForm] = Form.useForm();
    const [addOpen,setAddOpen] = useState(false);
    const formFinish = (values: any) => {

    };
    /**
     * 删除或修改
     */
    const modalRef = useRef<any>();
    const [btnLoading,setBtnLoading] = useState(false);
    const [ids,setId] = useState();
    const [web_id,setWeb_id] = useState();
    const [type,setType] = useState();
    const [statu,setStatu] = useState();
    const delOrCha = (title:string,content:string,api:any)=>{
           return modalRef.current =  Modal?.show({
                header: (
                    <ExclamationCircleFill className={war}/>
                ),
                forceRender: true,
                getContainer: VirtualRef?.current,
                className: modals,
                closeOnMaskClick: true,
                title:title,
                content: (
                    <>
                        <p className={sp1}>{content}</p>
                        <div className={box}>
                            <Button size="mini" fill="outline" color="primary" onClick={() => {
                                modalRef?.current?.close()
                            }}>取消</Button>
                            <Button size="mini" color='primary' loading={btnLoading} className={lef}
                                    onClick={async () => {
                                        setBtnLoading(true)
                                        await api({
                                            body:{
                                                ids: [ids], web_id: web_id
                                            },
                                            onSuccess:(r:any)=>{
                                                Toast?.show({
                                                    content:r?.message,
                                                    position:"top"
                                                });
                                            },
                                            onFail:(r:any)=>{
                                                Toast?.show({
                                                    content:r?.message || "删除失败",
                                                    position:"top"
                                                });
                                            },
                                            onFinally:()=>{
                                                modalRef?.current?.close()
                                                setBtnLoading(false)
                                            }
                                        })
                                    }}>确定</Button>
                        </div>
                    </>
                ),
            } as ModalShowProps);
    }
    const handle = (val:any)=>{
        if(val?.key == "add"){
            setAddOpen(true);
            setVisible(false);
        }
        if(val?.key == "delete"){
            setVisible(false);
            if(type == 0){
                Toast?.show({
                    content: "系统域名不可操作",
                    position:"top"
                });
                return;
            }else{
                delOrCha("确定要删除此域名吗?","删除后此域名不可访问",deleteDomain());
            }
        }
        if(val?.key == "ban"){
            setVisible(false);
            if(type == 0){
                Toast?.show({
                    content: "系统域名不可操作",
                    position:"top"
                });
                return;
            }else{
                delOrCha(`确定要${statu == 0 ? "恢复" : "封禁"}此域名吗?`,"此操作将会影响此域名的访问",updateDomain());
            }
        }
    };
    const [pageLoading, setPageLoading] = useState(true);
    useEffect(() => {
        setPageLoading(true);
        getConfigs().finally(() => {
            setPageLoading(false);
        });
    }, []);
    return (
        <Body title="域名设置" titleStyle={{color: "#fff"}} headClassNames={head} space={true} loading={pageLoading}>
            {(tableData?.length <= 0 && <ErrorBlock status='empty'/>) ||
                <>
                    {tableData?.length > 0 &&
                        tableData?.map(item => (
                            <Card key={item?.id}
                                  title={<Title>{'额度:' + domainConfig['master.domain.num'] + '个'}</Title>}
                                  extra={<Button color="primary" size="mini" fill="outline"
                                                 onClick={() =>{
                                                     setVisible(true)
                                                     setId(item?.id)
                                                     setWeb_id(item?.web_id)
                                                     setType(item?.type)
                                                     setStatu(item?.status)
                                                 }}>操作</Button>}>
                                <Typography.Paragraph copyable className={par}>
                                    <span className={extra}>域名：{item?.domain}</span>
                                </Typography.Paragraph><br/>
                                <span className={extra}>
                            类型：{item?.type == 0 && "系统"}
                            {item?.type == 1 && "自定义"}
                        </span><br/>
                        <span className={extra}>
                            域名状态：{item?.status == 0 && "正常"}
                            {item?.status == 1 && "封禁"}
                        </span><br/>
                    </Card>
                    ))}
                    <ActionSheet
                        getContainer={VirtualRef?.current}
                        forceRender={true}
                        visible={visible}
                        actions={actions}
                        onClose={() => setVisible(false)}
                        onAction={(val:any)=>handle(val)}
                    />
                    {/*<Popup*/}
                    {/*    visible={addOpen}*/}
                    {/*    getContainer={VirtualRef?.current}*/}
                    {/*    onClose={() => {*/}
                    {/*        setAddOpen(false)*/}
                    {/*    }}*/}
                    {/*    bodyStyle={{ height: '50vh' }}>*/}
                    {/*    <NoticeBar className={notice} content={"您需要把域名解析至:" + domainConfig['master.domain.resolve']} color='info' />*/}
                    {/*    <Form form={addForm} onFinish={formFinish} className={body}>*/}
                    {/*        <Form.Item name="domain" label="域名" className={label}>*/}
                    {/*            <Input placeholder="请输入域名" clearable/>*/}
                    {/*        </Form.Item>*/}
                    {/*        <Form.Item name="status" label="状态" >*/}
                    {/*            <Selector*/}
                    {/*                className={sel}*/}
                    {/*                options={[{*/}
                    {/*                    value: 0,*/}
                    {/*                    label: "正常"*/}
                    {/*                }, {*/}
                    {/*                    value: 1,*/}
                    {/*                    label: "封禁"*/}
                    {/*                }]}*/}
                    {/*                onChange={(arr:any) => setSelKey(arr)}*/}
                    {/*            />*/}
                    {/*        </Form.Item>*/}
                    {/*    </Form>*/}
                    {/*</Popup>*/}
                </>
            }
        </Body>
    )
}