import 'umi/typings';

declare namespace API {

    /**
     * 快捷请求结构
     */
    type RequestParams = {
        body?: any,
        onSuccess?: (res) => void,
        onFail?: (res) => void,
        onFinally?: () => void
    }

    /**
     * 通用响应
     */
    type Response = {
        code?: number;
        message?: string;
        data?: any;
        request_id?: string;
    }
    /**
     * 站点信息
     */
    type WebInfo = {
        name?: string;
        contact?: string;
    }

    /**
     * 网站用户信息
     */
    /**
     * 用户信息
     */
    type UserInfo = {
        UserInfo
        id?: number;
        web_id?: number;
        account?: string;
        money?: any;
        nick_name?: string;
        avatar?: string;
        email?: string;
        login_ip?: string;
        login_time?: string;
        is_admin?: boolean;
        is_master?: boolean;
    }
    /**
     * 网站信息
     */
    type WebInfo = {
        id?: number;
        name?: string;
        title?: string;
        keywords?: string;
        description?: string;
        expire_time?: string;
        domain?: string;
        service_licence?: string;
        logo?: string;
        water_mark?: string;
        layout?: string;
        theme?: string;
        color?: string;
        compact?: boolean;
        reg_email?: boolean;
        reg_qrlogin?: boolean;
        reg_phone?: boolean;
    }
}

