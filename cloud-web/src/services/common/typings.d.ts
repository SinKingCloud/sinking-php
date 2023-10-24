// @ts-ignore
/* eslint-disable */

declare namespace API {

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

  /*以下为新系统代码*/
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
   * 用户信息
   */
  type UserInfo = {
    id?: number;
    web_id?: number;
    account?: string;
    money?: string;
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
