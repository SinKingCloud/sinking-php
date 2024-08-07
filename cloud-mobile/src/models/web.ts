import {useEffect, useState} from "react";
import {API} from "@/../typings";
import {getWebInfo} from "@/service/web/info";
import defaultSettings from "../../config/defaultSettings";
import {useModel} from "umi";

export default () => {
    const [info, setInfo] = useState<API.WebInfo>({
        ...defaultSettings as API.WebInfo
    });
    const theme = useModel("theme");
    /**
     * 获取站点信息
     */
    const getInfo = async () => {
        const resp = await getWebInfo();
        return resp?.data || {};
    }
    /**
     * 刷新站点信息
     */
    const refreshInfo = () => {
        getInfo().then((d) => {
            setInfo(d);
            if (d?.color) {
                theme?.setColor(d?.color);
            }
            theme?.setDefaultTheme();
        });
    }

    useEffect(() => {
        refreshInfo();
    }, []);

    return {
        info,
        setInfo,
        getInfo,
        refreshInfo
    };
};