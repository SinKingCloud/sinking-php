import React, {RefObject, useState} from "react";
import {createStyles} from "antd-style";
import {
    Card,
    DatePicker,
    DatePickerRef, DotLoading, ErrorBlock,
    Form, InfiniteScroll,
    Input,
    Popup,
    PullToRefresh,
    Selector,
    Slider,
    Stepper
} from "antd-mobile";
import {Title, VirtualRef} from "@/components";
import dayjs from "dayjs";
import type {FormInstance} from "rc-field-form/es/interface";

const useStyles = createStyles(({isDarkMode}): any => {
    return {
        popup: {
            ".adm-card": {
                background: "transparent !important",
                padding: "0 !important"
            },
            ".adm-card-header": {
                padding: "15px 15px 10px 15px !important",
                borderBottom: "none !important"
            },
            ".adm-card-body": {
                padding: "0 !important"
            },
            ".adm-list-body": {
                background: "transparent !important",
                borderTop: "none !important",
                borderBottom: "none !important",
            },
            ".adm-list-item": {
                background: isDarkMode ? "rgba(0, 0, 0, 0.5) !important" : "white !important",
                borderRadius: "10px !important",
                margin: "5px 0 10px 0",
                userSelect: "none",
                ".adm-form-item-label": {
                    fontSize: "13px !important"
                },
                ".adm-form-item-child-inner": {
                    fontSize: "12px !important",
                    "input": {
                        fontSize: "12px !important",
                    },
                    ".adm-selector-item": {
                        borderRadius: "7px",
                        fontSize: "12px",
                    }
                },
                ".adm-list-item-content": {
                    borderTop: "none !important"
                }
            },
            ".adm-form-footer": {
                padding: "0 0 20px 0 !important"
            },
            ".adm-popup-body": {
                backgroundColor: isDarkMode ? "rgba(34, 34, 34, 0.96) !important" : "rgba(241, 241, 241, 0.96) !important",
                maxHeight: "100% !important",
                borderTopLeftRadius: '8px !important',
                borderTopRightRadius: '8px !important',
            },
            ".adm-form": {
                maxHeight: "600px",
                overflowX: "hidden",
                overflowY: "auto",
                borderTop: "none !important",
                padding: "0 15px"
            }
        },
        mask: {
            backdropFilter: "blur(5px) !important",
        }
    }
});

export type ProListProps = {
    searchPanelTitle?: string;//搜索标题
    searchPanelOkText?: string;//搜索确认标题
    render?: (item: any) => any;//列表渲染
    formRender?: (fields: any) => any;//表单渲染
    formFields?: any[];//表单项
    formDefaultValues?: any;//表单项默认值
    onRequest?: (params: any) => any;//请求数据
};

export interface ProListRef {
    searchForm?: FormInstance;//form实例
    showSearchPanel?: () => void;//显示搜索面板
    closeSearchPanel?: () => void;//关闭搜索面板
    search?: () => void;//执行搜索
}

const ProList = React.forwardRef<ProListRef, ProListProps>((props, ref) => {
        const {
            searchPanelTitle,
            searchPanelOkText,
            onRequest,
            formRender = undefined,
            formFields,
            formDefaultValues
        } = props;
        const {styles: {popup, mask}} = useStyles();
        /**
         * 筛选弹出层
         */
        const [form] = Form.useForm();
        const [searchVisible, setSearchVisible] = useState<any>(false);
        const showSearch = () => {
            setSearchVisible(true);
        }
        const closeSearch = () => {
            setSearchVisible(false);
        }
        const onSearch = async () => {
            setHasMore(false);
            setEmpty(false);
            setList([]);
            closeSearch();
            await resetData();
        }
        /**
         * 数据信息
         */
        const [list, setList] = useState<any>([]);//列表数据
        const [page, setPage] = useState<any>({page: 1, page_size: 10});//分页数据
        const [hasMore, setHasMore] = useState(true);//加载更多
        const [empty, setEmpty] = useState(false);
        const [loading, setLoading] = useState(false);
        /**
         * 加载数据
         * @param page 分页信息
         */
        const loadData = async (page) => {
            setLoading(true);
            const params = form?.getFieldsValue();
            if (params) {
                for (const key in params) {
                    if (Object.prototype.hasOwnProperty.call(params, key)) {
                        if (params[key] instanceof Date) {
                            params[key] = dayjs(params[key])?.format('YYYY-MM-DD HH:mm:ss');
                        }
                    }
                }
            }
            const res = await onRequest?.({...page, ...params});
            setLoading(false);
            if (res?.code == 200) {
                const more = !(res?.data?.page * res?.data?.page_size >= res?.data?.total);
                setHasMore(more);
                setEmpty((res?.data?.total || 0) <= 0);
                if (res?.data?.page <= 1) {
                    setList([...res?.data?.list]);
                } else {
                    setList([...list, ...res?.data?.list]);
                }
            } else {
                throw new Error('请求失败');
            }
        }
        /**
         * 加载更多
         * @param isRetry 是否是重试请求
         */
        const loadMore = async (isRetry) => {
            await loadData(page);
            if (!isRetry) {
                let temp = {...page};
                temp.page++;
                setPage(temp);
            }
        }
        /**
         * 重置数据
         */
        const resetData = async () => {
            const pageInfo = {...page, ...{page: 2}};
            setPage(pageInfo);
            await loadData({...page, ...{page: 1}});
        }

        React.useImperativeHandle(ref, () => ({
            searchForm: form,
            showSearchPanel: showSearch,
            closeSearchPanel: closeSearch,
            search: onSearch,
        }));

        return (
            <>
                <Popup
                    getContainer={VirtualRef?.current}
                    forceRender={true}
                    visible={searchVisible}
                    onMaskClick={closeSearch}
                    onClose={closeSearch}
                    maskClassName={mask}
                    position={"bottom"}
                    closeOnSwipe={true} className={popup}>
                    <Card
                        title={<Title>{searchPanelTitle || "快捷筛选"}</Title>}
                        extra={<a onClick={form?.submit}>{searchPanelOkText || "应用"}</a>}>
                        <Form form={form} initialValues={formDefaultValues} onFinish={onSearch}>
                            {(formRender && formRender(formFields)) || (formFields && formFields.map((v) => {
                                let trigger = 'onChange';
                                let onClick;
                                let dom;
                                switch (v?.type) {
                                    case 'date':
                                        trigger = 'onConfirm';
                                        onClick = (e, datePickerRef: RefObject<DatePickerRef>) => {
                                            datePickerRef.current?.open();
                                            closeSearch();
                                        };
                                        dom = <DatePicker getContainer={VirtualRef?.current}
                                                          onCancel={showSearch}
                                                          precision={v?.precision || "day"}
                                                          onConfirm={showSearch}
                                                          {...v?.props}>
                                            {(value) => {
                                                return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '请选择' + (v?.label || v?.name);
                                            }}
                                        </DatePicker>
                                        break;
                                    case 'stepper':
                                        dom = <Stepper max={v?.max} min={v?.min} allowEmpty={v?.allowEmpty} {...v?.props}/>
                                        break;
                                    case 'select':
                                        dom =
                                            <Selector columns={v?.columns || v?.options?.length || 1} multiple={v?.multiple}
                                                      options={v?.options || []} {...v?.props}/>
                                        break
                                    case 'slider':
                                        dom = <Slider ticks={v?.ticks} step={v?.step} max={v?.max} min={v?.min}
                                                      icon={v?.icon} {...v?.props}/>;
                                        break
                                    default:
                                        dom = <Input placeholder={'请输入' + (v?.label || v?.name)}
                                                     clearable={true} {...v?.props}/>
                                        break;
                                }
                                return <Form.Item trigger={trigger}
                                                  onClick={onClick} key={v?.name} name={v?.name} label={v?.label || v?.name}
                                                  rules={v?.rules}
                                                  className={v?.className}>
                                    {dom}
                                </Form.Item>;
                            }))}

                        </Form>
                    </Card>
                </Popup>
                <PullToRefresh onRefresh={resetData}>
                    {(empty &&
                        <ErrorBlock status='empty' style={{height: "80vh"}}/>) || (list?.length > 0 && list?.map(item => (
                        props?.render?.(item)
                    )))}
                </PullToRefresh>
                {!empty && <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
                    {loading && <div> 加载中 <DotLoading/></div>}
                    {!loading && !hasMore && <div> 没有更多了</div>}
                    {!loading && hasMore && <div> 上拉加载更多</div>}
                </InfiniteScroll>}
            </>
        )
    }
)

export default ProList