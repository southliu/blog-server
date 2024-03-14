/*
 Navicat Premium Data Transfer

 Source Server         : unbantu
 Source Server Type    : MySQL
 Source Server Version : 80300
 Source Host           : 192.168.17.129:3308
 Source Schema         : blog_admin

 Target Server Type    : MySQL
 Target Server Version : 80300
 File Encoding         : 65001

 Date: 13/03/2024 18:01:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标题',
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '内容',
  `visit` int NOT NULL COMMENT '阅读量',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `categoriesId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_5865779c2e358ad9107f962ff03`(`categoriesId` ASC) USING BTREE,
  CONSTRAINT `FK_5865779c2e358ad9107f962ff03` FOREIGN KEY (`categoriesId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of articles
-- ----------------------------

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名称',
  `icon` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图标',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------

-- ----------------------------
-- Table structure for menu_permissions
-- ----------------------------
DROP TABLE IF EXISTS `menu_permissions`;
CREATE TABLE `menu_permissions`  (
  `menusId` int NOT NULL,
  `permissionsId` int NOT NULL,
  PRIMARY KEY (`menusId`, `permissionsId`) USING BTREE,
  INDEX `IDX_b1834cf7746ecd1de0dcc23f6f`(`menusId` ASC) USING BTREE,
  INDEX `IDX_0002a83d46981f19337d2ea13e`(`permissionsId` ASC) USING BTREE,
  CONSTRAINT `FK_0002a83d46981f19337d2ea13e0` FOREIGN KEY (`permissionsId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_b1834cf7746ecd1de0dcc23f6f7` FOREIGN KEY (`menusId`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu_permissions
-- ----------------------------
INSERT INTO `menu_permissions` VALUES (1, 1);
INSERT INTO `menu_permissions` VALUES (2, 2);
INSERT INTO `menu_permissions` VALUES (3, 3);
INSERT INTO `menu_permissions` VALUES (4, 4);
INSERT INTO `menu_permissions` VALUES (5, 5);
INSERT INTO `menu_permissions` VALUES (7, 7);

-- ----------------------------
-- Table structure for menus
-- ----------------------------
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '菜单名',
  `route` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '路由',
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图标',
  `sortNum` int NOT NULL COMMENT '排序',
  `enable` tinyint NULL DEFAULT 1 COMMENT '是否启用',
  `type` int NOT NULL COMMENT '类型: 0—目录 1—菜单 2—按钮',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `parentId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_8523e13f1ba719e16eb474657ec`(`parentId` ASC) USING BTREE,
  CONSTRAINT `FK_8523e13f1ba719e16eb474657ec` FOREIGN KEY (`parentId`) REFERENCES `menus` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menus
-- ----------------------------
INSERT INTO `menus` VALUES (1, '系统管理', NULL, NULL, 1, 1, 0, '2024-03-13 06:17:22.396804', '2024-03-13 06:17:22.396804', NULL);
INSERT INTO `menus` VALUES (2, '菜单管理', '/system/menu', NULL, 1, 1, 1, '2024-03-13 06:17:22.502031', '2024-03-13 06:17:22.502031', 1);
INSERT INTO `menus` VALUES (3, '菜单管理-查看', NULL, NULL, 1, 1, 2, '2024-03-13 06:17:22.507307', '2024-03-13 06:17:22.507307', 2);
INSERT INTO `menus` VALUES (4, '菜单管理-新增', NULL, NULL, 2, 1, 2, '2024-03-13 06:17:22.528171', '2024-03-13 06:17:22.528171', 2);
INSERT INTO `menus` VALUES (5, '菜单管理-修改', NULL, NULL, 2, 1, 2, '2024-03-13 07:10:56.375057', '2024-03-13 09:58:00.000000', 2);
INSERT INTO `menus` VALUES (7, '菜单管理-删除', NULL, NULL, 4, 1, 2, '2024-03-13 07:27:37.821975', '2024-03-13 09:57:56.000000', 2);

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限代码',
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限描述',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES (1, '/system', '系统管理权限');
INSERT INTO `permissions` VALUES (2, '/system/menu', '菜单管理权限');
INSERT INTO `permissions` VALUES (3, '/system/menu/index', '查看菜单权限');
INSERT INTO `permissions` VALUES (4, '/system/menu/create', '新增菜单权限');
INSERT INTO `permissions` VALUES (5, '/system/menu/update', '修改');
INSERT INTO `permissions` VALUES (6, '1234', '123');
INSERT INTO `permissions` VALUES (7, '/system/menu/delete', '删除');
INSERT INTO `permissions` VALUES (8, 'test', 'test');

-- ----------------------------
-- Table structure for role_permissions
-- ----------------------------
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions`  (
  `rolesId` int NOT NULL,
  `permissionsId` int NOT NULL,
  PRIMARY KEY (`rolesId`, `permissionsId`) USING BTREE,
  INDEX `IDX_0cb93c5877d37e954e2aa59e52`(`rolesId` ASC) USING BTREE,
  INDEX `IDX_d422dabc78ff74a8dab6583da0`(`permissionsId` ASC) USING BTREE,
  CONSTRAINT `FK_0cb93c5877d37e954e2aa59e52c` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_d422dabc78ff74a8dab6583da02` FOREIGN KEY (`permissionsId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_permissions
-- ----------------------------
INSERT INTO `role_permissions` VALUES (1, 1);
INSERT INTO `role_permissions` VALUES (1, 2);
INSERT INTO `role_permissions` VALUES (1, 3);
INSERT INTO `role_permissions` VALUES (1, 4);
INSERT INTO `role_permissions` VALUES (2, 1);
INSERT INTO `role_permissions` VALUES (2, 2);
INSERT INTO `role_permissions` VALUES (2, 3);
INSERT INTO `role_permissions` VALUES (2, 4);
INSERT INTO `role_permissions` VALUES (2, 5);
INSERT INTO `role_permissions` VALUES (2, 6);
INSERT INTO `role_permissions` VALUES (2, 7);
INSERT INTO `role_permissions` VALUES (2, 8);

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, '管理员');
INSERT INTO `roles` VALUES (2, '普通用户');

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles`  (
  `usersId` int NOT NULL,
  `rolesId` int NOT NULL,
  PRIMARY KEY (`usersId`, `rolesId`) USING BTREE,
  INDEX `IDX_99b019339f52c63ae615358738`(`usersId` ASC) USING BTREE,
  INDEX `IDX_13380e7efec83468d73fc37938`(`rolesId` ASC) USING BTREE,
  CONSTRAINT `FK_13380e7efec83468d73fc37938e` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_99b019339f52c63ae6153587380` FOREIGN KEY (`usersId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES (1, 1);
INSERT INTO `user_roles` VALUES (2, 2);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `nick_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '昵称',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱',
  `avatar` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `isFrozen` tinyint NOT NULL DEFAULT 0 COMMENT '是否冻结',
  `isAdmin` tinyint NOT NULL DEFAULT 0 COMMENT '是否是管理员',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'south', '9afd596f2c7f7284172d1ffd76a58211', '管理员', 'xxx@xx.com', NULL, NULL, 0, 1, '2024-03-13 06:17:22.710280', '2024-03-13 06:17:22.710280');
INSERT INTO `users` VALUES (2, 'admin', 'a66abb5684c45962d887564f08346e8d', '游客-south', 'yy@yy.com', NULL, NULL, 0, 0, '2024-03-13 06:17:22.772069', '2024-03-13 06:17:22.772069');

SET FOREIGN_KEY_CHECKS = 1;
