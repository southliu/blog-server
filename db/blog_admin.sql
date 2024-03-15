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

 Date: 15/03/2024 16:04:45
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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of categories
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of menus
-- ----------------------------
INSERT INTO `menus` VALUES (1, '系统管理', NULL, NULL, 1, 1, 0, '2024-03-15 07:32:24.965505', '2024-03-15 07:32:24.965505', NULL);
INSERT INTO `menus` VALUES (2, '菜单管理', '/systems/menu', NULL, 1, 1, 1, '2024-03-15 07:32:24.971995', '2024-03-15 08:04:38.227533', 1);
INSERT INTO `menus` VALUES (3, '菜单管理-查看', NULL, NULL, 1, 1, 2, '2024-03-15 07:32:24.975106', '2024-03-15 07:32:24.975106', 2);
INSERT INTO `menus` VALUES (4, '菜单管理-新增', NULL, NULL, 2, 1, 2, '2024-03-15 07:32:24.977774', '2024-03-15 07:32:24.977774', 2);
INSERT INTO `menus` VALUES (5, '菜单管理-编辑', NULL, NULL, 3, 1, 2, '2024-03-15 07:32:24.982261', '2024-03-15 07:33:35.444238', 2);
INSERT INTO `menus` VALUES (6, '菜单管理-删除', NULL, NULL, 4, 1, 2, '2024-03-15 07:33:50.204623', '2024-03-15 07:33:56.898357', 2);
INSERT INTO `menus` VALUES (7, '用户管理', '/systems/user', NULL, 2, 1, 1, '2024-03-15 07:35:37.129126', '2024-03-15 07:35:37.129126', 1);
INSERT INTO `menus` VALUES (8, '用户管理-查看', NULL, NULL, 1, 1, 2, '2024-03-15 07:35:41.055050', '2024-03-15 07:35:41.055050', 7);
INSERT INTO `menus` VALUES (9, '用户管理-新增', NULL, NULL, 2, 1, 2, '2024-03-15 07:35:41.061830', '2024-03-15 07:35:41.061830', 7);
INSERT INTO `menus` VALUES (10, '用户管理-删除', NULL, NULL, 4, 1, 2, '2024-03-15 07:35:41.305983', '2024-03-15 07:35:41.305983', 7);
INSERT INTO `menus` VALUES (11, '用户管理-编辑', NULL, NULL, 3, 1, 2, '2024-03-15 07:35:41.345328', '2024-03-15 07:35:41.345328', 7);
INSERT INTO `menus` VALUES (12, '角色管理', '/systems/role', NULL, 3, 1, 1, '2024-03-15 07:51:47.281191', '2024-03-15 07:51:47.281191', 1);

-- ----------------------------
-- Table structure for permission_menus
-- ----------------------------
DROP TABLE IF EXISTS `permission_menus`;
CREATE TABLE `permission_menus`  (
  `permissionsId` int NOT NULL,
  `menusId` int NOT NULL,
  PRIMARY KEY (`permissionsId`, `menusId`) USING BTREE,
  INDEX `IDX_9c03c752de6b6b0bc0ce4c6624`(`permissionsId` ASC) USING BTREE,
  INDEX `IDX_58b2da4403ef55c967a37227f0`(`menusId` ASC) USING BTREE,
  CONSTRAINT `FK_58b2da4403ef55c967a37227f00` FOREIGN KEY (`menusId`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_9c03c752de6b6b0bc0ce4c66248` FOREIGN KEY (`permissionsId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of permission_menus
-- ----------------------------
INSERT INTO `permission_menus` VALUES (1, 1);
INSERT INTO `permission_menus` VALUES (2, 2);
INSERT INTO `permission_menus` VALUES (3, 3);
INSERT INTO `permission_menus` VALUES (4, 4);
INSERT INTO `permission_menus` VALUES (5, 5);
INSERT INTO `permission_menus` VALUES (6, 6);
INSERT INTO `permission_menus` VALUES (7, 7);
INSERT INTO `permission_menus` VALUES (8, 9);
INSERT INTO `permission_menus` VALUES (9, 8);
INSERT INTO `permission_menus` VALUES (10, 10);
INSERT INTO `permission_menus` VALUES (11, 11);
INSERT INTO `permission_menus` VALUES (12, 12);

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限代码',
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限描述',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES (1, '/system', '系统管理权限');
INSERT INTO `permissions` VALUES (2, '/system/menu', '菜单管理权限');
INSERT INTO `permissions` VALUES (3, '/system/menu/index', '查看菜单权限');
INSERT INTO `permissions` VALUES (4, '/system/menu/create', '新增菜单权限');
INSERT INTO `permissions` VALUES (5, '/system/menu/update', '编辑菜单权限');
INSERT INTO `permissions` VALUES (6, '/system/menu/delete', '删除菜单权限');
INSERT INTO `permissions` VALUES (7, '/system/user', '用户管理');
INSERT INTO `permissions` VALUES (8, '/system/user/create', '用户管理-新增');
INSERT INTO `permissions` VALUES (9, '/system/user/index', '用户管理-查看');
INSERT INTO `permissions` VALUES (10, '/system/user/delete', '用户管理-删除');
INSERT INTO `permissions` VALUES (11, '/system/user/update', '用户管理-编辑');
INSERT INTO `permissions` VALUES (12, '/system/role', '角色管理');

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role_permissions
-- ----------------------------
INSERT INTO `role_permissions` VALUES (2, 1);
INSERT INTO `role_permissions` VALUES (2, 2);
INSERT INTO `role_permissions` VALUES (2, 3);
INSERT INTO `role_permissions` VALUES (2, 4);
INSERT INTO `role_permissions` VALUES (2, 5);
INSERT INTO `role_permissions` VALUES (2, 6);
INSERT INTO `role_permissions` VALUES (2, 7);
INSERT INTO `role_permissions` VALUES (2, 8);
INSERT INTO `role_permissions` VALUES (2, 9);
INSERT INTO `role_permissions` VALUES (2, 10);
INSERT INTO `role_permissions` VALUES (2, 11);
INSERT INTO `role_permissions` VALUES (2, 12);

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'south', '9afd596f2c7f7284172d1ffd76a58211', '管理员', 'xxx@xx.com', NULL, NULL, 0, 1, '2024-03-15 07:32:25.080778', '2024-03-15 07:32:25.080778');
INSERT INTO `users` VALUES (2, 'admin', 'a66abb5684c45962d887564f08346e8d', '游客-south', 'yy@yy.com', NULL, NULL, 0, 0, '2024-03-15 07:32:25.117086', '2024-03-15 07:32:25.117086');

SET FOREIGN_KEY_CHECKS = 1;
