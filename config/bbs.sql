/*
 Navicat Premium Data Transfer

 Source Server         : localmysql
 Source Server Type    : MySQL
 Source Server Version : 80013
 Source Host           : localhost:3306
 Source Schema         : club

 Target Server Type    : MySQL
 Target Server Version : 80013
 File Encoding         : 65001

 Date: 04/04/2019 17:01:59
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for answer
-- ----------------------------
DROP TABLE IF EXISTS `answer`;
CREATE TABLE `answer` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '回复内容',
  `atime` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `afavor` int(11) unsigned zerofill DEFAULT '00000000000',
  PRIMARY KEY (`aid`),
  KEY `pid` (`pid`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of answer
-- ----------------------------
BEGIN;
INSERT INTO `answer` VALUES (1, 1, 10002, '<p>2222</p>', '2019-04-03 22:51:44', 00000000000);
INSERT INTO `answer` VALUES (2, 1, 10002, '<p>123</p>', '2019-04-03 22:51:54', 00000000000);
INSERT INTO `answer` VALUES (3, 1, 10002, '<p>12323</p>', '2019-04-03 22:52:13', 00000000000);
COMMIT;

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `postname` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `publishtime` timestamp NOT NULL COMMENT '发布时间',
  `lasttime` timestamp NOT NULL COMMENT '最新更新时间',
  `uid` int(11) NOT NULL,
  `topic` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '帖子主题',
  `type` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '帖子类型',
  `pcontent` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '内容',
  `visits` int(11) unsigned zerofill DEFAULT '00000000000' COMMENT '访问量',
  `reply` int(11) unsigned zerofill DEFAULT '00000000000' COMMENT '回复量',
  `pfavor` int(11) unsigned zerofill DEFAULT '00000000000' COMMENT '点赞量',
  PRIMARY KEY (`pid`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of post
-- ----------------------------
BEGIN;
INSERT INTO `post` VALUES (1, '1111', '2019-04-03 22:51:25', '2019-04-03 22:51:25', 10002, '1111', NULL, '<p>1111</p>', 00000000005, 00000000003, 00000000000);
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `mail` varchar(255) NOT NULL,
  `username` varchar(144) NOT NULL,
  `password` varchar(255) NOT NULL,
  `utime` timestamp NOT NULL COMMENT '注册时间',
  `state` varchar(255) DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `sign` longtext COMMENT '签名',
  `pic` longtext COMMENT '头像',
  PRIMARY KEY (`uid`,`mail`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=10003 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (10001, 'test@qq.com', 'test', '123456', '2018-06-03 15:32:33', '0', 'M', '杭州', 'HELLO', NULL);
INSERT INTO `user` VALUES (10002, '111@tt.com', '111', 'e10adc3949ba59abbe56e057f20f883e', '2019-04-03 22:47:59', NULL, NULL, NULL, NULL, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
