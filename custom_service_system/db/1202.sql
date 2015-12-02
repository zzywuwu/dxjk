-- MySQL dump 10.13  Distrib 5.6.27, for Linux (x86_64)
--
-- Host: localhost    Database: dtjx
-- ------------------------------------------------------
-- Server version	5.6.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(32) NOT NULL,
  `idnumber` varchar(32) DEFAULT '',
  `phonenumber` varchar(32) NOT NULL,
  `wx` varchar(32) DEFAULT '',
  `sellname` varchar(32) DEFAULT '',
  `doctor_name` varchar(32) DEFAULT '',
  `last_menses_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `due_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `order_time` datetime DEFAULT NULL,
  `order_over_time` datetime DEFAULT NULL,
  `remarks` varchar(128) DEFAULT '',
  `vip` int(11) DEFAULT '0',
  `familyname` varchar(32) DEFAULT '',
  `familyphonenumber` varchar(32) DEFAULT '',
  `address` varchar(128) DEFAULT '',
  `age` varchar(32) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `phonenumber` (`phonenumber`),
  KEY `sellname` (`sellname`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'2015-11-30 08:10:35','2015-11-30 08:10:48','1','','1','','邱容','李维敏','2015-11-03 00:00:00','2015-11-03 00:00:00',NULL,NULL,'',3,'','','','1'),(2,'2015-11-30 09:01:00','2015-12-01 05:49:02','钟佳怡','','18628218625','','王君','张力','2015-03-16 00:00:00','2015-12-22 00:00:00',NULL,NULL,'',3,'','','','33岁'),(3,'2015-12-01 05:48:06','2015-12-01 05:48:06','谢文勤','','18981738525','','陈淘','彭冰','2015-08-24 00:00:00','2016-05-29 00:00:00',NULL,NULL,'',0,'余任游','18783754105','','31'),(4,'2015-12-01 05:52:21','2015-12-01 05:53:00','吴建华','','13880705598','','邱容','彭冰','2015-05-15 00:00:00','2016-02-22 00:00:00','2015-08-13 00:00:00','2016-02-12 00:00:00','',1,'柳科新','13880615516','','35'),(5,'2015-12-01 05:55:54','2015-12-01 06:25:05','曾萍','','13086621333','','王君','游泳','2015-07-09 00:00:00','2016-04-13 00:00:00','2015-09-30 00:00:00','2016-04-29 00:00:00','',1,'苏胜强','13990938911','','34岁'),(6,'2015-12-01 06:23:07','2015-12-01 06:24:35','王惠','','13540794444','','邱容','彭冰','2015-08-29 00:00:00','2016-06-09 00:00:00','2015-11-23 00:00:00','2016-05-22 00:00:00','',1,'李鑫恒','18628015728','成都市锦江区东光街办','29'),(7,'2015-12-01 06:26:26','2015-12-01 06:26:26','赵轶','','13908221270','','王君','姚强','2015-07-11 00:00:00','2016-04-17 00:00:00',NULL,NULL,'',0,'李洋','13688160678','新都镇城关（西）新城马超社区','34'),(8,'2015-12-01 06:30:31','2015-12-01 06:30:31','郑希','','15881024691','','王君','王晓东','2015-05-06 00:00:00','2016-02-14 00:00:00',NULL,NULL,'',0,'钟燃','15928744939','成都市高新区天顺路66号','25'),(9,'2015-12-01 06:33:30','2015-12-01 06:33:30','鄢纬','','13689091879','','张红莉','王晓东','2015-05-14 00:00:00','2016-02-15 00:00:00',NULL,NULL,'',0,'周子淳','','温江区长安路101号','29岁'),(10,'2015-12-01 06:38:19','2015-12-01 06:38:19','岳进雪','','15828466663','','王君','游泳','2015-06-10 00:00:00','2016-03-21 00:00:00',NULL,NULL,'',0,'汪懋强','13778572222','高新区西区合作镇街道办事处','24岁'),(11,'2015-12-01 06:48:15','2015-12-01 06:48:15','袁利','','13881821657','','邱容','姚强','2015-07-07 00:00:00','2016-04-11 00:00:00',NULL,NULL,'',0,'李建','13551830138','成都市天府新区华阳街道','28岁'),(12,'2015-12-01 07:11:25','2015-12-01 07:13:31','胡成霞','','13880657995','','邱容','姚强','2015-06-14 00:00:00','2016-03-20 00:00:00','2015-09-08 00:00:00','2016-04-07 00:00:00','',1,'李圣冲','13308215673','成都市龙泉驿区龙泉街道办事处','41岁'),(13,'2015-12-01 07:36:27','2015-12-01 07:37:19','汪蓓蓓','','18123233320','','王君','胡雅毅','2015-04-14 00:00:00','2016-01-24 00:00:00','2015-07-06 00:00:00','2016-02-05 00:00:00','',1,'邓可','18602862867','成都市高升桥东路9号竺桂苑','32'),(14,'2015-12-01 08:00:32','2015-12-01 08:11:40','袁媛','511002198303275627','13880885327','','邱容','姚强','2015-06-15 00:00:00','2016-03-19 00:00:00','2015-09-10 00:00:00','2016-04-09 00:00:00','',1,'','13551111820','成都市武侯区簇桥街办','32岁'),(15,'2015-12-01 14:59:16','2015-12-01 14:59:16','赵哥','','12345678901','','邱容','李维敏','2015-12-01 00:00:00','2015-12-01 00:00:00',NULL,NULL,'',0,'','','','34');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `customer_id` int(11) NOT NULL DEFAULT '0',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `servicename` varchar(32) DEFAULT '',
  `visit_date` datetime NOT NULL,
  `visit_time` varchar(32) DEFAULT '08:00',
  `visit_type` varchar(32) DEFAULT '',
  `order_success` int(11) DEFAULT '0',
  `visit_doctor_name` varchar(32) DEFAULT '',
  `visit_address` varchar(128) DEFAULT '',
  `remarks` varchar(128) DEFAULT '',
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (5,'2015-12-01 06:52:07','2015-12-01 06:52:07','邱容','2016-01-11 23:59:59','09:30','看医生',1,'游泳','产科','上午游泳15号'),(12,'2015-12-01 07:21:16','2015-12-01 07:21:16','邱容','2015-12-22 23:59:59','14:30','看医生',1,'姚强','产科','下午姚强39号'),(13,'2015-12-01 07:56:27','2015-12-01 07:56:27','邱容','2015-12-10 23:59:59','15:00','看医生',1,'胡雅毅','产科','下午68号'),(14,'2015-12-01 08:18:50','2015-12-01 08:18:50','邱容','2015-12-10 23:59:59','15:00','看医生',1,'姚强','产科','下午32号');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `record`
--

DROP TABLE IF EXISTS `record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `servicename` varchar(32) DEFAULT '',
  `visit_date` datetime NOT NULL,
  `visit_time` varchar(32) DEFAULT '',
  `next_visit_date` varchar(32) DEFAULT '',
  `visit_type` varchar(32) DEFAULT '',
  `visit_doctor_name` varchar(32) DEFAULT '',
  `result` varchar(256) DEFAULT '',
  `doctor_advise` varchar(128) DEFAULT '',
  `remarks` varchar(128) DEFAULT '',
  `verify` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `servicename` (`servicename`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record`
--

LOCK TABLES `record` WRITE;
/*!40000 ALTER TABLE `record` DISABLE KEYS */;
INSERT INTO `record` VALUES (1,6,6,'2015-12-01 06:27:36','2015-12-01 06:27:36','邱容','2015-11-23 00:00:00','09:00','2015-12-07','建卡','游泳','孕12+2 宫高8 腹围75 血压85/58\n体重52','瘢痕子宫 定期产检 4-6周复诊\n建卡全套','',0),(2,4,6,'2015-12-01 06:31:15','2015-12-01 06:31:15','邱容','2015-08-13 00:00:00','14:00','2015-12-21','建卡','彭冰','孕12+6 宫高9 腹围87 体重58公斤','建卡全套 4-5周复诊','',0),(3,4,6,'2015-12-01 06:32:48','2015-12-01 06:32:48','邱容','2015-08-21 00:00:00','14:00','2015-09-01','建卡','彭冰','看报告','预约羊穿 4周复诊','',0),(4,4,6,'2015-12-01 06:34:11','2015-12-01 06:34:11','邱容','2015-09-01 00:00:00','14:00','2015-10-13','看医生','彭冰','孕周15+4 宫高13 腹围89 血压114/68 体重60','5周复诊','',0),(5,4,6,'2015-12-01 06:35:58','2015-12-01 06:35:58','邱容','2015-10-13 00:00:00','14:00','2015-11-24','看医生','彭冰','孕周21+4  宫高19 腹围95 血压117/68 体重64','6周复诊','',0),(6,4,6,'2015-12-01 06:38:39','2015-12-01 06:38:39','邱容','2015-11-24 00:00:00','14:00','2015-12-22','看医生','彭冰','孕周27+4 宫高24 腹围97 血压117/77 体重65','4周复诊 GDM餐后血糖偏高 调整饮食 检测血糖','',0),(7,5,6,'2015-12-01 06:46:37','2015-12-01 06:46:37','邱容','2015-09-30 00:00:00','09:00','2015-10-19','建卡','游泳','孕周11+6 宫高6 腹围79 血压118/77 体重60','4周复诊 建卡全套 ','',0),(8,5,6,'2015-12-01 06:47:55','2015-12-01 06:47:55','邱容','2015-10-19 00:00:00','09:00','2015-11-30','看医生','游泳','孕周14+4 腹围14 宫高81 血压108/75 体重57','6周复诊','',0),(9,12,6,'2015-12-01 07:15:36','2015-12-01 07:15:36','邱容','2015-09-08 00:00:00','14:00','2015-10-15','建卡','姚强','孕12+2 宫高10 腹围86 血压121/53 体重53.5','建卡全套 4-5周复诊','',0),(10,12,6,'2015-12-01 07:17:52','2015-12-01 07:17:52','邱容','2015-10-15 00:00:00','14:00','2015-11-17','看医生','姚强','孕17+4周 宫高14 腹围91 血压125/78 体重56','预约羊水穿刺','',0),(11,12,6,'2015-12-01 07:19:38','2015-12-01 07:33:19','邱容','2015-11-17 00:00:00','14:00','2015-12-22','看医生','姚强','孕22+2 体重59.5 血压112/67 宫高20 腹围94 ',' 75克糖 胎儿心脏系统彩超','2015.12.1下午15:00未接回访电话两次 王君12.1',0),(12,13,6,'2015-12-01 07:39:13','2015-12-01 14:03:15','邱容','2015-07-06 00:00:00','14:00','2015-08-06','建卡','胡雅毅','孕11+6周 ','建卡全套','',1),(13,13,6,'2015-12-01 07:48:27','2015-12-01 07:48:27','邱容','2015-08-06 00:00:00','14:00','2015-09-10','看医生','胡雅毅','孕16+2周 宫高12 腹围78 血压117/75 体重49','补铁补钙多种维生素','',0),(14,13,6,'2015-12-01 07:50:35','2015-12-01 07:50:35','邱容','2015-09-10 00:00:00','14:00','2015-10-08','看医生','姚强','孕21+2 周 体重51 血压114/74 腹围79 宫高19','查75克糖 血尿常规','',0),(15,13,6,'2015-12-01 07:52:43','2015-12-01 07:52:43','邱容','2015-10-08 00:00:00','14:00','2015-11-05','看医生','胡雅毅','孕25+2周 体重51 血压114/74 宫高21 腹围81 ','B超 4周复诊胎儿略小遗传咨询','',0),(16,13,6,'2015-12-01 07:54:11','2015-12-01 07:54:11','邱容','2015-11-05 00:00:00','14:00','2015-11-26','看医生','胡雅毅','孕29+2 体重53 宫高26 腹围86 血压125/80','心电图 心脏彩超加彩超','',0),(17,13,6,'2015-12-01 07:55:35','2015-12-01 07:55:35','邱容','2015-11-26 00:00:00','14:00','2015-12-10','看医生','姚强','孕周32+2周 体重59 血压114/77 宫高30 腹围90','肝肾功 血尿常规','',0),(18,14,6,'2015-12-01 08:14:20','2015-12-01 08:14:20','邱容','2015-09-10 00:00:00','14:00','2015-10-08','建卡','姚强','孕12+3 体重58 腹围82 宫高7 血压104/62','定期产检 建卡全套','',0),(19,14,6,'2015-12-01 08:15:30','2015-12-01 08:15:30','邱容','2015-10-08 00:00:00','14:00','2015-10-15','看医生','姚强','孕16+3周 宫高13 腹围87 血压111/69 体重62.5','唐筛','',0),(20,14,6,'2015-12-01 08:16:32','2015-12-01 08:16:32','邱容','2015-10-15 00:00:00','14:00','2015-11-05','看医生','姚强','17+3周 看报告','','',0),(21,14,6,'2015-12-01 08:18:07','2015-12-01 08:18:07','邱容','2015-11-05 00:00:00','14:00','2015-12-10','看医生','姚强','孕周20+3 体重64 血压113/71 腹围88 宫高17 腹围88','75克糖，血尿常规','',0);
/*!40000 ALTER TABLE `record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(32) NOT NULL DEFAULT 'not actived',
  `privilege` int(11) NOT NULL DEFAULT '2006',
  `name` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `phonenumber` varchar(32) NOT NULL,
  `wx` varchar(32) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `phonenumber` (`phonenumber`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'2015-11-30 00:59:54','2015-11-30 00:59:54','2015-11-30 00:59:54','not actived',2038,'邱容','123456','13541235352',''),(3,'2015-11-30 00:59:54','2015-11-30 00:59:54','2015-11-30 00:59:54','not actived',2006,'陈淘','123456','15198073537','Caroline1468178921'),(4,'2015-11-30 00:59:54','2015-11-30 00:59:54','2015-11-30 00:59:54','not actived',2006,'吕环宇','123456','13980870629',''),(5,'2015-11-30 00:59:54','2015-11-30 00:59:54','2015-11-30 00:59:54','not actived',2006,'余澜悦','123456','13980870629',''),(6,'2015-11-30 00:59:54','2015-11-30 00:59:54','2015-12-01 14:57:59','actived',2047,'王君','wj0629','13980870629','zz830629'),(7,'2015-11-30 00:59:54','2015-11-30 00:59:54','2015-11-30 00:59:54','not actived',2006,'余军','123456','15108407210','huaxibaishitong'),(8,'2015-11-30 00:59:54','2015-11-30 00:59:54','2015-11-30 00:59:54','not actived',2006,'李瑞雪','123456','18215676176','xue1599859401'),(9,'2015-12-01 06:40:16','2015-12-01 06:45:59','2015-12-01 06:45:40','actived',2006,'张洪莉','123456','18908182406','zhanghongli7202');
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

-- Dump completed on 2015-12-02 10:43:46
