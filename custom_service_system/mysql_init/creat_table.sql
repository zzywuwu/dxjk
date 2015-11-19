DROP DATABASE IF EXISTS cloud;
CREATE DATABASE cloud;
USE cloud;
CREATE TABLE IF NOT EXISTS `KF_SYS_USR` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `create_time` TIMESTAMP DEFAULT NOW(),
        `update_time` TIMESTAMP DEFAULT '0000-00-00 00:00:00',
        `last_login_time` TIMESTAMP DEFAULT '0000-00-00 00:00:00',
        `status` VARCHAR(32)  DEFAULT 'not actived' NOT NULL,
        `privilege` INT,
        `name` VARCHAR(128),
        `email` VARCHAR(128),
        `password` VARCHAR(32) DEFAULT NULL COMMENT '密码',
         PRIMARY KEY (`name`),
         KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统用户名';

CREATE TABLE IF NOT EXISTS `market_upgrade_message` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `type` INT DEFAULT 0,
        `title` VARCHAR(64) DEFAULT NULL,
        `zhcn_msg` VARCHAR(1024),
        `en_msg` VARCHAR(1024),
        `zhtw_msg` VARCHAR(1024),
        `start_time` TIMESTAMP DEFAULT NOW() ,
        `end_time` TIMESTAMP DEFAULT '2030-12-31 00:00:00',
        `production` VARCHAR(128) DEFAULT NULL,
         PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='营销升级消息';

CREATE TABLE IF NOT EXISTS `KF_SYS_ORDER` (
`id` INT NOT NULL AUTO_INCREMENT,
`create_time` TIMESTAMP DEFAULT NOW(),
`update_time` TIMESTAMP DEFAULT NOW(),
`status` VARCHAR(128) NOT NULL,
`user_id` INT,
`kf_id` INT,
`feedback` INT,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='问题单表';

CREATE TABLE IF NOT EXISTS `KF_APP_USR` (
`id` INT NOT NULL AUTO_INCREMENT,
`create_time` TIMESTAMP DEFAULT NOW(),
`name` VARCHAR(128),
PRIMARY KEY (`name`),
KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='APP用户名';

CREATE TABLE IF NOT EXISTS `KF_SYS_CONTENT` (
`id` INT NOT NULL,
`contents` MEDIUMTEXT,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='内容表';
CREATE OR REPLACE VIEW KF_VIEW_UNDISTRIBUTED AS select KF_SYS_CONTENT.id,update_time,status,user_id,kf_id,contents from KF_SYS_ORDER inner join KF_SYS_CONTENT on KF_SYS_ORDER.id=KF_SYS_CONTENT.id and status=1;
CREATE OR REPLACE VIEW KF_VIEW_DISTRIBUTED AS select KF_SYS_CONTENT.id,update_time,status,user_id,kf_id,contents from KF_SYS_ORDER inner join KF_SYS_CONTENT on KF_SYS_ORDER.id=KF_SYS_CONTENT.id and status=2;
CREATE OR REPLACE VIEW KF_VIEW_PROCESSING AS select KF_SYS_CONTENT.id,update_time,status,user_id,kf_id,contents from KF_SYS_ORDER inner join KF_SYS_CONTENT on KF_SYS_ORDER.id=KF_SYS_CONTENT.id and status=3;
CREATE OR REPLACE VIEW KF_VIEW_PROCESSED AS select KF_SYS_CONTENT.id,update_time,status,user_id,kf_id,contents from KF_SYS_ORDER inner join KF_SYS_CONTENT on KF_SYS_ORDER.id=KF_SYS_CONTENT.id and status=4;

