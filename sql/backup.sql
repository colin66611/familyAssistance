-- MySQL dump 10.13  Distrib 9.0.1, for macos14.4 (x86_64)
--
-- Host: localhost    Database: chatgpt
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `action`
--

DROP TABLE IF EXISTS `action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `action` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `describe` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action`
--

LOCK TABLES `action` WRITE;
/*!40000 ALTER TABLE `action` DISABLE KEYS */;
INSERT INTO `action` VALUES (61836466648608768,61833690208014336,'reset_password','重置密码密码','113.87.180.24','2023-06-20 15:16:02','2023-06-20 15:16:02'),(61836584022011904,61833690208014336,'login','登录页面','113.87.180.24','2023-06-20 15:16:30','2023-06-20 15:16:30'),(61872179196817408,61833690208014336,'login','登录页面','185.212.58.224','2023-06-20 17:37:57','2023-06-20 17:37:57'),(61873819140321280,61833690208014336,'login','登录页面','185.212.58.224','2023-06-20 17:44:28','2023-06-20 17:44:28'),(61874828944175104,61833690208014336,'login','登录页面','185.212.58.224','2023-06-20 17:48:28','2023-06-20 17:48:28'),(61875196939825152,61833690208014336,'chat','对话(gpt-4)','185.212.58.224','2023-06-20 17:49:56','2023-06-20 17:49:56'),(231761476862439424,231756109021450240,'signin','签到','127.0.0.1','2024-10-01 12:57:22','2024-10-01 12:57:22'),(235405919599554560,231756109021450240,'login','登录页面','127.0.0.1','2024-10-11 14:19:04','2024-10-11 14:19:04'),(235439390497796096,231756109021450240,'signin','签到','127.0.0.1','2024-10-11 16:32:04','2024-10-11 16:32:04'),(235458330624094208,231756109021450240,'login','登录页面','127.0.0.1','2024-10-11 17:47:20','2024-10-11 17:47:20'),(235469224783474688,231756109021450240,'chat','对话(gpt-3.5-turbo)','127.0.0.1','2024-10-11 18:30:38','2024-10-11 18:30:38'),(235469335173361664,231756109021450240,'chat','对话(gpt-3.5-turbo)','127.0.0.1','2024-10-11 18:31:04','2024-10-11 18:31:04'),(235469364072116224,231756109021450240,'chat','对话(gpt-3.5-turbo)','127.0.0.1','2024-10-11 18:31:11','2024-10-11 18:31:11'),(235539339860340736,231756109021450240,'chat','对话(gpt-3.5-turbo)','127.0.0.1','2024-10-11 23:09:14','2024-10-11 23:09:14'),(235539358764068864,231756109021450240,'chat','对话(gpt-3.5-turbo)','127.0.0.1','2024-10-11 23:09:19','2024-10-11 23:09:19'),(235539373897117696,231756109021450240,'chat','对话(gpt-3.5-turbo)','127.0.0.1','2024-10-11 23:09:22','2024-10-11 23:09:22'),(235541720849281024,231756109021450240,'chat','对话(gpt-3.5-turbo)','127.0.0.1','2024-10-11 23:18:42','2024-10-11 23:18:42');
/*!40000 ALTER TABLE `action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carmi`
--

DROP TABLE IF EXISTS `carmi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carmi` (
  `id` bigint unsigned NOT NULL,
  `ip` varchar(255) DEFAULT NULL COMMENT '使用时候的ip',
  `user_id` bigint DEFAULT NULL COMMENT '使用者',
  `key` varchar(255) NOT NULL COMMENT '卡密',
  `value` varchar(255) NOT NULL COMMENT '积分',
  `status` int NOT NULL DEFAULT '0' COMMENT '0有效 1使用 2过期',
  `type` varchar(255) NOT NULL COMMENT '类型',
  `end_time` varchar(255) DEFAULT NULL COMMENT '截止时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `level` int DEFAULT NULL COMMENT '卡密充值等级',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carmi`
--

LOCK TABLES `carmi` WRITE;
/*!40000 ALTER TABLE `carmi` DISABLE KEYS */;
/*!40000 ALTER TABLE `carmi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `value` varchar(255) DEFAULT '',
  `remarks` varchar(255) DEFAULT '',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config`
--

LOCK TABLES `config` WRITE;
/*!40000 ALTER TABLE `config` DISABLE KEYS */;
INSERT INTO `config` VALUES (1,'signin_reward','100','签到奖励','2023-05-19 16:21:12','2023-05-25 11:01:00'),(2,'register_reward','100','注册奖励','2023-05-19 16:21:49','2023-05-26 21:49:49'),(3,'history_message_count','10','携带历史聊天数量','2023-05-21 14:57:37','2023-06-20 17:43:28'),(4,'ai3_ratio','50','3版本比例 每1积分等于多少token','2023-05-25 16:40:18','2024-10-11 23:07:00'),(5,'ai4_ratio','1','4版本比例 每1积分等于多少token','2023-05-25 16:40:20','2024-10-11 23:07:15'),(6,'draw_use_price','[{\"size\":\"256x256\",\"integral\":100},{\"size\":\"512x512\",\"integral\":120},{\"size\":\"1024x1024\",\"integral\":150}]','绘画价格 ','2023-05-25 16:58:26','2023-05-26 21:49:43'),(7,'shop_introduce','','商城介绍','2023-05-29 11:51:39','2023-05-29 17:33:15'),(8,'user_introduce','','用户中心介绍','2023-05-29 11:52:07','2023-05-29 17:33:16');
/*!40000 ALTER TABLE `config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` bigint unsigned NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `content` text,
  `role` varchar(255) DEFAULT NULL,
  `frequency_penalty` int DEFAULT NULL,
  `max_tokens` int DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `presence_penalty` int DEFAULT NULL,
  `temperature` int DEFAULT NULL,
  `parent_message_id` varchar(255) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (61875180560977920,61833690208014336,'你好啊','user',0,1888,'gpt-4',0,0,'8109d1c1-6e20-45a2-ab8b-05c147c6a8f2',1,'2023-06-20 17:49:56','2023-06-20 17:49:56'),(61875180560982016,61833690208014336,'你好！很高兴和你交流。有什么问题我可以帮助你解答吗？','assistant',0,1888,'gpt-4',0,0,'8109d1c1-6e20-45a2-ab8b-05c147c6a8f2',1,'2023-06-20 17:49:56','2023-06-20 17:49:56'),(235469223659311104,231756109021450240,'nihao test','user',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 18:30:37','2024-10-11 18:30:37'),(235469223659315200,231756109021450240,'Hello! How can I assist you today?','assistant',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 18:30:37','2024-10-11 18:30:37'),(235469334237941760,231756109021450240,'我想让你充当 Linux 终端。我将输入命令，您将回复终端应显示的内容。我希望您只在一个唯一的代码块内回复终端输出，而不是其他任何内容。不要写解释。除非我指示您这样做，否则不要键入命令。当我需要用英语告诉你一些事情时，我会把文字放在中括号内[就像这样]。我的第一个命令是 pwd\n','user',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 18:31:04','2024-10-11 18:31:04'),(235469334237945856,231756109021450240,'```bash\n/home/user\n```','assistant',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 18:31:04','2024-10-11 18:31:04'),(235469362708881408,231756109021450240,'```bash\nDesktop   Documents   Downloads\n```','assistant',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 18:31:11','2024-10-11 18:31:11'),(235469362713071616,231756109021450240,'ls','user',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 18:31:11','2024-10-11 18:31:11'),(235539339008806912,231756109021450240,'我想让你充当 Linux 终端。我将输入命令，您将回复终端应显示的内容。我希望您只在一个唯一的代码块内回复终端输出，而不是其他任何内容。不要写解释。除非我指示您这样做，否则不要键入命令。当我需要用英语告诉你一些事情时，我会把文字放在中括号内[就像这样]。我的第一个命令是 pwd\n','user',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 23:09:14','2024-10-11 23:09:14'),(235539339008811008,231756109021450240,'```bash\n/home/user\n```','assistant',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 23:09:14','2024-10-11 23:09:14'),(235539357769928704,231756109021450240,'pwd','user',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 23:09:19','2024-10-11 23:09:19'),(235539357769932800,231756109021450240,'```bash\n/home/user\n```','assistant',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 23:09:19','2024-10-11 23:09:19'),(235539373368545280,231756109021450240,'ls','user',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 23:09:22','2024-10-11 23:09:22'),(235539373368549376,231756109021450240,'```bash\nDesktop   Documents   Downloads\n```','assistant',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 23:09:22','2024-10-11 23:09:22'),(235541719704145920,231756109021450240,'我想让你担任Android开发工程师面试官。我将成为候选人，您将向我询问Android开发工程师职位的面试问题。我希望你只作为面试官回答。不要一次写出所有的问题。我希望你只对我进行采访。问我问题，等待我的回答。不要写解释。像面试官一样一个一个问我，等我回答。我的第一句话是“面试官你好”\n','user',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 23:18:42','2024-10-11 23:18:42'),(235541719704150016,231756109021450240,'你好，请介绍一下你在Android开发方面的经验。','assistant',0,2000,'gpt-3.5-turbo',0,0,'6c70367e-01ab-4931-a24c-435610cf49ea',1,'2024-10-11 23:18:42','2024-10-11 23:18:42');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  `content` text NOT NULL COMMENT '内容',
  `sort` int DEFAULT '1',
  `status` int DEFAULT NULL COMMENT '状态',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53897947229720577 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` bigint NOT NULL,
  `trade_no` varchar(255) DEFAULT NULL COMMENT '支付方订单ID',
  `pay_type` varchar(255) DEFAULT NULL COMMENT '支付方式 wxpay alipay',
  `product_id` bigint DEFAULT NULL COMMENT '商品产品id',
  `trade_status` varchar(255) DEFAULT NULL COMMENT '支付状态',
  `user_id` varchar(255) DEFAULT NULL COMMENT '用户ID',
  `product_info` text COMMENT '商品信息快照',
  `channel` varchar(255) DEFAULT NULL COMMENT '渠道号',
  `payment_id` bigint DEFAULT NULL COMMENT '支付产品ID',
  `payment_info` text COMMENT '支付产品信息',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `money` double DEFAULT NULL COMMENT '支付金额',
  `params` text COMMENT '拓展参数',
  `ip` varchar(255) DEFAULT NULL,
  `notify_info` text COMMENT '通知回来的全部信息',
  `pay_url` varchar(255) DEFAULT NULL COMMENT '支付URL',
  `product_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` bigint NOT NULL,
  `name` varchar(255) NOT NULL COMMENT '名称',
  `channel` varchar(255) NOT NULL DEFAULT '' COMMENT '标识 支付宝 微信 易支付 码支付',
  `types` varchar(255) DEFAULT NULL COMMENT '[''ailipay'',''wxpay'']',
  `params` text COMMENT '支付所需参数',
  `status` int NOT NULL DEFAULT '1' COMMENT '1 正常 0异常',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` bigint unsigned NOT NULL,
  `title` varchar(11) NOT NULL,
  `price` int NOT NULL,
  `original_price` int DEFAULT NULL,
  `value` int DEFAULT NULL,
  `badge` varchar(11) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1' COMMENT '1为正常',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `type` varchar(255) DEFAULT NULL COMMENT 'integral 或 day',
  `level` int DEFAULT '1' COMMENT '会员级别 1 普通 2会员 3超级会员',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward`
--

DROP TABLE IF EXISTS `reward`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward` (
  `id` bigint NOT NULL COMMENT '奖励表',
  `category` varchar(255) NOT NULL COMMENT '签到 ｜ 邀请',
  `value` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL COMMENT '天 ｜ 积分',
  `demand` varchar(255) NOT NULL COMMENT '要求 签到是连续 邀请是不连续',
  `status` int NOT NULL DEFAULT '1' COMMENT '1有效',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward`
--

LOCK TABLES `reward` WRITE;
/*!40000 ALTER TABLE `reward` DISABLE KEYS */;
/*!40000 ALTER TABLE `reward` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signin`
--

DROP TABLE IF EXISTS `signin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `signin` (
  `id` bigint unsigned NOT NULL,
  `user_id` bigint NOT NULL,
  `ip` varchar(255) NOT NULL,
  `status` int DEFAULT '1',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signin`
--

LOCK TABLES `signin` WRITE;
/*!40000 ALTER TABLE `signin` DISABLE KEYS */;
INSERT INTO `signin` VALUES (231761476862349312,231756109021450240,'127.0.0.1',1,'2024-10-01 12:57:22','2024-10-01 12:57:22'),(235439390497705984,231756109021450240,'127.0.0.1',1,'2024-10-11 16:32:04','2024-10-11 16:32:04');
/*!40000 ALTER TABLE `signin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `id` bigint unsigned NOT NULL,
  `key` varchar(255) NOT NULL DEFAULT '',
  `host` varchar(255) NOT NULL DEFAULT '',
  `remarks` varchar(255) DEFAULT NULL,
  `models` varchar(255) DEFAULT NULL COMMENT '可用模型',
  `limit` double DEFAULT '0' COMMENT '总限制',
  `usage` double DEFAULT '0' COMMENT '已经使用',
  `status` int DEFAULT '1' COMMENT '1 正常 0异常',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (235469151307567104,'fk229200-nsJozBJhujEia1bHVBtYExXNuWLORVf1','https://oa.api2d.net',NULL,'gpt-3.5-turbo',992,0,1,'2024-10-11 18:30:20','2024-10-12 01:00:14');
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnover`
--

DROP TABLE IF EXISTS `turnover`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnover` (
  `id` bigint unsigned NOT NULL,
  `user_id` bigint NOT NULL COMMENT '用户',
  `describe` varchar(255) NOT NULL COMMENT '描述',
  `value` varchar(255) NOT NULL COMMENT '值',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnover`
--

LOCK TABLES `turnover` WRITE;
/*!40000 ALTER TABLE `turnover` DISABLE KEYS */;
INSERT INTO `turnover` VALUES (61833690270928896,61833690208014336,'注册奖励','100积分','2023-06-20 15:05:00','2023-06-20 15:05:00'),(61874584416161792,61874584357441536,'注册奖励','100积分','2023-06-20 17:47:30','2023-06-20 17:47:30'),(231756109117919232,231756109021450240,'注册奖励','100积分','2024-10-01 12:36:02','2024-10-01 12:36:02'),(231761476862349312,231756109021450240,'签到奖励','100积分','2024-10-01 12:57:22','2024-10-01 12:57:22'),(235439390497705984,231756109021450240,'签到奖励','100积分','2024-10-11 16:32:04','2024-10-11 16:32:04'),(235469224779190272,231756109021450240,'对话(gpt-3.5-turbo)','-25积分','2024-10-11 18:30:38','2024-10-11 18:30:38'),(235469335173271552,231756109021450240,'对话(gpt-3.5-turbo)','-178积分','2024-10-11 18:31:04','2024-10-11 18:31:04'),(235469364072026112,231756109021450240,'对话(gpt-3.5-turbo)','0积分','2024-10-11 18:31:11','2024-10-11 23:08:07'),(235539339860250624,231756109021450240,'对话(gpt-3.5-turbo)','-8积分','2024-10-11 23:09:14','2024-10-11 23:09:14'),(235539358759784448,231756109021450240,'对话(gpt-3.5-turbo)','-8积分','2024-10-11 23:09:19','2024-10-11 23:09:19'),(235539373897027584,231756109021450240,'对话(gpt-3.5-turbo)','-8积分','2024-10-11 23:09:22','2024-10-11 23:09:22'),(235541720849190912,231756109021450240,'对话(gpt-3.5-turbo)','-11积分','2024-10-11 23:18:42','2024-10-11 23:18:42');
/*!40000 ALTER TABLE `turnover` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint unsigned NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `account` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `integral` int DEFAULT '0',
  `vip_expire_time` date NOT NULL COMMENT '会员时间',
  `svip_expire_time` date DEFAULT NULL COMMENT '超级会员时间',
  `status` int NOT NULL DEFAULT '1' COMMENT '1正常',
  `ip` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (61833690208014336,'管理员','admin@ai.com','a66abb5684c45962d887564f08346e8d',' ','administrator',100,'2024-01-01','2024-01-01',1,'113.87.180.24','2023-06-20 15:05:00','2023-06-20 15:17:51'),(61874584357441536,NULL,'123@q.com','e07cf7b22ed1c238d5f0dd73eee65bcd','https://image.lightai.io/icon/header.png','user',100,'2023-06-19','2023-06-19',1,'185.212.58.224','2023-06-20 17:47:30','2023-06-20 17:47:30'),(231756109021450240,'colin66611','colin66611@163.com','ff89de3e6e0acb0fb0558a3df3c10e60','https://image.lightai.io/icon/header.png','administrator',265,'2024-09-30','2024-09-30',1,'127.0.0.1','2024-10-01 12:36:02','2024-10-11 23:18:42');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-12 10:01:43
