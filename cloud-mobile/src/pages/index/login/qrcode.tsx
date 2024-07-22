import {Body} from "@/components";
import {Button, Card, Grid, NoticeBar, SpinLoading, Toast} from "antd-mobile";
import {createStyles, useResponsive, useTheme} from "antd-style";
import {QRCode} from "antd";
import React, {useEffect, useState} from "react";
import {getRandStr, qqJumpUrl} from "@/utils/string";
import {genQrCode, qrLogin} from "@/service/user/login";
import {setLoginToken} from "@/utils/auth";
import {historyPush} from "@/utils/route";

const useStyles = createStyles((): any => {
    return {
        notice: {
            borderRadius: "8px",
            "--height": "26px",
            "--font-size": "12px"
        },
        qrcodeBorder: {
            border: "1px solid #e1e1e1",
            borderRadius: "10px",
            width: "150px",
            height: "150px",
            margin: "0px auto",
            position: "relative",
        },
        border_corner: {
            zIndex: 2500,
            position: "absolute",
            width: "19px",
            height: "19px",
            background: "rgba(0, 0, 0, 0)",
            border: "5px solid #0051eb"
        },
        border_corner_left_top: {
            top: "-3px",
            left: "-3px",
            borderRight: "none",
            borderBottom: "none",
            borderTopLeftRadius: "10px"
        },

        border_corner_right_top: {
            top: "-3px",
            right: "-3px",
            borderLeft: "none",
            borderBottom: "none",
            borderTopRightRadius: "10px"
        },

        border_corner_left_bottom: {
            bottom: "-3px",
            left: "-3px",
            borderRight: "none",
            borderTop: "none",
            borderBottomLeftRadius: "10px"
        },

        border_corner_right_bottom: {
            bottom: "-3px",
            right: "-3px",
            borderLeft: "none",
            borderTop: "none",
            borderBottomRightRadius: "10px"
        },
        p: {
            textAlign: 'center',
            marginTop: "10px",
            marginBottom: "10px",
            fontSize: "12px",
            color: "#808080",
        },
        sp: {
            fontSize: "11px",
            color: "#808080"
        }
    }
});

export default () => {
    const {
        styles: {
            p,
            sp,
            border_corner,
            border_corner_left_top,
            border_corner_right_top,
            border_corner_left_bottom,
            border_corner_right_bottom,
            qrcodeBorder,
            notice,
        }
    } = useStyles()
    const {mobile} = useResponsive()
    /**
     * 生成二维码
     */
    const [qrcode, setQrcode] = useState("qrcode");
    const [qrcodeLoading, setQrcodeLoading] = useState(false)
    const getQrCode = async () => {
        const tempToken = getRandStr(32);
        setQrcodeLoading(true)
        await genQrCode({
            body: {
                captcha_id: tempToken,
            },
            onSuccess: (r: any) => {
                localStorage.setItem("captcha_id", tempToken);
                setQrcode(r?.data);
                queryQrCodeStatus(tempToken)
            },
            onFail: () => {
            },
            onFinally: () => {
                setQrcodeLoading(false)
            }
        });
    }
    useEffect(() => {
        getQrCode();
    }, []);

    const queryQrCodeStatus = (id?: any) => {
        if (localStorage.getItem("captcha_id") != id) {
            return
        }
        qrLogin({
            body: {
                captcha_id: id,
                device: mobile
            },
            onSuccess: (r: any) => {
                localStorage.removeItem("captcha_id");
                setLoginToken("mobile", r?.data?.token);
                historyPush("user.index");
                setQrcode("");
                Toast.show({
                    content: r?.message || "登录成功,正在跳转",
                    icon: "success"
                })
            },
            onFail: (r: any) => {
                if (r?.data?.code == -1) {
                    getQrCode();
                } else if (r?.data?.code == 0) {
                    setTimeout(() => {
                        queryQrCodeStatus(id);
                    }, 1000)
                }
            },
        })
    }

    const theme = useTheme()
    return (
        <Body title={"扫码登录"} headStyle={{backgroundColor: theme.colorPrimary, color: "#fff"}}
              titleStyle={{color: "#fff"}}>
            <Grid columns={1} gap={8}>
                <Grid.Item>
                    <NoticeBar className={notice} content='请使用手机QQ扫码下方二维码' color='info' wrap/>
                </Grid.Item>
                <Grid.Item>
                    <Card>
                        <div className={qrcodeBorder}>
                            <div
                                className={border_corner + " " + border_corner_right_bottom}
                                style={{borderColor: theme.colorPrimary}}></div>
                            <div
                                className={border_corner + " " + border_corner_right_top}
                                style={{borderColor: theme.colorPrimary}}></div>
                            <div
                                className={border_corner + " " + border_corner_left_bottom}
                                style={{borderColor: theme.colorPrimary}}></div>
                            <div
                                className={border_corner + " " + border_corner_left_top}
                                style={{borderColor: theme.colorPrimary}}></div>
                            {qrcodeLoading && <SpinLoading color='primary' style={{margin: "50px auto"}}/> ||
                                <QRCode
                                    value={qrcode}
                                    size={150}
                                />
                            }
                        </div>
                        <p className={p}>
                            如提示二维码过期可
                            <span style={{color: theme.colorPrimary}} onClick={() => {
                                getQrCode()
                            }}>点此获取新二维码</span>
                        </p>
                        <p style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#10bb10",
                        }} className={p}>请使用手机QQ扫码二维码，并授权登录</p>
                        <p style={{
                            fontSize: "11px",
                            color: theme.isDarkMode ? "#b3b3b3" : ""
                        }} className={p}>需要在绑定的手机QQ登录后扫码，其他QQ扫码无效</p>
                        <Button type={"submit"} block color='primary'
                                style={{
                                    "--background-color": theme.colorPrimary,
                                    "--border-color": theme.colorPrimary,
                                    fontWeight: 600,
                                    fontSize: "15px",
                                    letterSpacing: "0.5px"
                                }} onClick={() => {
                            qqJumpUrl(qrcode);
                        }}>点击跳转到手机QQ登录</Button>
                    </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card>
                        <p style={{fontSize: "12px", fontWeight: 600, margin: 0}}>验证说明:</p>
                        <span className={sp}>1、使用手机QQ扫描二维码后，在QQ上授权登录。</span><br/>
                    </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card>
                        <p style={{fontSize: "12px", fontWeight: 600, margin: 0}}>扫码使用提示:</p>
                        <span
                            className={sp}>1、如果跳转到手机QQ自动扫码无法使用，可长按二维码保存图片到手机，或者使用手机截图功能截图本页面。在手机QQ扫一扫界面，点右上角进入相册，选择刚才保存的二维码图片即可识别。</span><br/>
                        <span className={sp}>2、如QQ号已经不再使用，请返回选择其它验证方式</span><br/>
                        <span
                            className={sp}>3、系统通过登录QQ空间网页来验证QQ是否正确，由网页协议进行登录，无人工参与，仅用于验证，请放心使用。</span>
                    </Card>
                </Grid.Item>
            </Grid>
        </Body>
    );
};
