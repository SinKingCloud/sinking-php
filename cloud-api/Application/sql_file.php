<?php exit;?>
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cloud_cashs
-- ----------------------------
DROP TABLE IF EXISTS `cloud_cashs`;
CREATE TABLE `cloud_cashs`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '用户ID',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '提现方式(0:支付宝)',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '提现姓名',
  `account` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '提现账号',
  `money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '提现金额',
  `real_money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '实际到账',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态(0:未处理/1:已到账)',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`, `user_id`) USING BTREE,
  INDEX `idx_userId`(`user_id`) USING BTREE,
  INDEX `idx_type`(`type`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_createTime`(`create_time`) USING BTREE,
  INDEX `idx_updateTime`(`update_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_cashs
-- ----------------------------

-- ----------------------------
-- Table structure for cloud_configs
-- ----------------------------
DROP TABLE IF EXISTS `cloud_configs`;
CREATE TABLE `cloud_configs`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(170) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '配置标识',
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '配置内容',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`, `key`) USING BTREE,
  INDEX `idx_key`(`key`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 48 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_configs
-- ----------------------------
INSERT INTO `cloud_configs` VALUES (1, 'cloud.id', '1', '2022-07-20 20:02:30', NULL);
INSERT INTO `cloud_configs` VALUES (2, 'cloud.key', 'AZELPMIOFHSJ4YWVLI1B0T3OQ0NZJGMX', '2022-07-20 20:02:30', NULL);
INSERT INTO `cloud_configs` VALUES (3, 'master.web.keywords', '{$name},沉沦云科技,沉沦云,php快速开发框架', '2022-06-19 13:45:27', '2022-06-19 22:09:21');
INSERT INTO `cloud_configs` VALUES (4, 'master.web.description', '{$name}致力于专业领域软件开发', '2022-06-19 13:45:27', '2022-06-19 22:09:21');
INSERT INTO `cloud_configs` VALUES (5, 'email.host', 'smtp.qq.com', NULL, '2022-07-20 20:06:40');
INSERT INTO `cloud_configs` VALUES (6, 'email.port', '465', NULL, '2022-07-20 20:06:40');
INSERT INTO `cloud_configs` VALUES (7, 'email.pwd', 'zgmtatkegygsgaga', NULL, '2022-07-20 20:06:40');
INSERT INTO `cloud_configs` VALUES (8, 'email.user', '2710911512@qq.com', NULL, '2022-07-20 20:06:40');
INSERT INTO `cloud_configs` VALUES (9, 'master.contact', '2710911512', '2022-06-06 11:58:26', '2022-07-20 20:09:00');
INSERT INTO `cloud_configs` VALUES (10, 'master.request.log.open', '0', NULL, '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (11, 'pay.alipay.type', 'epay1', NULL, '2022-06-24 22:00:36');
INSERT INTO `cloud_configs` VALUES (12, 'pay.epay1.appid', '1000', NULL, '2022-07-20 20:07:06');
INSERT INTO `cloud_configs` VALUES (13, 'pay.epay1.key', 'a1694d1SM441P6jE1d6BHUp66kUsS54M', NULL, '2022-07-20 20:07:06');
INSERT INTO `cloud_configs` VALUES (14, 'pay.epay1.url', 'https://www.baidu.com/', NULL, '2022-07-20 20:07:06');
INSERT INTO `cloud_configs` VALUES (15, 'pay.epay2.appid', '1000', NULL, '2022-07-20 20:07:18');
INSERT INTO `cloud_configs` VALUES (16, 'pay.epay2.key', 'a1694d1SM441P6jE1d6BHUp66kUsS54M', NULL, '2022-07-20 20:07:18');
INSERT INTO `cloud_configs` VALUES (17, 'pay.epay2.url', 'https://www.baidu.com/', NULL, '2022-07-20 20:07:18');
INSERT INTO `cloud_configs` VALUES (18, 'pay.epay3.appid', '1000', NULL, '2022-07-20 20:07:30');
INSERT INTO `cloud_configs` VALUES (19, 'pay.epay3.key', 'a1694d1SM441P6jE1d6BHUp66kUsS54M', NULL, '2022-07-20 20:07:30');
INSERT INTO `cloud_configs` VALUES (20, 'pay.epay3.url', 'https://www.baidu.com/', NULL, '2022-07-20 20:07:30');
INSERT INTO `cloud_configs` VALUES (21, 'pay.qqpay.type', 'epay1', NULL, '2022-06-24 22:00:36');
INSERT INTO `cloud_configs` VALUES (22, 'pay.wxpay.type', 'epay1', NULL, '2022-06-24 22:00:36');
INSERT INTO `cloud_configs` VALUES (23, 'site.cost.price', '10', NULL, '2022-07-03 12:00:30');
INSERT INTO `cloud_configs` VALUES (25, 'site.default.price', '100.00', NULL, '2022-07-03 12:00:30');
INSERT INTO `cloud_configs` VALUES (26, 'master.domains', 'dg.cn', NULL, '2022-07-20 20:07:43');
INSERT INTO `cloud_configs` VALUES (27, 'site.min.price', '50', NULL, '2022-07-03 12:00:30');
INSERT INTO `cloud_configs` VALUES (28, 'master.is_proxy', '0', '2022-06-06 13:32:28', '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (29, 'master.debug', '0', '2022-06-06 13:50:23', '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (30, 'master.domain.resolve', '127.0.0.1', '2022-06-06 14:51:28', '2022-07-20 20:07:43');
INSERT INTO `cloud_configs` VALUES (31, 'pay.min.money', '10', '2022-06-06 14:57:55', '2022-06-24 22:00:36');
INSERT INTO `cloud_configs` VALUES (32, 'site.order.deduct', '20', '2022-06-07 20:04:31', '2022-07-03 12:00:30');
INSERT INTO `cloud_configs` VALUES (33, 'site.recharge.deduct', '10', '2022-06-07 20:04:31', '2022-07-03 12:00:30');
INSERT INTO `cloud_configs` VALUES (34, 'cash.open', '1', '2022-06-14 16:16:06', '2022-07-02 20:58:09');
INSERT INTO `cloud_configs` VALUES (35, 'cash.deduct', '5', '2022-06-14 16:16:06', '2022-07-02 20:58:09');
INSERT INTO `cloud_configs` VALUES (36, 'cash.min.money', '10', '2022-06-14 16:16:06', '2022-07-02 20:58:09');
INSERT INTO `cloud_configs` VALUES (37, 'master.domain.num', '100', '2022-06-16 14:12:58', '2022-07-20 20:07:43');
INSERT INTO `cloud_configs` VALUES (38, 'master.web.title', '{$name} - 最专业的网站', '2022-06-19 13:45:27', '2022-06-19 22:09:20');
INSERT INTO `cloud_configs` VALUES (39, 'master.reg.email', '1', '2022-06-06 13:32:28', '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (40, 'master.reg.qrlogin', '1', '2022-06-06 13:50:23', '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (41, 'master.reg.phone', '1', '2022-06-06 13:50:23', '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (42, 'sms.aliyun.key', 'abcefghijklmnopqist', '2022-06-06 13:32:28', '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (43, 'sms.aliyun.secret', 'abcefghijklmnopqist', '2022-06-06 13:50:23', '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (44, 'sms.captcha.sign', '测试签名', '2022-06-06 13:50:23', '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (45, 'sms.captcha.code', '测试code', '2022-06-06 13:32:28', '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (46, 'sms.captcha.var', 'code', '2022-06-06 13:50:23', '2022-07-20 20:09:01');
INSERT INTO `cloud_configs` VALUES (47, 'site.month', '12', '2022-06-06 13:50:23', '2022-07-20 20:09:01');

-- ----------------------------
-- Table structure for cloud_counts
-- ----------------------------
DROP TABLE IF EXISTS `cloud_counts`;
CREATE TABLE `cloud_counts`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `p_web_id` int(11) NOT NULL DEFAULT 0 COMMENT '上级站点ID',
  `web_id` int(11) NOT NULL DEFAULT 0 COMMENT '站点ID(0:系统/其他:站点数据)',
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '用户ID(0:站点/其他:用户数据)',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型(0:总统计/1:日统计/2:周统计/3:月统计/4:年统计)',
  `date` date NOT NULL COMMENT '统计日期',
  `order_num` int(11) NOT NULL DEFAULT 0 COMMENT '订单数量',
  `order_succ_num` int(11) NOT NULL DEFAULT 0 COMMENT '成功订单数量',
  `consume_money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '消费金额',
  `recharge_money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '充值金额',
  `deduct_money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '提成金额',
  `user_num` int(11) NOT NULL DEFAULT 0 COMMENT '用户数量',
  `site_num` int(11) NOT NULL DEFAULT 0 COMMENT '分站数量',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`, `p_web_id`, `web_id`, `user_id`, `type`, `date`) USING BTREE,
  INDEX `idx_orderNum`(`order_num`) USING BTREE,
  INDEX `idx_orderSuccNum`(`order_succ_num`) USING BTREE,
  INDEX `idx_consumeMoney`(`consume_money`) USING BTREE,
  INDEX `idx_rechargeMoney`(`recharge_money`) USING BTREE,
  INDEX `idx_userNum`(`user_num`) USING BTREE,
  INDEX `idx_siteNum`(`site_num`) USING BTREE,
  INDEX `idx_pWebId_webId_userId_type_date`(`p_web_id`, `web_id`, `user_id`, `type`, `date`) USING BTREE,
  INDEX `idx_createTime`(`create_time`) USING BTREE,
  INDEX `idx_webId_userId_type_date`(`web_id`, `user_id`, `type`, `date`) USING BTREE,
  INDEX `idx_userId_type_date`(`user_id`, `type`, `date`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_counts
-- ----------------------------

-- ----------------------------
-- Table structure for cloud_domains
-- ----------------------------
DROP TABLE IF EXISTS `cloud_domains`;
CREATE TABLE `cloud_domains`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '域名ID',
  `web_id` int(11) NOT NULL COMMENT '站点ID',
  `domain` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '绑定域名',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '域名状态(0:正常/1:封禁)',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '域名类型(0:系统/1:自定义)',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`, `web_id`) USING BTREE,
  INDEX `idx_webId_status`(`web_id`, `status`) USING BTREE,
  INDEX `idx_domain_status`(`domain`, `status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for cloud_logs
-- ----------------------------
DROP TABLE IF EXISTS `cloud_logs`;
CREATE TABLE `cloud_logs`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '日志id',
  `request_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '请求ID',
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '用户ID',
  `request_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '操作IP',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '事件类型(0:登陆/1:查看/2:删除/3:修改/4:创建)',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '事件标题',
  `content` varchar(999) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '事件详情',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`, `user_id`) USING BTREE,
  INDEX `idx_userId`(`user_id`) USING BTREE,
  INDEX `idx_type`(`type`) USING BTREE,
  INDEX `idx_createTime`(`create_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_logs
-- ----------------------------

-- ----------------------------
-- Table structure for cloud_messages
-- ----------------------------
DROP TABLE IF EXISTS `cloud_messages`;
CREATE TABLE `cloud_messages`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '接收者',
  `title` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '消息名称',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '消息内容',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '消息状态(0:未读/1:已读)',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`, `user_id`) USING BTREE,
  INDEX `idx_userId_status`(`user_id`, `status`) USING BTREE,
  INDEX `idx_createTime`(`create_time`) USING BTREE,
  INDEX `idx_updateTime`(`update_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_messages
-- ----------------------------

-- ----------------------------
-- Table structure for cloud_notices
-- ----------------------------
DROP TABLE IF EXISTS `cloud_notices`;
CREATE TABLE `cloud_notices`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `web_id` int(11) NOT NULL DEFAULT 0 COMMENT '站点ID',
  `place` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公告位置',
  `title` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公告名称',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '公告内容',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '公告状态(0:正常/1:禁用)',
  `look_num` int(11) NOT NULL DEFAULT 0 COMMENT '查看次数',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`, `web_id`) USING BTREE,
  INDEX `idx_webId_place_status_sort`(`web_id`, `place`, `status`, `sort`) USING BTREE,
  INDEX `idx_place_webId`(`place`, `web_id`) USING BTREE,
  INDEX `idx_sort_webId`(`sort`, `web_id`) USING BTREE,
  INDEX `idx_status_webId`(`status`, `web_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_notices
-- ----------------------------

-- ----------------------------
-- Table structure for cloud_orders
-- ----------------------------
DROP TABLE IF EXISTS `cloud_orders`;
CREATE TABLE `cloud_orders`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `web_id` int(11) NOT NULL DEFAULT 0 COMMENT '站点ID',
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '用户ID',
  `pay_type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '支付方式(0:支付宝/1:微信/2:QQ/3:余额)',
  `order_type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '订单类型(0:余额充值/1:开通分站/2:在线下单)',
  `money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '订单金额',
  `commission_money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '提成金额',
  `trade_no` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '系统订单号',
  `out_trade_no` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '外部订单号',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '订单名称',
  `param` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '其他参数',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态(0:未支付/1:已支付/2:已作废)',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`, `web_id`, `user_id`) USING BTREE,
  INDEX `idx_webId`(`web_id`) USING BTREE,
  INDEX `idx_userId`(`user_id`) USING BTREE,
  INDEX `idx_payType`(`pay_type`) USING BTREE,
  INDEX `idx_orderType`(`order_type`) USING BTREE,
  INDEX `idx_tradeNo`(`trade_no`) USING BTREE,
  INDEX `idx_outTradeNo`(`out_trade_no`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_createTime`(`create_time`) USING BTREE,
  INDEX `idx_updateTime`(`update_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_orders
-- ----------------------------

-- ----------------------------
-- Table structure for cloud_pays
-- ----------------------------
DROP TABLE IF EXISTS `cloud_pays`;
CREATE TABLE `cloud_pays`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '用户ID',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型(0:增加/1:减少)',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '详细',
  `money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '金额',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`, `user_id`) USING BTREE,
  INDEX `idx_userId_type`(`user_id`, `type`) USING BTREE,
  INDEX `idx_type`(`type`) USING BTREE,
  INDEX `idx_createTime`(`create_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_pays
-- ----------------------------

-- ----------------------------
-- Table structure for cloud_request_logs
-- ----------------------------
DROP TABLE IF EXISTS `cloud_request_logs`;
CREATE TABLE `cloud_request_logs`  (
  `id` bigint(32) NOT NULL AUTO_INCREMENT COMMENT '记录id',
  `request_id` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '日志id',
  `request_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '请求ip',
  `request_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '请求地址',
  `request_method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '请求类型',
  `request_header` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '请求头',
  `request_body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '请求体',
  `request_time` datetime NULL DEFAULT NULL COMMENT '请求时间',
  `response_body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '响应体',
  `response_time` datetime NOT NULL COMMENT '响应时间',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_requestId`(`request_id`) USING BTREE,
  INDEX `idx_requestIp`(`request_ip`) USING BTREE,
  INDEX `idx_requestUrl`(`request_url`) USING BTREE,
  INDEX `idx_requestMethod`(`request_method`) USING BTREE,
  INDEX `idx_createTime`(`create_time`) USING BTREE,
  INDEX `idx_updateTime`(`update_time`) USING BTREE,
  INDEX `idx_requestTime`(`request_time`) USING BTREE,
  INDEX `idx_responseTime`(`response_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_request_logs
-- ----------------------------

-- ----------------------------
-- Table structure for cloud_settings
-- ----------------------------
DROP TABLE IF EXISTS `cloud_settings`;
CREATE TABLE `cloud_settings`  (
  `id` bigint(32) NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置类型',
  `key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置标识',
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '配置内容',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`, `type`, `key`) USING BTREE,
  INDEX `idx_type_key`(`type`, `key`) USING BTREE,
  INDEX `idx_key`(`key`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_settings
-- ----------------------------
INSERT INTO `cloud_settings` VALUES (1, 'User-1', 'login-time', '21066284', '2022-05-29 22:59:57', '2022-05-29 23:23:20');
INSERT INTO `cloud_settings` VALUES (2, 'User-1', 'contact', '2710911512', '2022-06-02 14:06:02', '2022-07-20 20:05:35');
INSERT INTO `cloud_settings` VALUES (3, 'Web-1', 'site.price', '188', '2022-06-12 11:10:05', '2022-07-03 17:36:03');
INSERT INTO `cloud_settings` VALUES (4, 'Web-1', 'contact.one', '2710911512', '2022-06-21 12:33:56', '2022-07-20 20:06:14');
INSERT INTO `cloud_settings` VALUES (5, 'Web-1', 'contact.two', '10001', '2022-06-21 12:33:56', '2022-07-20 20:06:14');
INSERT INTO `cloud_settings` VALUES (6, 'Web-1', 'contact.three', '939576303', '2022-06-21 12:33:56', '2022-07-20 20:06:14');
INSERT INTO `cloud_settings` VALUES (7, 'Web-5', 'site.price', '100.00', '2022-06-21 15:14:49', NULL);
INSERT INTO `cloud_settings` VALUES (8, 'Web-1', 'notice.index', '欢迎使用沉沦云网络全新系统。七年技术沉淀，为您提供精彩绝伦的用户体验。购买服务请认准沉沦云网络产品！', '2022-07-01 12:54:16', '2022-07-01 15:30:28');
INSERT INTO `cloud_settings` VALUES (9, 'Web-1', 'notice.shop', '欢迎使用沉沦云网络全新系统。七年技术沉淀，为您提供精彩绝伦的用户体验。购买服务请认准沉沦云网络产品！', '2022-07-01 12:54:16', '2022-07-01 15:30:38');
INSERT INTO `cloud_settings` VALUES (10, 'Web-1', 'notice.admin', '欢迎使用沉沦云网络全新系统。七年技术沉淀，为您提供精彩绝伦的用户体验。购买服务请认准沉沦云网络产品！', '2022-07-01 12:54:16', '2022-07-01 15:30:50');
INSERT INTO `cloud_settings` VALUES (11, 'Web-1', 'contact.four', 'https://qm.qq.com/cgi-bin/qm/qr?k=6fdOW7D5-n_TM1aeSox44EuyVn2PYAjQ&jump_from=webapi', '2022-07-01 15:23:15', '2022-07-20 20:06:15');

-- ----------------------------
-- Table structure for cloud_users
-- ----------------------------
DROP TABLE IF EXISTS `cloud_users`;
CREATE TABLE `cloud_users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `web_id` int(11) NOT NULL DEFAULT 0 COMMENT '站点ID',
  `account` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户账号',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户密码',
  `nick_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `avatar` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户头像',
  `phone` bigint(32) DEFAULT NULL COMMENT '手机号',
  `email` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户邮箱',
  `money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '用户余额',
  `login_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '登陆token',
  `login_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '登陆IP',
  `login_time` datetime NULL DEFAULT NULL COMMENT '登陆时间',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '用户状态(0:正常/1:封禁)',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`, `web_id`) USING BTREE,
  INDEX `idx_acccount`(`account`) USING BTREE,
  INDEX `idx_webId_account`(`web_id`, `account`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_webId_status`(`web_id`, `status`) USING BTREE,
  INDEX `idx_phone`(`phone`) USING BTREE,
  INDEX `idx_webId_email`(`web_id`, `email`) USING BTREE,
  INDEX `idx_createTime`(`create_time`) USING BTREE,
  INDEX `idx_updateTime`(`update_time`) USING BTREE,
  INDEX `idx_loginTime`(`login_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_users
-- ----------------------------
INSERT INTO `cloud_users` VALUES (1, 1, 'admin', '39316333663265373836626532363066313961633864313561656234353537393438633338653731', '流逝中沉沦', 'https://q1.qlogo.cn/g?b=qq&nk=2710911512&s=100&t=20190225', 18888888888, '2710911512@qq.com', 10000.00, '{\"pc\":\"3f4143c7da5d6434d702ea8c332ebeb1\",\"mobile\":\"\"}', '127.0.0.1', '2022-07-20 20:03:08', 0, '2022-05-29 17:10:47', '2022-07-20 20:05:35');

-- ----------------------------
-- Table structure for cloud_webs
-- ----------------------------
DROP TABLE IF EXISTS `cloud_webs`;
CREATE TABLE `cloud_webs`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '站点ID',
  `user_id` int(11) NOT NULL COMMENT '所属用户ID',
  `web_id` int(11) NOT NULL DEFAULT 0 COMMENT '上级站点ID(0为总站)',
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '网站名称',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '网站标题',
  `keywords` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '网站关键词',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '网站描述',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '状态(0:正常/1:封禁)',
  `expire_time` datetime NULL DEFAULT NULL COMMENT '到期时间',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`, `user_id`, `web_id`) USING BTREE,
  INDEX `idx_webId`(`web_id`) USING BTREE,
  INDEX `idx_userId`(`user_id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_expireTime`(`expire_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cloud_webs
-- ----------------------------
INSERT INTO `cloud_webs` VALUES (1, 1, 0, '沉沦云网络', '沉沦云网络 - 致力于提供稳定快捷的云端一体化服务', '沉沦云网络,沉沦云', '沉沦云网络致力于提供稳定快捷的云端一体化服务。', 0, '2099-12-31 00:00:00', '2022-05-30 16:03:58', '2022-07-12 11:47:42');

SET FOREIGN_KEY_CHECKS = 1;
