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
    type NoticeIconList = {
        data?: NoticeIconItem[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

    type NoticeIconItemType = 'notification' | 'message' | 'event';

    type NoticeIconItem = {
        id?: string;
        extra?: string;
        key?: string;
        read?: boolean;
        avatar?: string;
        title?: string;
        status?: string;
        datetime?: string;
        description?: string;
        type?: NoticeIconItemType;
    };
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
    type UserInfo = {UserInfo
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
        reg_email?: string;
        reg_qrlogin?: string;
        reg_phone?: string;
    }
}
