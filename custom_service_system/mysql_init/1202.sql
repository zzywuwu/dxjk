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
  `last_menses_time` datetime DEFAULT NULL,
  `due_time` datetime DEFAULT NULL,
  `order_time` datetime DEFAULT NULL,
  `order_over_time` datetime DEFAULT NULL,
  `remarks` varchar(128) DEFAULT '',
  `vip` int(11) DEFAULT '0',
  `familyname` varchar(32) DEFAULT '',
  `familyphonenumber` varchar(32) DEFAULT '',
  `address` varchar(128) DEFAULT '',
  `age` varchar(32) DEFAULT '',
  `customer_type` varchar(32) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `phonenumber` (`phonenumber`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (15,'2015-12-01 14:59:16','2015-12-01 14:59:16','赵哥','','12345678901','','邱容','李维敏','2015-12-01 00:00:00','2015-12-01 00:00:00',NULL,NULL,'',0,'','','','34','');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
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
  `user_id` int(11) DEFAULT 0,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `visit_date` datetime NOT NULL,
  `visit_time` varchar(32) DEFAULT '',
  `visit_type` varchar(512) DEFAULT '',
  `order_success` int(11) DEFAULT '0',
  `visit_doctor_name` varchar(32) DEFAULT '',
  `visit_address` varchar(128) DEFAULT '',
  `result` varchar(256) DEFAULT '',
  `doctor_advise` varchar(128) DEFAULT '',
  `remarks` varchar(128) DEFAULT '',
  `servicename` varchar(32) DEFAULT '',
  `verify` int(11) DEFAULT '0',
  `status` int(11) DEFAULT '0',
  `fzinfo` varchar(1024) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record`
--

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
