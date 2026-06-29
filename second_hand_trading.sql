CREATE DATABASE IF NOT EXISTS `second_hand_trading` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
USE `second_hand_trading`;
/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 90500 (9.5.0)
 Source Host           : localhost:3306
 Source Schema         : second_hand_trading

 Target Server Type    : MySQL
 Target Server Version : 90500 (9.5.0)
 File Encoding         : 65001

 Date: 05/01/2026 11:36:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sh_address
-- ----------------------------
DROP TABLE IF EXISTS `sh_address`;
CREATE TABLE `sh_address`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `consignee_name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '收货人姓名',
  `consignee_phone` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '收货人手机号',
  `province_name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '省',
  `city_name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '市',
  `region_name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '区',
  `detail_address` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '详细地址',
  `default_flag` tinyint NOT NULL COMMENT '是否默认地址',
  `user_id` bigint NOT NULL COMMENT '用户主键id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id_index`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '地址表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sh_address
-- ----------------------------
INSERT INTO `sh_address` VALUES (41, '1', '1', '男生宿舍', '10号楼', '二层', '1', 1, 37);
INSERT INTO `sh_address` VALUES (42, '2', '2', '男生宿舍', '10号楼', '二层', '2', 1, 39);

-- ----------------------------
-- Table structure for sh_admin
-- ----------------------------
DROP TABLE IF EXISTS `sh_admin`;
CREATE TABLE `sh_admin`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `account_number` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '管理员账号',
  `admin_password` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '密码',
  `admin_name` varchar(8) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '管理员名字',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `account_number`(`account_number` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '管理员表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sh_admin
-- ----------------------------
INSERT INTO `sh_admin` VALUES (1, 'admin', '123456', '管理员');

-- ----------------------------
-- Table structure for sh_favorite
-- ----------------------------
DROP TABLE IF EXISTS `sh_favorite`;
CREATE TABLE `sh_favorite`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增主键id',
  `create_time` datetime NOT NULL COMMENT '加入收藏的时间',
  `user_id` bigint NOT NULL COMMENT '用户主键id',
  `idle_id` bigint NOT NULL COMMENT '闲置物主键id',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC, `idle_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 68 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '收藏信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sh_favorite
-- ----------------------------
INSERT INTO `sh_favorite` VALUES (67, '2026-01-05 03:16:03', 36, 196);

-- ----------------------------
-- Table structure for sh_idle_item
-- ----------------------------
DROP TABLE IF EXISTS `sh_idle_item`;
CREATE TABLE `sh_idle_item`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `idle_name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '闲置物名称',
  `idle_details` varchar(2048) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '详情',
  `picture_list` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '图集',
  `idle_price` decimal(10, 2) NOT NULL COMMENT '价格',
  `idle_place` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '发货地区',
  `idle_label` int NOT NULL COMMENT '分类标签',
  `release_time` datetime NOT NULL COMMENT '发布时间',
  `idle_status` tinyint NOT NULL COMMENT '状态（发布1、下架2、删除0）',
  `user_id` bigint NOT NULL COMMENT '用户主键id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id_index`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 207 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '二手商品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sh_idle_item
-- ----------------------------
INSERT INTO `sh_idle_item` VALUES (194, '冰糖', '老甜了', '[\"http://localhost:8080/image?imageName=file17675827375361003file17669917636351005OIP-C.webp\"]', 5.00, '8号楼', 2, '2026-01-05 03:12:19', 1, 45);
INSERT INTO `sh_idle_item` VALUES (195, '神光棒', '随时变身迪迦', '[\"http://localhost:8080/image?imageName=file17675828231751005file17667381208961002OIP-C.jpg\"]', 10000000.00, '10号楼', 3, '2026-01-05 03:13:47', 1, 44);
INSERT INTO `sh_idle_item` VALUES (196, '光', '把小时候借的光还给你们', '[\"http://localhost:8080/image?imageName=file17675829204381006file17667387259741007OIP-C (2).jpg\"]', 10000000.00, '10号楼', 2, '2026-01-05 03:15:22', 1, 44);
INSERT INTO `sh_idle_item` VALUES (197, '平板电脑', '考研用', '[\"http://localhost:8080/image?imageName=file17675830423901009file16518892088571015131232.jpg\"]', 500.00, '12号楼', 1, '2026-01-05 03:18:50', 1, 36);
INSERT INTO `sh_idle_item` VALUES (198, '二手手机', '嘎嘎好用', '[\"http://localhost:8080/image?imageName=file17675831818511010file1645691490496100431.jpg\"]', 888.00, '13号楼', 1, '2026-01-05 03:19:43', 2, 36);
INSERT INTO `sh_idle_item` VALUES (199, '二手书', '给钱就出', '[\"http://localhost:8080/image?imageName=file17675832179311011file16518885783071010书234asdf.jfif\"]', 5.00, '11号楼', 4, '2026-01-05 03:20:22', 1, 36);
INSERT INTO `sh_idle_item` VALUES (200, '健身用品', '便宜处理', '[\"http://localhost:8080/image?imageName=file17675834362191017file16524424818461002src=http___s.xcditu.com_trash_20190701_20191107102718606.jpg&refer=http___s.xcditu.jfif\"]', 50.00, '11号楼', 3, '2026-01-05 03:23:58', 2, 37);
INSERT INTO `sh_idle_item` VALUES (201, '一个球', '嘎嘎好史', '[\"http://localhost:8080/image?imageName=file17675836972361022file16524427826181006165165.jpg\"]', 50.00, '7号楼', 3, '2026-01-05 03:28:40', 1, 39);
INSERT INTO `sh_idle_item` VALUES (202, '求计算机科学课本二手书', '如题', '[\"http://localhost:8080/image?imageName=file17675837777881023file16476923799031002书.jpg\"]', 0.00, '8号楼', 5, '2026-01-05 03:29:39', 1, 39);
INSERT INTO `sh_idle_item` VALUES (203, '二手课本', '给钱就出', '[\"http://localhost:8080/image?imageName=file17675838371331024file16469098588471018书53.jpg\"]', 10.00, '10号楼', 4, '2026-01-05 03:30:38', 1, 37);
INSERT INTO `sh_idle_item` VALUES (204, '运动器材', '羽毛球拍', '[\"http://localhost:8080/image?imageName=file17675838613821025file16524848854481007f.jpg\"]', 5.00, '11号楼', 3, '2026-01-05 03:31:24', 1, 37);
INSERT INTO `sh_idle_item` VALUES (206, '桶', '嘎嘎好使', '[\"http://localhost:8080/image?imageName=file17675840288681027file165248474214510061685456.jpg\"]', 5.00, '11号楼', 2, '2026-01-05 03:34:11', 2, 36);

-- ----------------------------
-- Table structure for sh_message
-- ----------------------------
DROP TABLE IF EXISTS `sh_message`;
CREATE TABLE `sh_message`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `user_id` bigint NOT NULL COMMENT '用户主键id',
  `idle_id` bigint NOT NULL COMMENT '闲置主键id',
  `content` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '留言内容',
  `create_time` datetime NOT NULL COMMENT '留言时间',
  `to_user` bigint NOT NULL COMMENT '所回复的用户',
  `to_message` bigint NULL DEFAULT NULL COMMENT '所回复的留言',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id_index`(`user_id` ASC) USING BTREE,
  INDEX `idle_id_index`(`idle_id` ASC) USING BTREE,
  INDEX `to_user_index`(`to_user` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 62 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '留言表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sh_message
-- ----------------------------
INSERT INTO `sh_message` VALUES (60, 36, 196, '我去，果真吗', '2026-01-05 03:16:13', 44, NULL);
INSERT INTO `sh_message` VALUES (61, 37, 196, '想要', '2026-01-05 03:21:46', 44, NULL);

-- ----------------------------
-- Table structure for sh_order
-- ----------------------------
DROP TABLE IF EXISTS `sh_order`;
CREATE TABLE `sh_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `order_number` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '订单编号',
  `user_id` bigint NOT NULL COMMENT '用户主键id',
  `idle_id` bigint NOT NULL COMMENT '闲置物品主键id',
  `order_price` decimal(10, 2) NOT NULL COMMENT '订单总价',
  `payment_status` tinyint NOT NULL COMMENT '支付状态',
  `payment_way` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '支付方式',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `payment_time` datetime NULL DEFAULT NULL COMMENT '支付时间',
  `order_status` tinyint NOT NULL COMMENT '订单状态',
  `is_deleted` tinyint NULL DEFAULT NULL COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 151 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sh_order
-- ----------------------------
INSERT INTO `sh_order` VALUES (148, '176758331599410002', 37, 198, 888.00, 1, '支付宝', '2026-01-05 03:21:56', '2026-01-05 03:22:33', 1, NULL);
INSERT INTO `sh_order` VALUES (149, '176758361246810003', 39, 200, 50.00, 1, '支付宝', '2026-01-05 03:26:52', '2026-01-05 03:35:38', 1, NULL);
INSERT INTO `sh_order` VALUES (150, '176758408705210004', 39, 206, 5.00, 0, NULL, '2026-01-05 03:34:47', NULL, 0, NULL);

-- ----------------------------
-- Table structure for sh_order_address
-- ----------------------------
DROP TABLE IF EXISTS `sh_order_address`;
CREATE TABLE `sh_order_address`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `order_id` bigint NOT NULL COMMENT '订单id',
  `consignee_name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '收货人',
  `consignee_phone` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '电话',
  `detail_address` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '收货地址',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `orderId`(`order_id` ASC) USING BTREE,
  INDEX `order_id_index`(`order_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 131 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '订单地址表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sh_order_address
-- ----------------------------
INSERT INTO `sh_order_address` VALUES (129, 148, '1', '1', '男生宿舍10号楼二层1');
INSERT INTO `sh_order_address` VALUES (130, 149, '2', '2', '男生宿舍10号楼二层2');

-- ----------------------------
-- Table structure for sh_user
-- ----------------------------
DROP TABLE IF EXISTS `sh_user`;
CREATE TABLE `sh_user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `account_number` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '账号（手机号）',
  `user_password` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '登录密码',
  `nickname` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '昵称',
  `avatar` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '头像',
  `sign_in_time` datetime NOT NULL COMMENT '注册时间',
  `user_status` tinyint NULL DEFAULT NULL COMMENT '状态（1代表封禁）',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `account_number`(`account_number` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sh_user
-- ----------------------------
INSERT INTO `sh_user` VALUES (36, '13333333333', '123456', '小新', 'http://localhost:8080/image?imageName=file17675829540501007file17670730477371002OIP-C (1).webp', '2025-03-11 00:53:55', 0);
INSERT INTO `sh_user` VALUES (37, '18888888888', '123456', '小星', 'http://localhost:8080/image?imageName=file17675832928041012file17244068126871004OIP-C.jpg', '2025-02-25 11:20:58', 0);
INSERT INTO `sh_user` VALUES (39, '17777777777', '123456', '小恐龙', 'http://localhost:8080/image?imageName=file17675836706161021file17668055189431003OIP-C.webp', '2025-02-24 08:43:04', 0);
INSERT INTO `sh_user` VALUES (44, '66666666666', '123456', '大古', 'http://localhost:8080/image?imageName=file17675827744091004file17668055282491005OIP-C (1).jpg', '2025-12-26 08:33:54', 0);
INSERT INTO `sh_user` VALUES (45, '55555555555', '123456', '卖冰糖的', 'http://localhost:8080/image?imageName=file17675826915491002file17669916957651004OIP-C.webp', '2025-12-29 06:56:45', 0);

SET FOREIGN_KEY_CHECKS = 1;
