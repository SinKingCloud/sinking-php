import {Body} from "@/components";
import {NoticeBar, Toast} from "antd-mobile";
import {createStyles, useResponsive} from "antd-style";
import {QRCode, Spin} from "antd";
import {useEffect, useState} from "react";
import {getRandStr} from "@/utils/string";
import {genQrCode, qrLogin} from "@/service/user/login";
import {useLocation} from "umi";
import {setLoginToken} from "@/utils/auth";
import {historyPush} from "@/utils/route";
const useStyles = createStyles(():any=>{
    return{
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
    }
})
const qrLoginPage = () => {
    const {styles:{border_corner,border_corner_left_top, border_corner_right_top, border_corner_left_bottom, border_corner_right_bottom}} = useStyles()
    const {mobile} = useResponsive()
    const [isMobile, setIsMobile] = useState("pc")
    useEffect(() => {
        if (mobile) {
            setIsMobile("mobile")
        } else {
            setIsMobile("pc")
        }
    }, [mobile]);
    /**
     * 生成二维码
     */
    const location = useLocation();
    const [qrcode, setQrcode] = useState("");
    const [qrcodeMessage, setQrcodeMessage] = useState("正在生成二维码");
    const [qrcodeLoading,setQrcodeLoading] = useState(false)
    const getQrCode = async() => {
        const tempToken = getRandStr(32);
        setQrcodeMessage("正在生成二维码");
        setQrcodeLoading(true)
       await genQrCode({
            body: {
                captcha_id: tempToken,
            },
            onSuccess: (r: any) => {
                localStorage.setItem("captcha_id", tempToken);
                setQrcode(r?.data);
                setQrcodeMessage("请扫描二维码");
                queryQrCodeStatus(tempToken)
            },
            onFail: (r: any) => {
                setQrcodeMessage(r?.message || "获取二维码失败");
            },
           onFinally: () => {
               setQrcodeLoading(false)
           }
        });
    }

    useEffect(() => {
        getQrCode();
    }, []);

    const queryQrCodeStatus = (id?:any) => {
        if (localStorage.getItem("captcha_id") != id || location.pathname != "user/other/qrLogin") {
            return
        }
        qrLogin({
            body: {
                captcha_id: id,
                device: isMobile,
            },
            onSuccess: (r: any) => {
                localStorage.removeItem("captcha_id");
                setQrcodeMessage("验证成功,正在登陆");
                setLoginToken(isMobile, r?.data?.token);
                historyPush("user.index");
                setQrcode("");
                Toast.show({
                    content: r?.message || "登录成功,正在跳转",
                    icon:"success"
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
    return (
        <Body title={"扫码登录"} bodyStyle={{backgroundColor: "#faf8f8", padding: "10px", height: "100vh"}}
              headStyle={{backgroundColor: "rgb(92,165,214)", color: "#fff"}} titleStyle={{color: "#fff"}}>
            <NoticeBar style={{borderRadius: "8px", "--height": "26px", "--font-size": "12px",marginBottom:"10px"}}
                       content='请使用手机QQ扫码下方二维码' color='info' wrap/>
            <div style={{
                border: "1px solid #e1e1e1",
                backgroundColor: "#fbfbfb",
                borderRadius: "10px",
                width: "125px",
                height: "125px",
                margin: "0px auto",
                position: "relative"
            }}>
                <div
                    className={border_corner + " " + border_corner_right_bottom}></div>
                <div
                    className={border_corner + " " + border_corner_right_top}></div>
                <div
                    className={border_corner + " " + border_corner_left_bottom}></div>
                <div
                    className={border_corner + " " + border_corner_left_top}></div>
                <Spin spinning={qrcodeLoading || qrcode == ""}>
                          <QRCode
                              value={qrcode}
                              size={125}
                              onClick={()=>{
                                  getQrCode()
                              }}
                          />
                </Spin>
            </div>
            <div
                style={{
                    textAlign: "center",
                    margin: "15px auto -15px auto",
                    color: "#8c8c8c"
                }}>
                {qrcodeMessage || "请扫描二维码"}
            </div>
        </Body>
    );
};

export default qrLoginPage;
