import React, {useRef, useState} from 'react'
import {Body} from "@/components";
import {SwiperRef, Tabs, Swiper} from "antd-mobile";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css}): any => {
    return {
        content: css`
            color: #999999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            user-select: none;
            flex: 1;
        `,
        swiper:{
            height:"100%"
        }
    }
})
export default () => {
    const {styles: {content,swiper}} = useStyles();
    const tabItems = [
        {key: 'fruits', title: '测试1'},
        {key: 'vegetables', title: '测试2'},
        {key: 'animals', title: '测试3'},
    ]
    const swiperRef = useRef<SwiperRef>();
    const [activeIndex, setActiveIndex] = useState(1);
    return (
        <Body showHeader={false} space={false} >
                <Tabs
                    activeKey={tabItems[activeIndex].key}
                    onChange={key => {
                        const index = tabItems.findIndex(item => item.key === key)
                        setActiveIndex(index)
                        swiperRef.current?.swipeTo(index)
                    }}
                >
                    {tabItems.map(item => (
                        <Tabs.Tab title={item.title} key={item.key}/>
                    ))}
                </Tabs>
                <Swiper
                    className={swiper}
                    direction='horizontal'
                    loop
                    indicator={() => null}
                    ref={swiperRef}
                    defaultIndex={activeIndex}
                    onIndexChange={index => {
                        setActiveIndex(index)
                    }}
                    style={{
                        width:"100%",
                        height:"70vh"
                    }}>
                    <Swiper.Item>
                        <div className={content}>tab1</div>
                    </Swiper.Item>
                    <Swiper.Item>
                        <div className={content}>tab2</div>
                    </Swiper.Item>
                    <Swiper.Item>
                        <div className={content}>tab3</div>
                    </Swiper.Item>
                </Swiper>
        </Body>
    )
}