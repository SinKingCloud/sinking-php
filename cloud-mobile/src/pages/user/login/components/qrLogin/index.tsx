import {Body} from "@/components";
import {Button, Card, NoticeBar, SpinLoading, Toast} from "antd-mobile";
import {createStyles, useResponsive, useTheme} from "antd-style";
import {QRCode} from "antd";
import React, {useEffect, useState} from "react";
import {getRandStr, qqJumpUrl} from "@/utils/string";
import {genQrCode, qrLogin} from "@/service/user/login";
import {useLocation} from "umi";
import {setLoginToken} from "@/utils/auth";
import {historyPush} from "@/utils/route";
const useStyles = createStyles(({token}):any=>{
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
        // getContactData()
    }, []);

    const queryQrCodeStatus = (id?:any) => {
        if (localStorage.getItem("captcha_id") != id ) {
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

    const theme = useTheme()
    return (
        <Body title={"扫码登录"}  headStyle={{backgroundColor:theme.colorPrimary, color:"#fff"}} titleStyle={{color: "#fff"}}>
            <NoticeBar style={{borderRadius: "8px", "--height": "26px", "--font-size": "12px",marginBottom:"15px"}}
                       content='请使用手机QQ扫码下方二维码' color='info' wrap/>
            <div style={{
                border: "1px solid #e1e1e1",
                borderRadius: "10px",
                width: "150px",
                height: "150px",
                margin: "0px auto",
                position: "relative",
            }}>
                <div
                    className={border_corner + " " + border_corner_right_bottom}></div>
                <div
                    className={border_corner + " " + border_corner_right_top}></div>
                <div
                    className={border_corner + " " + border_corner_left_bottom}></div>
                <div
                    className={border_corner + " " + border_corner_left_top}></div>
                    {qrcodeLoading &&<SpinLoading  color='primary' style={{margin:"50px auto"}}/> ||
                        <QRCode
                            value={qrcode}
                            size={150}
                        />
                    }
            </div>
          <p style={{fontSize:"12px",color:"#808080",textAlign:"center",marginTop:"15px",borderBottom:"1px dashed #eeeeee",paddingBottom:"20px"}}>
              如提示二维码过期可
          <span style={{color:theme.colorPrimary}} onClick={()=>{
              getQrCode()
          }}>点此获取新二维码</span>
          </p>
            <p style={{fontSize:"13px",fontWeight:600,textAlign:"center",color:"#10bb10",marginBottom:0}}>请使用手机QQ扫码二维码，并授权登录</p>
            <p style={{fontSize:"11px",textAlign:'center',marginTop:"5px",color:theme.isDarkMode?"#b3b3b3" : ""}}>需要在绑定的手机QQ登录后扫码，其他QQ扫码无效</p>
            <Button type={"submit"} block color='primary'
                    style={{"--background-color":theme.colorPrimary,"--border-color":theme.colorPrimary,fontWeight:600,fontSize:"15px",marginBottom:"20px",letterSpacing:"0.5px"}} onClick={()=>{
                    qqJumpUrl(qrcode);
            }} >点击跳转到手机QQ登录</Button>
            <Card style={{marginBottom:"10px"}}>
                <p style={{fontSize:"12px",fontWeight:600,margin:0}}>验证说明:</p>
                <span style={{fontSize:"11px",color:"#808080"}}>1、使用手机QQ扫描二维码后，在QQ上授权登录。</span><br/>
            </Card>
            <Card>
                <p style={{fontSize:"12px",fontWeight:600,margin:0}}>扫码使用提示:</p>
                <span style={{fontSize:"11px",color:"#808080"}}>1、如果跳转到手机QQ自动扫码无法使用，可长按二维码保存图片到手机，或者使用手机截图功能截图本页面。在手机QQ扫一扫界面，点右上角进入相册，选择刚才保存的二维码图片即可识别。</span><br/>
                <span style={{fontSize:"11px",color:"#808080"}}>2、如QQ号已经不再使用，请返回选择其它验证方式</span><br/>
                <span style={{fontSize:"11px",color:"#808080"}}>3、系统通过登录QQ空间网页来验证QQ是否正确，由网页协议进行登录，无人工参与，仅用于验证，请放心使用。</span>
            </Card>
        </Body>
    );
};
export default qrLoginPage;
